namespace ProductApi.Models
{
    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "INR";
    }
}

