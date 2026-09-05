import { useEffect, useState } from "react";
import { getOrders } from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h3>Order #{order.id}</h3>

            <p>
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>

            {order.items.map((item) => (
              <div key={item.id}>
                <p>{item.productName}</p>
                <p>
                  ₹{item.price} × {item.quantity}
                </p>
                <p>
                  Subtotal: ₹{item.lineTotal}
                </p>
              </div>
            ))}

            <strong>
              Total: ₹{order.totalAmount}
            </strong>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;