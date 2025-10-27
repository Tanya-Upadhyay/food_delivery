using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class Cart
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CID { get; set; }


        public int UID { get; set; }


        public int PID { get; set; }

        [Required]
        public int Quantity { get; set; } 
    }
}
