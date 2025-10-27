using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class CartController : ControllerBase
    {
        private readonly ProductDbContext _context;



        public CartController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart()
        {
            return await _context.Cart.ToListAsync();
        }

        // GET: api/Carts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            if(id <= 0)
            {
                return BadRequest();
            }
            var cart = await (
                from c in _context.Cart 
                where c.UID == id 
                join p in _context.Products on c.PID equals p.PID 
                select new {
                    c.CID,
                    p.ProductName,
                    p.Price,
                    c.Quantity, 
                    p.Image,
                    p.Stocks,
                }).ToListAsync();
            
            if (cart == null)
            {
                return NotFound();
            }

            return Ok(cart);
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(int id ,[FromBody] CartUpdateQuantityDto dto)
        {

            if (dto == null || id <= 0)
            {
                return BadRequest();
            }

            var existingCart = await _context.Cart.FindAsync(id);

            if (existingCart == null)
            {
                return NotFound();
            }

            existingCart.Quantity = dto.Quantity;

            await _context.SaveChangesAsync();
            return NoContent();

        }

        // POST: api/Carts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cart>> PostCart([FromBody]CartItemDto cartItem)
        {
            if (cartItem == null || cartItem.UID <= 0 || cartItem.PID <= 0 || cartItem.Quantity <= 0)
            {
                return BadRequest();
            }

            var existingItem = await _context.Cart.FirstOrDefaultAsync(c => c.UID == cartItem.UID && c.PID == cartItem.PID);

            if (existingItem != null)
            {
                existingItem.Quantity += cartItem.Quantity;
                _context.Cart.Update(existingItem);
            }
            else
            {
            var newItem = new Cart
                {
                    UID = cartItem.UID,
                    PID = cartItem.PID,
                    Quantity = cartItem.Quantity,
                    
                };

                await _context.Cart.AddAsync(newItem);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var cart = await _context.Cart.FindAsync(id);
            if (cart == null)
            {
                return NotFound();
            }

            _context.Cart.Remove(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CartExists(int id)
        {
            return _context.Cart.Any(e => e.CID == id);
        }
    }
}
