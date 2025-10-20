import React, { useState, useEffect } from "react";
import ProductFilter from "./ProductFilter";
import ProductCard from "./ProductCard";

export default function Products({
  products,
  mode,
  favorite,
  addToCart,
  handleFavorite,
  handleAddtoCart,
  handleStock,
  productCount,
  setProductCount
  
}) {
  const [filtered, setFiltered] = useState(products);

  useEffect(() => {
    setFiltered(products);
  }, [products]);

  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center mt-5">No products available</p>;
  }

  return (
    <div className="container mt-5">
      <ProductFilter products={products} onFilter={setFiltered} />
      <div className="row gx-4 gy-4 justify-content-center mt-4">
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            mode={mode}
            favorite={favorite}
            addToCart={addToCart}
            handleFavorite={handleFavorite}
            handleAddtoCart={handleAddtoCart}
            handleStock={handleStock}
            productCount={productCount}
            setProductCount={setProductCount}
          />
        ))}
      </div>
    </div>
  );
}
