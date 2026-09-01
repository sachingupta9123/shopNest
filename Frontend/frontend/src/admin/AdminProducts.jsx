import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/adminDashboard.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET ADMIN TOKEN
  // ==========================================
  const getToken = () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      return userInfo?.token || null;
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  };

  // ==========================================
  // FETCH ALL PRODUCTS
  // ==========================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || []
      );

    } catch (error) {
      console.error("Fetch products error:", error);

      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // DELETE PRODUCT
  // ==========================================
  const deleteProduct = async (
    productId,
    productName
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      if (!token) {
        alert("Please login as admin first.");
        return;
      }

      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) =>
            product._id !== productId
        )
      );

      alert("Product deleted successfully!");

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete product"
      );
    }
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toFixed(2)}`;
  };

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">

        <div>
          <h1>Products</h1>
          <p>
            Manage all products in your store
          </p>
        </div>

        <div className="admin-header-actions">

          {/* ADD PRODUCT */}
          <Link to="/admin/products/add" className="add-product-btn refresh-btn" style={{marginRight: "10px"}} > Add Product </Link>

          {/* REFRESH */}
          <button
            className="refresh-btn"
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-error">
          ⚠️ {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (

        <div className="admin-loading">
          <p>Loading products...</p>
        </div>

      ) : (

        <div className="admin-card">

          {/* PRODUCT COUNT */}
          <div className="products-count">
            <h2>All Products</h2>

            <p>
              Total Products:{" "}
              <strong>
                {products.length}
              </strong>
            </p>
          </div>

          {/* NO PRODUCTS */}
          {products.length === 0 ? (

            <div className="empty-admin-data">

              <h2>No Products Found</h2>

              <p>
                There are no products available.
              </p>

              <Link
                to="/admin/products/add"
                className="add-product-btn"
              >
                + Add Your First Product
              </Link>

            </div>

          ) : (

            <div className="table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr key={product._id}>

                      {/* IMAGE */}
                      <td>
                        <img
                          src={
                            product.imageUrl ||
                            "https://via.placeholder.com/80"
                          }
                          alt={product.name}
                          className="admin-product-image"
                        />
                      </td>

                      {/* PRODUCT NAME */}
                      <td>

                        <div className="admin-product-name">

                          <strong>
                            {product.name}
                          </strong>

                          <small>
                            ID:{" "}
                            {product._id?.slice(-8)}
                          </small>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td>
                        {product.category || "N/A"}
                      </td>

                      {/* PRICE */}
                      <td>

                        <strong className="order-price">
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                      </td>

                      {/* STOCK */}
                      <td>

                        <span
                          className={
                            Number(product.stock) > 0
                              ? "stock-in"
                              : "stock-out"
                          }
                        >

                          {Number(product.stock) > 0
                            ? `${product.stock} Available`
                            : "Out of Stock"}

                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td>

                        <div className="admin-actions">

                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteProduct(
                                product._id,
                                product.name
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>
  );
};

export default AdminProducts;