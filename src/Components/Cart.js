import React from "react";
import ProductCard from "./ProductCard";

export default function Cart({
  cartProducts,
  mode,
  favorite,
  addToCart,
  handleFavorite,
  handleAddToCart,
  handleStock,
}) {
  return (
    <div className="container mt-5">
      <h2 className={`text-center mb-4 ${mode === "dark" ? "text-white" : "text-dark"}`}>
        Cart Products
      </h2>
      {cartProducts.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <div className="row gx-4 gy-4 justify-content-center">
          {cartProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              mode={mode}
              favorite={favorite}
              addToCart={addToCart}
              handleFavorite={handleFavorite}
              handleAddtoCart={handleAddToCart}
              handleStock={handleStock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
