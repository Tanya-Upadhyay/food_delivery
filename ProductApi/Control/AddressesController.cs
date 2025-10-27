using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
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
    public class AddressesController : ControllerBase
    {
        private readonly ProductDbContext _context;
        public AddressesController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Addresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Address>>> GetAddress()
        {
            return await _context.Address.ToListAsync();
        }

        // GET: api/Addresses/5
        [Authorize]
        [HttpGet("{uid}")]
        public async Task<ActionResult<Address>> GetAddress(int uid)
        {
            var address = await (from A in _context.Address where A.UID == uid select A
        ).ToListAsync();
            if (address == null)
            {
                return NotFound();
            }
            return Ok(address);
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddress(int id)
        {
            var address = _context.Address.FirstOrDefault(a => a.AID == id);
            Console.WriteLine(address);
            address.IsPrimary = true;
            _context.SaveChanges();
            var existingAddress = await (from a in _context.Address where a.UID == address.UID && a.AID != id select a).ToListAsync();
            if (address.IsPrimary == true && existingAddress != null)
            {
                foreach (var item in existingAddress)
                {
                    item.IsPrimary = false;
                }
            }
            await _context.SaveChangesAsync();
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        

        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Address>> PostAddress( Address address)
        {
            if (address == null)
            {
                return Ok("address null");
            }
            var existingAddress = await (from a in _context.Address where a.UID == address.UID select a).ToListAsync();
            
            
            if (address.IsPrimary == true && existingAddress != null)
            {
                foreach (var item in existingAddress)
                {
                    item.IsPrimary = false;
                    
                }
            }
            _context.Address.Add(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAddress", new { id = address.AID }, address);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var address = await _context.Address.FindAsync(id);
            if (address == null)
            {
                return NotFound();
            }
            if (address.IsPrimary == true)
            {
                return BadRequest(new {message = "Primary Address cannot be deleted." });
            }
            _context.Address.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AddressExists(int id)
        {
            return _context.Address.Any(e => e.AID == id);
        }
    }
}
