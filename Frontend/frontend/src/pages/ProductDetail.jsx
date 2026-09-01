import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { startBuyNow } from "../redux/checkoutSlice";
import "../styles/product.css";

const ProductDetail = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/products/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data);
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    dispatch(addToCart(product));

    alert(`${product.name} added to cart successfully!`);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    dispatch(startBuyNow(product));

    navigate("/checkout?mode=buy-now");
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-error">
          <h2>Product Not Found</h2>

          <p>{error || "The requested product does not exist."}</p>

          <Link to="/" className="back-link">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const image =
    product.imageUrl ||
    "https://via.placeholder.com/500x500?text=No+Image";

  return (
    <div className="product-detail-page">

      <Link to="/" className="back-link">
        ← Continue Shopping
      </Link>

      <div className="product-detail">

        {/* IMAGE */}
        <div className="product-detail-image">
          <img
            src={image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/500x500?text=Image+Not+Available";
            }}
          />
        </div>

        {/* INFORMATION */}
        <div className="product-detail-info">

          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          {product.rating && (
            <p className="product-rating">
              ⭐ {product.rating} ({product.numReviews || 0} reviews)
            </p>
          )}

          <p className="product-detail-price">
            ₹{Number(product.price || 0).toFixed(2)}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">
                ✓ {product.stock} items available
              </span>
            ) : (
              <span className="out-of-stock">
                Out of Stock
              </span>
            )}
          </div>

          <div className="product-purchase-actions">

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;