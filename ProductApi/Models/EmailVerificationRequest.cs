namespace ProductApi.Models
{
    public class EmailVerificationRequest
    {
        public string Email { get; set; }
        public string OTP { get; set; }
    }
}
