import { addToCart } from "../services/api";

function ProductCard({ product }) {
  async function handleAddToCart() {
    try {
      await addToCart(product.id, 1);
      alert("Product added to cart");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Category: {product.categoryName}</p>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;