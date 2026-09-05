import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  checkout,
} from "../services/api";

function CartPage() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  async function loadCart() {
    try {
      const data = await getCart();
      setCart(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function changeQuantity(item, newQuantity) {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(item.cartItemId, newQuantity);
      await loadCart();
    } catch (err) {
      alert(err.message);
    }
  }

  async function removeItem(cartItemId) {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      alert(err.message);
    }
  }
  async function handleCheckout() {
  try {
    const result = await checkout();

    alert(
      `Order placed successfully. Order ID: ${result.orderId}`
    );

    await loadCart();
  } catch (err) {
    alert(err.message);
  }
}

  if (error) {
    return <p>{error}</p>;
  }

  if (!cart) {
    return <p>Loading cart...</p>;
  }

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.cartItemId}>
              <h3>{item.productName}</h3>

              <p>Price: ₹{item.price}</p>

              <button
                onClick={() =>
                  changeQuantity(item, item.quantity - 1)
                }
              >
                -
              </button>

              <span> {item.quantity} </span>

              <button
                onClick={() =>
                  changeQuantity(item, item.quantity + 1)
                }
              >
                +
              </button>

              <p>Subtotal: ₹{item.lineTotal}</p>

              <button
                onClick={() => removeItem(item.cartItemId)}
              >
                Remove
              </button>

              <hr />
            </div>
          ))}

          <h3>Total: ₹{cart.totalAmount}</h3>
          <button onClick={handleCheckout}>
  Checkout
</button>
        </>
      )}
    </div>
  );
}

export default CartPage;