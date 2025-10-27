using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UID { get; set; }

        [MaxLength(50), Required]
        public string Name { get; set; }

        [EmailAddress, Required]
        public string Email { get; set; }

        [Phone, Required]
        public string PhoneNumber { get; set; }

        public string Roles { get; set; } = "user"; 

        public UserCredentials Credentials { get; set; }
    }
}
