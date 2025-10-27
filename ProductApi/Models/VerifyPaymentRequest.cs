namespace ProductApi.Models
{
    public class VerifyPaymentRequest
    {
        public string OrderId { get; set; }
        public string PaymentId { get; set; }
        public string Signature { get; set; }
        public int Amount { get; set; }
        public string Currency {  get; set; }
    }
}
