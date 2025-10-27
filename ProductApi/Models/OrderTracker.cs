using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class OrderTracker
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OTID { get; set; }

        
        public int OID { get; set; }
        [Required]
        public List<string> status { get; set; } 
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
