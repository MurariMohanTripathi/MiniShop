function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Category: {product.categoryName}</p>

      <button>Add to Cart</button>
    </div>
  );
}
export default ProductCard;