using System.ComponentModel.DataAnnotations;
namespace MiniShop.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;

        [Range(1, double.MaxValue)]
        public decimal Price { get; set; }
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        [Range(1,int.MaxValue)]
        public int CategoryId { get; set; }      
    }
}
