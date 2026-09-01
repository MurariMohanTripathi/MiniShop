using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniShop.Data;
using MiniShop.DTOs;
using MiniShop.Models;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace MiniShop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CartController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("items")]
        public async Task<IActionResult> AddItem(AddCartItemDto dto)
        {
            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
            {
                return NotFound("Product not found");
            }
            if (dto.Quantity > product.Stock)
            {
                return BadRequest("Not enough stock Available");
            }

            var userId = GetUserId();
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }
            var existingItem = cart.Items
                .FirstOrDefault(i => i.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                var newQuantity = existingItem.Quantity + dto.Quantity;
                if (newQuantity > product.Stock)
                {
                    return BadRequest("Not enough stock available");
                }
                existingItem.Quantity = newQuantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                _context.CartItems.Add(cartItem);
            }
            await _context.SaveChangesAsync();

            return Ok("Product added to cart successfully");
        }
        [HttpGet]
        public async Task<ActionResult<CartResponseDto>> GetCart()
        {
            var userId = GetUserId();
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                return NotFound("Cart Not Found");
            }
            var response = new CartResponseDto
            {
                CartId = cart.Id,
                Items = cart.Items.Select(i => new CartItemResponseDto
                {
                    CartItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? "",
                    Price = i.Product?.Price ?? 0,
                    Quantity = i.Quantity,
                    LineTotal = (i.Product?.Price ?? 0) * i.Quantity
                }).ToList(),
            };
            response.TotalAmount = response.Items.Sum(i => i.LineTotal);
            return Ok(response);
        }
        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, int quantity)
        {
            var userId = GetUserId();
            var cartItem = await _context.CartItems
            .Include(i => i.Product)
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(i => i.Id == id && i.Cart!.UserId == userId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            if (cartItem.Product == null)
            {
                return BadRequest("Product information is unavailable.");
            }

            if (quantity > cartItem.Product.Stock)
            {
                return BadRequest("Not enough stock available.");
            }

            cartItem.Quantity = quantity;

            await _context.SaveChangesAsync();

            return Ok("Cart quantity updated.");
        }
        [HttpDelete("items/{id}")]
        public async Task<IActionResult> RemoveCartItem(int id)
        {
            var userId = GetUserId();
            var cartItem = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == id && i.Cart!.UserId == userId );

            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        public int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userId!);
        }
    }
}
