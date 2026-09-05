import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  }

  return (
    <nav>
      <h2>MiniShop</h2>

      <div>
        <Link to="/">Products</Link>
        {" | "}

        {token ? (
          <>
            <Link to="/cart">Cart</Link>
            {" | "}
            <Link to="/orders">Orders</Link>
            {" | "}

            <span>
              Hello, {user?.name}
            </span>

            {" | "}

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;