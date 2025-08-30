import React, { useEffect, useRef, useState } from 'react';
import './ProductPage.css';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BuyForm from '../BuyForm';
import RelatedProducts from '../RelatedProduct/RelatedProducts';
import axios from 'axios';

export default function ProductPage({ products, setProduct, handleStock, handleFavorite, handleAddToCart, mode, favorite, cart, selectedProduct, productCount }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1 = useRef();
  const slider2 = useRef();
  const { id } = useParams();

  // Try to find product from already loaded products
  let product = products.find(p => p._id?.toString() === id);

  // Fetch the product if not in state
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(prev => {
          // merge or replace product in array
          const exists = prev.some(p => p._id === res.data._id);
          if (exists) {
            return prev.map(p => p._id === res.data._id ? res.data : p);
          }
          return [...prev, res.data];
        });
      } catch (error) {
        console.log("Error loading product", error);
      }
    };

    if (!product) {
      fetchProduct();
    }
  }, [id, product, setProduct]);

  // Find again after potential fetch
  product = products.find(p => p._id?.toString() === id);

  if (!product) return <h2 className="text-center mt-5">Product not found</h2>;

  const isFavorite = favorite.includes(product._id);
  const inCart = cart.includes(product._id);

  const mainSettings = {
    arrows: false,
    asNavFor: nav2,
    ref: slider1,
    dots: false,
  };

  const thumbSettings = {
    slidesToShow: product.images.length > 3 ? 3 : product.images.length,
    swipeToSlide: true,
    focusOnSelect: true,
    asNavFor: nav1,
    ref: slider2,
    arrows: false,
    centerMode: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  return (
    <div className={`container my-5 ${mode === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <div className="row">
        {/* Image Carousel */}
        <div className="col-md-6" style={{ height: '50%' }}>
          {product.images.length > 1 ? (
  <Slider {...mainSettings}>
    {product.images.map((img, index) => (
      <div className="zoom-container" key={index}>
        <img
          className="zoom-image"
          src={img}
          alt={`product ${index}`}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '10px'
          }}
        />
      </div>
    ))}
  </Slider>
) : (
  <div className="zoom-container">
    <img
      className="zoom-image"
      src={product.images[0]}
      alt="product"
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '10px'
      }}
    />
  </div>
)}

          {/* Thumbnail Slider */}
          <Slider {...thumbSettings} asNavFor={nav1} ref={(slider) => setNav2(slider)}>
            {product.images.map((img, index) => (
              <div key={index}>
                <img src={img} alt="thumb" className="img-thumbnail" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2>{product.title} Quantity {productCount}</h2>
          <p className={`${mode === 'dark' ? 'text-white' : 'text-dark'}`}>{product.description}</p>
          <ul className={`${mode === 'dark' ? 'text-light' : 'text-dark'}`}>
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <h4 className={`fw-bold ${mode === 'dark' ? 'text-white' : 'text-primary'}`}>${product.price * productCount}</h4>
          <p className="text-success">Stock Available: {product.stock}</p>

          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handleFavorite(product._id)}
          >
            {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
          </button>

          <button
            className="btn btn-primary me-2"
            onClick={() => handleAddToCart(product._id)}
            disabled={product.stock === 0 || inCart}
          >
            {product.stock === 0 ? "Out of Stock" : inCart ? "✅ In Cart" : "🛒 Add to Cart"}
          </button>

          <button
            className="btn btn-primary w-100 mt-3"
            disabled={product.stock === 0}
            onClick={() => handleStock(product._id)}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>

          {selectedProduct?._id === product._id && (
            <div className="mt-3">
              <BuyForm product={selectedProduct} productCount={productCount} />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        productCount={productCount}
        selectedProduct={selectedProduct}
        products={products}
        mode={mode}
        handleAddtoCart={handleAddToCart}
        handleFavorite={handleFavorite}
        handleStock={handleStock}
        favorite={favorite}
        cart={cart}
      />
    </div>
  );
}
