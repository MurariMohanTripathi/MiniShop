using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MiniShop.Data;
using MiniShop.DTOs;
using MiniShop.Models;

namespace MiniShop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = GetUserId();
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || cart.Items.Count == 0)
            {
                return BadRequest("Cart is empty.");
            }

            foreach (var item in cart.Items)
            {
                if (item.Product == null)
                {
                    return BadRequest("A product in the cart no longer exists.");
                }

                if (item.Quantity > item.Product.Stock)
                {
                    return BadRequest(
                        $"Not enough stock for {item.Product.Name}."
                    );
                }
            }

            var order = new Order { UserId = userId };

            foreach (var item in cart.Items)
            {
                var product = item.Product!;

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Price = product.Price,
                    Quantity = item.Quantity
                };

                order.Items.Add(orderItem);

                product.Stock -= item.Quantity;
            }

            order.TotalAmount = order.Items
                .Sum(i => i.Price * i.Quantity);

            _context.Orders.Add(order);

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Order created successfully.",
                orderId = order.Id,
                totalAmount = order.TotalAmount
            });
        }
        [HttpGet]
        public async Task<ActionResult<List<OrderResponseDto>>> GetOrders()
        {
            var userId = GetUserId();
            var orders = await _context.Orders
                .Where(o=>o.UserId == userId)
                .Include(o => o.Items)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    TotalAmount = o.TotalAmount,
                    CreatedAt = o.CreatedAt,

                    Items = o.Items.Select(i => new OrderItemResponseDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        ProductName = i.ProductName,
                        Price = i.Price,
                        Quantity = i.Quantity,
                        LineTotal = i.Price * i.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrderById(int id)
        {
            var userId = GetUserId();
            var order = await _context.Orders
                .Where(o=>o.Id == id && o.UserId == userId)
                .Include(o => o.Items)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    TotalAmount = o.TotalAmount,
                    CreatedAt = o.CreatedAt,

                    Items = o.Items.Select(i => new OrderItemResponseDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        ProductName = i.ProductName,
                        Price = i.Price,
                        Quantity = i.Quantity,
                        LineTotal = i.Price * i.Quantity
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(order);
        }
        private int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userId!);
        }
    }
}
