using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Helpers;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductApi.Data;
using ProductApi.Models;

namespace ProductApi.Control
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ProductDbContext _context;
        public OrdersController(ProductDbContext context)
        {
            _context = context;
        }
        // GET: api/Orders
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrder()
        {
            var order = await (from o in _context.Order
                               join ot in _context.OrderTrackers on o.OID equals ot.OID
                               orderby o.OID descending
                               select new
                               {
                                   o.OID,
                                   o.Address,
                                   o.Orderdate,
                                   o.PaymentStatus,
                                   ot.status
                               }).ToListAsync();
            return Ok(order);
        }
        // GET: api/Orders/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            
            if (id <= 0)
            {
                return NotFound();
            }

            var order = await (from o in _context.Order
                               join a in _context.Address on o.UID equals a.UID
                               join ot in _context.OrderTrackers on o.OID equals ot.OID
                               where o.UID == id && a.IsPrimary == true
                               orderby o.OID descending
                               select new
                               {
                                   o.OID,
                                   a.UserName,
                                   a.PhoneNumber,
                                   o.Address,
                                   o.Orderdate,
                                   o.PaymentStatus,
                                   ot.status,
                                   OrderItems = (from oi in _context.OrderItem
                                                 where oi.OID == o.OID
                                                 select new
                                                 {
                                                     oi.Image,
                                                     oi.ProductName,
                                                     oi.Price,
                                                     oi.Quantity,
                                                 }).ToList()

                               }).ToListAsync();

            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }
        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> PostOrder([FromBody] OrderPlaceDto dto)
        {
            Console.WriteLine(dto.UID);
            var addres = await _context.Address.FirstOrDefaultAsync(u=>u.UID == dto.UID);
            if (addres == null)
            {
                return Ok("No Address found");
            }
            var cartItems = await (from c in _context.Cart
                                   join p in _context.Products on c.PID equals p.PID
                                   join a in _context.Address on c.UID equals a.UID
                                   where c.UID == dto.UID && a.IsPrimary == true
                                   select new
                                   {
                                       a.UserName,
                                       a.PhoneNumber,
                                       a.HouseNo,
                                       a.Colony,
                                       a.Pincode,
                                       a.City,
                                       a.State,
                                       a.Landmark,
                                       a.Area,
                                       p.PID,
                                       p.ProductName,
                                       p.Image,
                                       c.Quantity,
                                       p.Price,
                                       p.Stocks
                                   }).ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Cart is empty");

            var outOfStockItems = cartItems
                .Where(item => item.Stocks < item.Quantity)
                .Select(item => $"{item.ProductName} (Available: {item.Stocks}, Requested: {item.Quantity})")
                .ToList();

            if (outOfStockItems.Any())
            {
                return BadRequest(new
                {
                    Message = "Some items are out of stock or insufficient quantity.",
                    Items = outOfStockItems
                });
            }

            var createdOrders = new List<object>();

            foreach (var item in cartItems)
            {
                var address = $"House no {item.HouseNo} {item.Colony} {item.Area} near {item.Landmark} {item.City}, {item.State} Pincode- {item.Pincode}";

                var order = new Order
                {
                    UID = dto.UID,
                    Orderdate = DateTime.Now,
                    PaymentStatus = "Unpaid",
                    Address = address,
                    OrderItems = new List<OrderItem>()
                };

                await _context.Order.AddAsync(order);
                await _context.SaveChangesAsync();

                var orderItem = new OrderItem
                {
                    OID = order.OID,
                    UID = dto.UID,
                    PID = item.PID,
                    ProductName = item.ProductName,
                    Image = item.Image,
                    Price = item.Price,
                    Quantity = item.Quantity
                };

                await _context.OrderItem.AddAsync(orderItem);
                order.OrderItems.Add(orderItem);

                var product = await _context.Products.FindAsync(item.PID);
                if (product != null)
                {
                    product.Stocks -= item.Quantity;
                }

                var orderTracker = new OrderTracker
                {
                    OID = order.OID,
                    status = ["Order Placed"]
                };

                await _context.OrderTrackers.AddAsync(orderTracker);

                createdOrders.Add(new
                {
                    OrderID = order.OID,
                    Product = item.ProductName,
                    Quantity = item.Quantity,
                    Price = item.Price
                });
            }

            var cartToRemove = _context.Cart.Where(c => c.UID == dto.UID);
            _context.Cart.RemoveRange(cartToRemove);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Orders placed successfully.",
                Orders = createdOrders
            });
        }
    }


    }




