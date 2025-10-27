using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models
{
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AID { get; set; }
        public int UID { get; set; }
        
        public string AddressType { get; set; }
        
        public string UserName { get; set; }
        
        public string HouseNo { get; set; }
        
        public string Colony { get; set; }
        
        public string Area { get; set; }
        
        public string City { get; set; }
        
        public string State { get; set; }
        
        public string Pincode { get; set; }
        
        public string PhoneNumber { get; set; }
        
        public string Landmark { get; set; }
        
        public bool IsPrimary { get; set; }

    }
}
