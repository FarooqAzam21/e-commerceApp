import React, { useState } from "react";

export default function ProductFilter({ products, onFilter }) {
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = [...new Set(products.map((p) => p.category))];

  const applyFilter = () => {
    let filtered = products;
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (maxPrice) filtered = filtered.filter((p) => p.price <= +maxPrice);
    onFilter(filtered);
  };

  return (
    <div className="d-flex gap-3 mb-4">
      <select
        className="form-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c, i) => (
          <option key={i} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="number"
        className="form-control"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <button className="btn btn-primary" onClick={applyFilter}>
        Filter
      </button>
    </div>
  );
}
