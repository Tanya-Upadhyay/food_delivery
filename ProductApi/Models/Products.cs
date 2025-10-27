using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductApi.Models
{
    public class Products
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PID { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public int Price { get; set; }
        public string Image { get; set; }
        public int Stocks { get; set; }

        public string ProductStatus { get; set; } = "active";


    }
}
