import React from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import BuyForm from '../BuyForm';

export default function RelatedProducts({ products, mode, handleAddtoCart, handleFavorite, handleStock, favorite, cart , selectedProduct }) {
  const { id } = useParams();
  const currentProduct = products.find(p => p.id.toString() === id);

  if (!currentProduct) {
    return <h4 className="text-center text-danger">Current product not found</h4>;
  }

  const relatedProducts = products.filter(
    p => p.category === currentProduct.category && p.id.toString() !== id
  );
  const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  return (
    <div className="container mt-5">
      <div className="row gx-4 gy-4 justify-content-center">
        {
          relatedProducts.map((product) => (
            <div
              className="card col-12 col-sm-6 col-md-4 col-lg-3 mx-3"
              key={product.id}
              style={{
                backgroundColor: mode === "light" ? "white" : "#8b8b8b",
                position: "relative",
                minWidth: '20 px'
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  {/* Favorite Button */}
                  <button
                    onClick={() => handleFavorite(product.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "20px",
                      color: favorite.includes(product.id) ? "red" : "black",
                    }}
                  >
                    {favorite.includes(product.id) ? "❤️" : "🤍"}
                  </button>
    
                  {/* Cart Button */}
                  <button
                    onClick={() => handleAddtoCart(product.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "20px",
                      color: cart.includes(product.id) ? "blue" : "black",
                    }}
                  >
                    {cart.includes(product.id) ? "✅" : "🛒"}
                  </button>
                </div>
    
              <Slider {...sliderSettings}>
                {product.images.map((img, index) => (
                  <div className="zoom-container">
                    <img
                    className="zoom-image"
                    key={index}
                    src={img}
                    alt={`product ${index}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                  </div>
                ))}
              </Slider>
    
              <div className="card-body">
                <h5 className="card-title" style={{ color: mode === "light" ? "black" : "white" }}>
                  {product.title}
                </h5>
    
                {product.features.map((feature, index) => (
                  <ul key={index}>
                    <li
                      className="list-unstyled"
                      style={{ color: mode === "light" ? "black" : "white" }}
                    >
                      {feature}
                    </li>
                  </ul>
                ))}
    
                <p style={{fontWeight: 'bold' , fontSize: '28px' , color:'black'}}>${product.price}</p>
                <p className="text-success">Stock Available: {product.stock}</p>
    
                <button
                  className="btn btn-primary w-100"
                  disabled={product.stock === 0}
                  style={{
                    backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
                  }}
                  onClick={() => handleStock(product.id)}
                >
                  {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                </button>
    
                {selectedProduct?.id === product.id && (
                  <div className="mt-3">
                    <BuyForm></BuyForm>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
