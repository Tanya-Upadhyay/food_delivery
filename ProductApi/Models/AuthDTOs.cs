using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class RegisterRequest
    {
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
    }
    public class LoginRequest
    {
        [Required]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
