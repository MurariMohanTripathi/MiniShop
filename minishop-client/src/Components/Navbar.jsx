import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>MiniShop</h2>

      <div>
        <Link to="/">Products</Link>
        {" | "}
        <Link to="/login">Login</Link>
        {" | "}
        <Link to="/register">Register</Link>
        {" | "}
        <Link to="/cart">Cart</Link>
        {" | "}
        <Link to="/orders">Orders</Link>
      </div>
    </nav>
  );
}

export default Navbar;