namespace ProductApi.Models
{
    public class ProductCreateDto
    {
        public string ProductName { get; set; }
        public string Category { get; set; }
        public int Price { get; set; }
        public string Type { get; set; }
        public IFormFile? ImageFile { get; set; }
        public int Stock { get; set; }
        public string ProductStatus { get; set; }
    }
}
