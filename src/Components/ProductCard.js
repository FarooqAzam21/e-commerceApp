import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({
  product,
  mode,
  favorite = [],   // fallback empty array
  addToCart = [],  // fallback empty array
  handleFavorite,
  handleAddtoCart,
  handleStock,
  prodcutCount,
  setProductCount
}) {
  return (
    <div
      className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3`}
      style={{
        backgroundColor: mode === "light" ? "white" : "#8b8b8b",
        borderRadius: "10px",
        padding: "15px",
        position: "relative",
      }}
    >
      {/* Favorite */}
      <button
        onClick={() => handleFavorite(product._id)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          border: "none",
          background: "transparent",
          fontSize: "20px",
        }}
      >
        {Array.isArray(favorite) && favorite.includes(product._id) ? "❤️" : "🤍"}
      </button>

      {/* Cart */}
      <button
        onClick={() => handleAddtoCart(product._id)}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          border: "none",
          background: "transparent",
          fontSize: "20px",
        }}
      >
        {Array.isArray(addToCart) && addToCart.includes(product._id?.toString()) ? "✅" : "🛒"}
      </button>

      {/* Image */}
      <img
        src={product.images?.[0]}
        alt={product.title}
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
      />

      <h5 className="mt-2">{product.title}</h5>
      <p>${product.price}</p>
      <p className="text-success">Stock: {product.stock}</p>
       <button 
            onClick={() => setProductCount((prev) => 
                prev < product.stock ? prev + 1 : prev
            )} 
            className="btn"
>
  +
</button>

<p>
  {prodcutCount}
</p>

<button 
  onClick={() => setProductCount((prev) => 
    prev > 0 ? prev - 1 : prev
  )} 
  className="btn"
>
  -
</button>

      <Link to={`/product/${product._id}`}>
        <button
          className="btn btn-primary w-100"
          disabled={product.stock === 0}
          onClick={() => handleStock(product._id)}
        >
          {product.stock === 0 ? "Out of Stock" : "Buy Now"}
        </button>
      </Link>
    </div>
  );
}
