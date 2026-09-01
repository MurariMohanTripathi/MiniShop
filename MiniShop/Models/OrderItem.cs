using Microsoft.EntityFrameworkCore;
namespace MiniShop.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        [Precision(18,2)]
        public decimal Price { get; set; }
        public int Quantity { get; set; } 
    }
}
