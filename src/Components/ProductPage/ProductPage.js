import React, { useRef, useState } from 'react';
import './ProductPage.css';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BuyForm from '../BuyForm';
import RelatedProducts from '../RelatedProduct/RelatedProducts';

export default function ProductPage({ products, handleStock, handleFavorite, handleAddToCart, mode, favorite, cart, selectedProduct }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1 = useRef();
  const slider2 = useRef();
  const { id } = useParams();

  const product = products.find(p => p.id.toString() === id);

  if (!product) return <h2 className="text-center mt-5">Product not found</h2>;

  const isFavorite = favorite.includes(product.id);
  const inCart = cart.includes(product.id);

  const mainSettings = {
    arrows: true,
    asNavFor: nav2,
    ref: slider1,
  };

  const thumbSettings = {
    slidesToShow: product.images.length > 3 ? 3 : product.images.length,
    swipeToSlide: true,
    focusOnSelect: true,
    asNavFor: nav1,
    ref: slider2,
    arrows: false,
    centerMode: true,
  };

  return (
    <div className={`container my-5 ${mode === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className="row">
        {/* Image Carousel */}
        <div className="col-md-6" style={{ height: '50%' }}>
          <Slider {...mainSettings} asNavFor={nav2} ref={(slider) => setNav1(slider)}>
            {product.images.map((img, index) => (
              <div key={index}>
                <img src={img} alt="main" className="img-fluid rounded" />
              </div>
            ))}
          </Slider>

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
          <h2>{product.title}</h2>
          <p style={{ color: mode === "light" ? "black" : "white" }}>{product.description}</p>
          <ul>
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <h4 style={{ fontWeight: 'bold', color: mode === 'light' ? 'blue' : 'white' }}>${product.price}</h4>
          <p className="text-success">Stock Available: {product.stock}</p>

          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handleFavorite(product.id)}
          >
            {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
          </button>

          <button
            className="btn btn-primary me-2"
            onClick={() => handleAddToCart(product.id)}
            disabled={product.stock === 0 || inCart}
          >
            {product.stock === 0 ? "Out of Stock" : inCart ? "✅ In Cart" : "🛒 Add to Cart"}
          </button>

          <button
            className="btn btn-primary w-100 mt-3"
            disabled={product.stock === 0}
            onClick={() => handleStock(product.id)}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>

          {selectedProduct?.id === product.id && (
            <div className="mt-3">
              <BuyForm product={selectedProduct} />
            </div>
          )}
        </div>
      </div>

      {/* Related Products Below */}
      <RelatedProducts
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
