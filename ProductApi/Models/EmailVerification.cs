namespace ProductApi.Models
{
    public class EmailVerification
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string OTP { get; set; }
        public DateTime Expiry { get; set; }
        public bool IsVerified { get; set; } = false;
    }
}
