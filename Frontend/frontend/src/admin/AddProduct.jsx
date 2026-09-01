import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    try {
      const userInfo =
        JSON.parse(localStorage.getItem("userInfo")) ||
        JSON.parse(localStorage.getItem("user"));

      return userInfo?.token || null;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication required.");
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          imageUrl: formData.imageUrl,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      alert("Product added successfully!");

      navigate("/admin/products");

    } catch (error) {
      console.error("Add product error:", error);

      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-container">

        <div className="add-product-header">
          <div>
            <h1>Add Product</h1>
            <p>Add a new product to ShopNest</p>
          </div>

          <button
            className="back-product-btn"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>
        </div>

        {error && (
          <div className="add-product-error">
            ⚠️ {error}
          </div>
        )}

        <div className="add-product-card">

          <form onSubmit={handleSubmit}>

            <div className="add-product-grid">

              <div className="add-form-group full-field">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  placeholder="Electronics, Footwear..."
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-form-group">
                <label>Price (₹)</label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="add-form-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  placeholder="Available quantity"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="add-form-group full-field">
                <label>Image URL</label>

                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/product.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

            </div>

            {formData.imageUrl && (
              <div className="add-image-preview">

                <p>Image Preview</p>

                <div className="add-image-box">
                  <img
                    src={formData.imageUrl}
                    alt="Product Preview"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

              </div>
            )}

            <div className="add-form-group">
              <label>Description</label>

              <textarea
                name="description"
                rows="6"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-product-actions">

              <button
                type="button"
                className="add-cancel-btn"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Adding Product..."
                  : "Add Product"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddProduct;