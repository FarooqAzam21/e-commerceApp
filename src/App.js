import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import Alert from './Components/Alert';
import Banner from './Components/banner/Banner';
import Chatbot from './Components/chatbot/Chatbot';
import Navbar from './Components/Navbar';
import Products from './Components/Products';
import { useState , useEffect } from 'react';
import axios from 'axios';
import {Routes , Link , Route } from 'react-router-dom';
import ProductPage from './Components/ProductPage/ProductPage';
import AddProduct from './Components/AddProduct';
import RelatedProducts from './Components/RelatedProduct/RelatedProducts';
import { use } from 'react';

function App() {
  const [showFavorite , setShowFavorite] = useState(false)
  const [alert , setAlert] = useState(null)
  const [showCartProducts , setshowCartProducts] = useState(false)
  const [mode, setMode] = useState(() => {
  return localStorage.getItem('mode') && 'light';
});
  const [open , isOpen]=useState(false)
  const[productCount , setProductCount] = useState(1)
  const [showForm , setShowForm] = useState(false)
  const [products, setProducts] = useState([])
  const [addToCart , setAddToCart] = useState([])
  const [displayMessage , setDisplayMessage] = useState(false)
  const [favorite , setFavorite] = useState([])
  const [selectedProduct , setSelectedProduct]= useState()
  const [loader , setLoader] = useState(false)
  const navigate = useNavigate()
  const fetchProducts = async()=>{
    setLoader(true)
    const res = await axios.get("http://localhost:5000/api/products")
    setProducts(res.data)
    setLoader(false)
  }
  useEffect(()=>{
    fetchProducts()
  }, [])
  
  const handleFavorite =(id) =>{
    if(favorite.includes(id)){
        setFavorite((prev)=> prev.filter((favid)=> favid !== id))
        
    }
    else {
        setFavorite((prev)=> [...prev , id])
        setDisplayMessage((prev)=>!prev)
        showAlert("product added to Favorite" , "success")
        setTimeout(() => {
    setDisplayMessage(false)
}, 5000);
    }
}
const handleStock = (id)=>{
    const updated = products.map(product =>{
        if(product.id === id && product.stock > 0){
            return {...product, stock: product.stock -1  }
            }
            return product;
    })
    setProducts(updated)
    const productToBuy = products.find(p=> p.id === id);
    if(productToBuy && productToBuy.stock>0){
        setSelectedProduct(productToBuy)
        setShowForm(true)

    }
    setProducts(updated)    
    navigate(`product/${id}`)
}
  const handleAddtoCart=(id)=>{
    if(addToCart.includes(id)){
        setAddToCart((prev)=>prev.filter((addtoCartid)=>addtoCartid !==id))
    }
    else{
        setAddToCart((prev)=>[...prev , id])
        setDisplayMessage((prev)=>!prev)
        showAlert("product added to Cart" , "success")
      }
    const updated = products.map((product)=>{
        if(product.id === id && product.stock>0){
            return{...product , stock: product.stock-1}
        }
        return product
    })
}
  const showAlert=(message , type)=>{
    setAlert({
      message : message,
      type: type
    })
    isOpen(prev=> !prev)
  }
  const viewFavorite=()=>{
    setShowFavorite((prev)=>!prev)
  }
  const viewCartProducts=()=>{
    setshowCartProducts((prev)=>!prev)
  }
  useEffect(() => {
  if (mode === 'dark') {
    document.body.style.background = 'linear-gradient(to right ,rgb(107, 56, 56),rgb(54, 83, 98))';
  } else {
    document.body.style.background = 'linear-gradient(to right,rgba(254, 254, 255, 0.66),rgb(101, 170, 205))';
  }
}, [mode]);

 const handleMode = () => {
  if (mode === 'light') {
    setMode('dark');
    localStorage.setItem('mode', 'dark');
    showAlert("Dark Mode Enabled", "success");
  } else {
    setMode('light');
    localStorage.setItem('mode', 'light');
    showAlert("Dark Mode Disabled", "success");
  }
}

  return (
    <>
      <Navbar onFavorite={viewFavorite} onCart={viewCartProducts} title="Highfy Electronics" mode={mode} handleMode={handleMode}/>
        <Alert alert={alert} showAlert={showAlert} loader={loader} open={open} isOpen={isOpen}/>
      <Routes>
  <Route path='/' element={
    <>
      <Banner />
      <Products 
        setLoader={setLoader}
        productCount={productCount}
        setProductCount={setProductCount}
        loader={loader}
        product={products}
        showFavorite={showFavorite} 
        showCartProducts={showCartProducts} 
        mode={mode} 
        handleMode={handleMode}
        alert={alert}
        showAlert={showAlert}
      />
      <Chatbot/>
    </>
  } />
  
  <Route path='/products' element={
    <Products 
      setLoader={setLoader}
      productCount={productCount}
      setProductCount={setProductCount}
      loader={loader}
      product={products}
      showFavorite={showFavorite} 
      showCartProducts={showCartProducts} 
      mode={mode} 
      handleMode={handleMode}
      alert={alert}
      showAlert={showAlert}
    />
  } />
  

  <Route path='/product/:id' element={
    <ProductPage
      productCount={productCount}
      mode={mode}
      products={products}
      handleFavorite={handleFavorite}
      handleAddToCart={handleAddtoCart}
      handleStock={handleStock}
      favorite={favorite}
      cart={addToCart}
      selectedProduct={selectedProduct}
    />
  } />

  <Route path='/admin/dashboard' element={
    <AddProduct refreshProduct={fetchProducts} loader={setLoader} />
  } />
</Routes>

    </>
  );
}

export default App;
