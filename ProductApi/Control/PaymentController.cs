using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ProductApi.Data;
using ProductApi.Models;
using Razorpay.Api;
using System;
using System.Security.Cryptography;
using System.Text;

namespace ProductApi.Control
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly ProductDbContext _context;
        private readonly IConfiguration _configuration ;

        public PaymentController(ProductDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
           
        }

        [HttpPost("create-order")]
        
        public IActionResult createOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                var paymentSettings = _configuration.GetSection("Razorpay");
                RazorpayClient client = new RazorpayClient(paymentSettings["Key"], paymentSettings["Secret"]);

                var options = new Dictionary<string, object>
        {
            { "amount", request.Amount * 100 },
            { "currency", request.Currency },
            { "payment_capture", 1 }
        };

                Razorpay.Api.Order order = client.Order.Create(options);

                
                Console.WriteLine("Razorpay Order Created: " + order.ToString());

                var orderId = order["id"].ToString();
                var amount = order["amount"].ToString();
                var currency = order["currency"].ToString();

                return Ok(new
                {
                    orderId,
                    amount,
                    currency
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating Razorpay order: " + ex.Message);
                return StatusCode(500, new { message = "Failed to create payment order", error = ex.Message });
            }
        }


        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
        {
            if (request == null ||
                string.IsNullOrEmpty(request.OrderId) ||
                string.IsNullOrEmpty(request.PaymentId) ||
                string.IsNullOrEmpty(request.Signature))
            {
                return BadRequest(new { success = false, message = "Invalid request data." });
            }

            try
            {
               
                string payload = $"{request.OrderId}|{request.PaymentId}";

                var paymentSettings = _configuration.GetSection("Razorpay");
                string secret = paymentSettings["Secret"];

                if (string.IsNullOrEmpty(secret))
                {
                    return StatusCode(500, new { success = false, message = "Payment gateway secret is missing." });
                }

                string generatedSignature;
                using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret)))
                {
                    byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                    generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
                }

                
                if (generatedSignature == request.Signature.ToLower())
                {
                    var payment = new ProductApi.Models.Payment
                    {
                        RazorpayOrderId = request.OrderId,
                        RazorpayPaymentId = request.PaymentId,
                        RazorpaySignature = request.Signature,
                        Amount = request.Amount,
                        Currency = request.Currency,
                        Status = "Paid",
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Payments.Add(payment);
                    await _context.SaveChangesAsync();

                    return Ok(new { success = true, message = "Payment verified and saved successfully." });
                }

                
                return BadRequest(new { success = false, message = "Invalid payment signature." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Payment verification error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred while verifying the payment." });
            }
        }


    }
}
