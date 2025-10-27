using Microsoft.AspNetCore.Mvc;
using ProductApi.Data;
using ProductApi.Models;
using ProductApi.Helpers;
using ProductApi.Services;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity.Data;

namespace ProductApi.Control
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ProductDbContext _context;
        private readonly JwtTokenGenerator _jwtTokenGenerator;
        private readonly EmailService _emailService;

        public AuthController(ProductDbContext context, JwtTokenGenerator jwtTokenGenerator, EmailService emailService)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
            _emailService = emailService;
        }

        // Register
        [HttpPost("api/register")]
        public async Task<IActionResult> Register([FromBody] ProductApi.Models.RegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest(new { message = "Email already registered" });

            if (_context.Users.Any(u => u.PhoneNumber == request.PhoneNumber))
                return BadRequest(new { message = "Phone number already registered" });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Roles = "user"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var credentials = new UserCredentials
            {
                UCID = user.UID,
                Email = user.Email,
                HashPassword = HashPassword(request.Password)
            };

            _context.UserCredentials.Add(credentials);
            _context.SaveChanges();

            // Generate OTP
            var otp = new Random().Next(100000, 999999).ToString();
            var verification = new EmailVerification
            {
                Email = user.Email,
                OTP = otp,
                Expiry = DateTime.UtcNow.AddMinutes(10),
                IsVerified = false
            };

            _context.EmailVerifications.Add(verification);
            _context.SaveChanges();

            await _emailService.SendOtpEmailAsync(user.Email, otp);

            return Ok(new
            {
                message = "Registration successful. Please verify your email using the OTP sent.",
                uid = user.UID,
                name = user.Name
            });
        }

        // Verify OTP and auto-login
        [HttpPost("api/verify-email")]
        public IActionResult VerifyEmail([FromBody] ProductApi.Models.EmailVerificationRequest request)
        {
            var record = _context.EmailVerifications
                .FirstOrDefault(v => v.Email == request.Email && v.OTP == request.OTP && !v.IsVerified);

            if (record == null || record.Expiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired OTP" });

            record.IsVerified = true;
            _context.SaveChanges();

            // Get user
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized(new { message = "User not found." });

            // Generate token (auto-login)
            var token = _jwtTokenGenerator.GenerateToken(user.UID.ToString(), user.Email, user.Roles);

            return Ok(new
            {
                message = "Email verified successfully.",
                uid = user.UID,
                name = user.Name,
                AuthToken = token
            });
        }

        // Login
        [HttpPost("api/login")]
        public IActionResult Login([FromBody] ProductApi.Models.LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var credential = _context.UserCredentials.FirstOrDefault(c => c.UCID == user.UID);
            if (credential == null || !VerifyPassword(request.Password, credential.HashPassword))
                return Unauthorized(new { message = "Invalid email or password" });

            var verification = _context.EmailVerifications.FirstOrDefault(v => v.Email == user.Email);
            if (verification == null || !verification.IsVerified)
                return Unauthorized(new { message = "Please verify your email before logging in." });

            var token = _jwtTokenGenerator.GenerateToken(user.UID.ToString(), user.Email, user.Roles);

            return Ok(new
            {
                message = "Login successful",
                uid = user.UID,
                name = user.Name,
                AuthToken = token
            });
        }

        // Forgot Password - Send OTP
        [HttpPost("api/forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ProductApi.Models.ForgotPasswordRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
                return BadRequest(new { message = "Email not found" });

            // Generate OTP
            var otp = new Random().Next(100000, 999999).ToString();

            var verification = _context.EmailVerifications
                .FirstOrDefault(v => v.Email == request.Email);

            if (verification != null)
            {
                verification.OTP = otp;
                verification.Expiry = DateTime.UtcNow.AddMinutes(10);
                verification.IsVerified = false;
            }
            else
            {
                _context.EmailVerifications.Add(new EmailVerification
                {
                    Email = request.Email,
                    OTP = otp,
                    Expiry = DateTime.UtcNow.AddMinutes(10),
                    IsVerified = false
                });
            }

            _context.SaveChanges();

            await _emailService.SendOtpEmailAsync(request.Email, otp);

            return Ok(new { message = "OTP sent to your email." });
        }

        // Verify OTP before password reset
        [HttpPost("api/verify-reset-otp")]
        public IActionResult VerifyResetOtp([FromBody] ProductApi.Models.EmailVerificationRequest request)
        {
            var record = _context.EmailVerifications
                .FirstOrDefault(v => v.Email == request.Email && v.OTP == request.OTP);

            if (record == null || record.Expiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired OTP" });

            record.IsVerified = true;
            _context.SaveChanges();

            return Ok(new { message = "OTP verified successfully." });
        }

        
        [HttpPost("api/reset-password")]
        public IActionResult ResetPassword([FromBody] ProductApi.Models.ResetPasswordRequest request)
        {
            var record = _context.EmailVerifications
                .FirstOrDefault(v => v.Email == request.Email && v.IsVerified);

            if (record == null)
                return BadRequest(new { message = "Email not verified or OTP missing." });

            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
                return BadRequest(new { message = "User not found." });

            var credential = _context.UserCredentials.FirstOrDefault(c => c.UCID == user.UID);
            if (credential == null)
                return BadRequest(new { message = "User credentials not found." });

            credential.HashPassword = HashPassword(request.NewPassword);
             
            _context.SaveChanges();

            return Ok(new { message = "Password reset successful. You can now login." });
        }




        // Helpers
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }
    }
}
