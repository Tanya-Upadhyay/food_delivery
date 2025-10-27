using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductApi.Data;
using ProductApi.Migrations;
using ProductApi.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ProductApi.Control
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductDbContext _context;
        public ProductsController(ProductDbContext context)
        {
            _context = context;
        }

        [HttpGet("best-seller")]
        public async Task<IActionResult> GetBestSellers([FromQuery] int top = 10)
        {

            var bestSellingProductIds = await _context.OrderItem
                .GroupBy(oi => oi.PID)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(top)
                .ToListAsync();


            var productIds = bestSellingProductIds.Select(x => x.ProductId).ToList();


            var products = await _context.Products
                .Where(p => productIds.Contains(p.PID))
                .Select(p => new
                {
                    p.PID,
                    p.ProductName,
                    p.Price,
                    p.Image,
                    p.Type
                })
                .ToListAsync();


            var result = bestSellingProductIds
                .Select(x => new
                {
                    ProductId = x.ProductId,
                    TotalSold = x.TotalSold,
                    Product = products.FirstOrDefault(p => p.PID == x.ProductId)
                })
                .ToList();

            return Ok(result);
        }



        // GET: api/Products
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Products>>> GetProducts(
        int pageNumber = 1,
        int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            var query = _context.Products.AsQueryable();

            // Get total count 
            var totalCount = await query.CountAsync();

            //  pagination
            var products = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Return metadata with response
            var response = new
            {
                TotalItems = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = products
            };
            return Ok(response);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<object>>> GetActiveProducts(
    int pageNumber = 1,
    int pageSize = 10,
    string? searchTerm = null)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = from p in _context.Products
                        where p.ProductStatus == "active"
                        select new
                        {
                            Product = p,
                           
                            TotalSold = _context.OrderItem
                                .Where(oi => oi.PID == p.PID)
                                .Sum(oi => (int?)oi.Quantity) ?? 0
                        };

            
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(x =>
                    x.Product.ProductName.Contains(searchTerm) ||
                    x.Product.Category.Contains(searchTerm) ||
                    x.Product.Price.ToString().Contains(searchTerm) ||
                    x.Product.Type.Contains(searchTerm));
            }

            
            var totalCount = await query.CountAsync();

           
            var result = await query
                .OrderByDescending(x => x.TotalSold)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    x.Product.PID,
                    x.Product.ProductName,
                    x.Product.Price,
                    x.Product.Image,
                    x.Product.Type,
                    x.Product.Category,
                    x.Product.Stocks,
                    x.TotalSold
                })
                .ToListAsync();

            
            var response = new
            {
                TotalItems = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = result
            };

            return Ok(response);
        }




        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Products>> GetProducts(int id)
        {
            var products = await _context.Products.FindAsync(id);

            if (products == null)
            {
                return NotFound();
            }
            return products;
        }
        


        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PutProducts(int id, [FromForm] ProductCreateDto dto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            existingProduct.ProductName = dto.ProductName;
            existingProduct.Category = dto.Category;
            existingProduct.Type = dto.Type;
            existingProduct.Price = dto.Price;
            existingProduct.Stocks = dto.Stock;
            existingProduct.ProductStatus = dto.ProductStatus;

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                if (!string.IsNullOrEmpty(existingProduct.Image))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingProduct.Image.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{dto.ImageFile.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }
                existingProduct.Image = $"/images/{uniqueFileName}";
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Products>> PostProduct([FromForm] ProductCreateDto dto)
        {
            if (dto.ImageFile == null || dto.ImageFile.Length == 0)
                return BadRequest("Image file is required.");
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);
            var uniqueFileName = $"{Guid.NewGuid()}_{dto.ImageFile.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(stream);
            }
            var product = new Products
            {
                ProductName = dto.ProductName,
                Category = dto.Category,
                Type = dto.Type,
                Price = dto.Price,
                Image = filePath.Replace(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), ""),
                Stocks = dto.Stock
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetProducts", new { id = product.PID }, product);
        }
        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducts(int id)
        {
            var products = await _context.Products.FindAsync(id);
            if (products == null)
            {
                return NotFound();
            }
            _context.Products.Remove(products);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private bool ProductsExists(int id)
        {
            return _context.Products.Any(e => e.PID == id);
        }
    }
}
