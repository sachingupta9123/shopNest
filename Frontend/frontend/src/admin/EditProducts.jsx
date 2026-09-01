import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProducts.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Get token
  const getToken = () => {
    try {
      const user =
        JSON.parse(localStorage.getItem("userInfo")) ||
        JSON.parse(localStorage.getItem("user"));

      return user?.token || null;
    } catch {
      return null;
    }
  };

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        setFormData({
          name: data.name || "",
          category: data.category || "",
          price: data.price || "",
          stock: data.stock || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });

      } catch (error) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication required. Please login again.");
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      alert("Product updated successfully!");

      navigate("/admin/products");

    } catch (error) {
      console.error("Update product error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-page">
        <div className="edit-loading">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">

      <div className="edit-product-container">

        {/* Header */}
        <div className="edit-product-header">

          <div>
            <h1>Edit Product</h1>
            <p>Update your product information</p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="edit-error">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <div className="edit-product-card">

          <form onSubmit={handleSubmit}>

            <div className="edit-form-grid">

              {/* Product Name */}
              <div className="edit-form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="edit-form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Price */}
              <div className="edit-form-group">
                <label>Price (₹)</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              {/* Stock */}
              <div className="edit-form-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

            </div>

            {/* Image URL */}
            <div className="edit-form-group">
              <label>Image URL</label>

              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="image-preview">

                <p>Image Preview</p>

                <img
                  src={formData.imageUrl}
                  alt="Product Preview"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

              </div>
            )}

            {/* Description */}
            <div className="edit-form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            {/* Buttons */}
            <div className="edit-buttons">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="update-btn"
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Update Product"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditProduct;