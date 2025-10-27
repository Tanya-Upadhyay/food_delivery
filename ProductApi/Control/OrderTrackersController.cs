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
    public class OrderTrackersController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public OrderTrackersController(ProductDbContext context)
        {
            _context = context;
        }

        // PUT: api/OrderTrackers/
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "admin")]
        [HttpPut("{OID}/{status}")]
        public async Task<IActionResult> PutOrderTracker(int OID, string status)
        {
            var orderTracker = await _context.OrderTrackers.FirstOrDefaultAsync(x=>x.OID == OID);
            orderTracker?.status.Add(status);
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

    

        

        private bool OrderTrackerExists(int id)
        {
            return _context.OrderTrackers.Any(e => e.OTID == id);
        }
    }
}
