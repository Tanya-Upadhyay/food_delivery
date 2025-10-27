using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class UserCredentials
    {
        [Key]
        [ForeignKey("User")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UCID { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string HashPassword { get; set; } 

        public User User { get; set; }
        
    }
}
