using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OID { get; set; }
        public int UID { get; set; }
       
        public DateTime Orderdate { get; set; } = DateTime.Now;
        
        public string? PaymentStatus { get; set; }
       
        [Required]
        public string Address { get; set; }
        
        public ICollection<OrderItem> OrderItems { get; set; }

    }
}
