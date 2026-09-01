import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');

        if (!res.ok) {
          throw new Error('Products API not available');
        }

        const data = await res.json();

        console.log('Products from backend:', data);

        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Products API error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">

      <section className="hero-banner">
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </section>

      <section className="featured-section">
        <h2 className="featured-title">
          Featured Products
        </h2>

        {loading ? (
          <p className="loading-text">
            Loading products...
          </p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductList
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="loading-text">
            No products found.
          </p>
        )}
      </section>

    </div>
  );
};

export default Home;