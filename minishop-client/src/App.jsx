import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminRoute from "./Components/AdminRoute";

import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />
      </Routes>
      
    </>
  );
}

export default App;
