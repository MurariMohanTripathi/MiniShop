import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      alert(err.message);
    }
  }
  function handleEdit(product) {
    setEditingProduct(product);

    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setCategoryId(product.categoryId);
  }

  useEffect(() => {
    loadProducts();
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);

        alert("Product updated successfully");

        setEditingProduct(null);
      } else {
        await createProduct(productData);

        alert("Product created successfully");
      }

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategoryId("");

      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      alert("Product deleted");

      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Admin Product Management</h2>

      {editingProduct ? "Edit Product" : "Add Product"}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      <hr />

      <h3>Existing Products</h3>

      {products.map((product) => (
        <div key={product.id}>
          <h4>{product.name}</h4>

          <p>₹{product.price}</p>

          <p>Stock: {product.stock}</p>

          <p>Category: {product.categoryName}</p>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);

                setName("");
                setDescription("");
                setPrice("");
                setStock("");
                setCategoryId("");
              }}
            >
              Cancel Edit
            </button>
          )}
          <button onClick={() => handleEdit(product)}>Edit</button>
          <button onClick={() => handleDelete(product.id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminProductsPage;
