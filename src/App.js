import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './Components/Navbar';
import Alert from './Components/Alert';
import Banner from './Components/banner/Banner';
import Products from './Components/Products';
import ProductPage from './Components/ProductPage/ProductPage';
import AddProduct from './Components/AddProduct';
import Cart from './Components/Cart';
import Chatbot from './Components/chatbot/Chatbot';

function App() {
  const [products, setProducts] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [addToCart, setAddToCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productCount, setProductCount] = useState(1);
  const [alert, setAlert] = useState(null);
  const [open, isOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "dark");
  

  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoader(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Derived cart products
  const cartProducts = Array.isArray(products)
    ? products.filter((p) => addToCart.includes(p._id?.toString()))
    : [];

  // Favorite handler
  const handleFavorite = (id) => {
    if (favorite.includes(id)) {
      setFavorite((prev) => prev.filter((fid) => fid !== id));
    } else {
      setFavorite((prev) => [...prev, id]);
      showAlert("Added to Favorite", "success");
    }
  };

  // Cart handler
  const handleAddToCart = (id) => {
    const idStr = id.toString();
    if (addToCart.includes(idStr)) {
      setAddToCart((prev) => prev.filter((cid) => cid !== idStr));
    } else {
      setAddToCart((prev) => [...prev, idStr]);
      showAlert("Added to Cart", "success");
    }
  };

  // Stock handler
  const handleStock = (id) => {
    const updated = products.map((p) => {
      if (p._id === id && p.stock > 0) {
        return { ...p, stock: p.stock - 1 };
      }
      return p;
    });
    setProducts(updated);

    const toBuy = products.find((p) => p._id === id);
    if (toBuy && toBuy.stock > 0) {
      setSelectedProduct(toBuy);
    }
    navigate(`/product/${id}`);
  };

  // Alert handler
  const showAlert = (message, type) => {
    setAlert({ message, type });
    isOpen(true);
    setTimeout(() => isOpen(false), 2000);
  };

  // Mode handler
  useEffect(() => {
    document.body.style.background =
      mode === "dark"
        ? "linear-gradient(to right, rgb(107, 56, 56), rgb(54, 83, 98))"
        : "linear-gradient(to right, rgba(254, 254, 255, 0.66), rgb(101, 170, 205))";
  }, [mode]);

  const handleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
    showAlert(`${newMode} Mode Enabled`, "success");
  };
 

  return (
    <>
      <Navbar
        title="Highfy Electronics"
        mode={mode}
        handleMode={handleMode}
        cartCount={addToCart.length}
      />
      <Alert alert={alert} open={open} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Products
                products={products}
                mode={mode}
                favorite={favorite}
                addToCart={addToCart}
                handleFavorite={handleFavorite}
                handleAddtoCart={handleAddToCart}
                handleStock={handleStock}
                productCount={productCount}
                setProductCount={setProductCount}
                
              />
              <Chatbot></Chatbot>
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductPage
              productCount={productCount}
              mode={mode}
              products={products}
              handleFavorite={handleFavorite}
              handleAddToCart={handleAddToCart}
              handleStock={handleStock}
              favorite={favorite}
              cart={addToCart}
              setProduct={setProducts}
              selectedProduct={selectedProduct}
            />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AddProduct
              refreshProduct={fetchProducts}
              loader={setLoader}
              products={products}
              setProduct={setProducts}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              products={products}
              cartProducts={cartProducts}
              mode={mode}
              productCount={productCount}
              setProductCount={setProductCount}
              handleFavorite={handleFavorite}
              handleAddToCart={handleAddToCart}
              handleStock={handleStock}
              favorite={favorite}
              alert={alert}
              showAlert={showAlert}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
