import React , {useState , useEffect , useRef}   from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './slider.css'
import Slider from 'react-slick'
import './Product.css'
import ProductPage from './ProductPage/ProductPage'

export default function Products({showFavorite , showCartProducts , mode , alert , showAlert , setLoader ,loader , productCount , setProductCount}) {
  
    const sliderSettings = {
    dots: false,         
  arrows: false,       
  infinite: true,
  speed: 500,
  autoplay: true,     
  autoplaySpeed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: false,
  }
  
const [displayMessage , setDisplayMessage] = useState(false)
const [showForm , setShowForm] = useState(false)
const [products, setProducts] = useState([])
const [maxPrice , setMaxPrice] = useState(1000)
const [minPrice , setMinPrice] = useState(0)
const [favorite , setFavorite] = useState([])
const [selectedProduct , setSelectedProduct]= useState()
const [selectedCategories , setSelectedCategories ] = useState("All")
const [addToCart , setAddToCart] = useState([])
const [showFilter, setShowFilter] = useState(false)
const [showAppliances , setShowAppliances] = useState([])
const [showMobiles , setShowMobiles] = useState([])
const [showMobileFilterResults , setshowMobileFilterResults ] = useState(false)
 const [visible, setVisible] = useState(false);
const [showApplianceFilterResults , setshowApplianceFilterResults ] = useState(false)
const ref = useRef()
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
useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
const handleAddtoCart=(id)=>{
    if(addToCart.includes(id)){
        setAddToCart((prev)=>prev.filter((addtoCartid)=>addtoCartid !==id))
    }
    else{
        setAddToCart((prev)=>[...prev , id])
        setDisplayMessage((prev)=>!prev)
        showAlert("product added to Cart" , "success")
        setTimeout(() => {
    setDisplayMessage(false)
}, 5000);
    }
    const updated = products.map((product)=>{
        if(product._id === id && product.stock>0){
            return{...product , stock: product.stock-1}
        }
        return product
    })
}
const cartProduct = (products|| []).filter((p)=> addToCart.includes(p.id) )
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

const appliancesProduct = (products || []).filter((p)=> p.category === "Aplliances")
const mobilesProduct = (products || []).filter((p)=> p.category === "Mobiles")
const favoriteproductsList = (products || []).filter((p) => favorite.includes(p.id));
 const filteredProduct = products.filter(product=> {
    const min = minPrice === '' ? 0 : Number(minPrice)
    const max = maxPrice === '' ? 0 : Number(maxPrice)
    const matchesCategory = selectedCategories === "All" || product.category === selectedCategories

    return product.price >= min && product.price <= max && matchesCategory
 })
 const filterAppliancesProduct=()=>{
    setShowAppliances(appliancesProduct)
    setshowApplianceFilterResults(true)
}
const filterMobileProducts=()=>{
    setShowMobiles(mobilesProduct)
    setshowMobileFilterResults(true)
}
const handlefFilterButton=()=>{
    setShowFilter((prev)=>!prev)
}
const handleStock = (id)=>{
    const updated = products.map(product =>{
        if(product._id === id && product.stock > 0){
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
  return (
    <>     
      {loader &&
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        }
        <div className="container my-4 p-4 bg-secondary text-white rounded-5 text-center">
  <h4>Filter Products</h4>

  <div className="row justify-content-center">
    <div className="col-12 col-md-4 mb-2">
      <button className="btn btn-light w-100" onClick={filterAppliancesProduct}>
        Appliances +
      </button>
    </div>
    <div className="col-12 col-md-4 mb-2">
      <button className="btn btn-light w-100" onClick={filterMobileProducts}>
        Mobiles +
      </button>
    </div>
    <div className="col-12 col-md-4 mb-2">
      <select
        className="form-select"
        value={selectedCategories}
        onChange={(e) => setSelectedCategories(e.target.value)}
      >
        <option value="">All</option>
        <option value="Aplliances">Aplliances</option>
        <option value="Mobiles">Mobiles</option>
      </select>
    </div>
  </div>

  <div className="text-start mt-4">
    <label className="form-label fw-semibold">Price Range:</label>

    <div className="row mb-3">
      <div className="col-12 col-md-6">
        <input
          type="range"
          className="form-range"
          min={0}
          max={1000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <span className="small text-white">Max Price: ${maxPrice}</span>
      </div>

      <div className="col-12 col-md-6">
        <input
          type="range"
          className="form-range"
          min={0}
          max={1000}
          step={100}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span className="small text-white">Min Price: ${minPrice}</span>
      </div>
    </div>

    <button className="btn btn-dark" onClick={handlefFilterButton}>
      Show Filtered Products
    </button>
  </div>
</div>
{
  showMobileFilterResults &&
  <div className="text-center my-4 d-flex align-items-center justify-content-center">
    <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
    <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Mobile & Appliances</h2>
    <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}} />
</div>
}
{/* Product Display Section */}
<div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showMobileFilterResults && 
      showMobiles.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: favorite.includes(product._id) ? "red" : "black",
                }}
              >
                {favorite.includes(product._id) ? "❤️" : "🤍"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => handleAddtoCart(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: addToCart.includes(product._id) ? "blue" : "black",
                }}
              >
                {addToCart.includes(product._id) ? "✅" : "🛒"}
              </button>
            </div>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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


          <div className="card-body">
            <h5 className="card-title" style={{ color: mode === "light" ? "black" : "white" }}>
              {product.title}
            </h5>

            {product.features.map((feature, index) => (
              <ul key={index}>
                <li
                  className="list-unstyled"
                  style={{fontSize: '18px' , color: mode === "light" ? "black" : "white" }}
                >
                  {feature}
                </li>
              </ul>
            ))}
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>

            <p className='card-price'>${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                <ProductPage
                  selectedProduct={selectedProduct} 
                  products={products} 
                  mode={mode} 
                  favorite={favorite} 
                  cart={cartProduct} 
                  handleFavorite={handleFavorite} 
                  handleAddtoCart={handleAddtoCart} >
                  handleStock={handleStock}    
                </ProductPage>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>

    {/* Product Display Section */}
    {showApplianceFilterResults &&
      <div className="text-center my-4 d-flex align-items-center justify-content-center">
        <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
        <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Appliances</h2>
        <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}} />
      </div>
    }
<div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showApplianceFilterResults &&
      showAppliances.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: favorite.includes(product._id) ? "red" : "black",
                }}
              >
                {favorite.includes(product._id) ? "❤️" : "🤍"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => handleAddtoCart(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: addToCart.includes(product._id) ? "blue" : "black",
                }}
              >
                {addToCart.includes(product._id) ? "✅" : "🛒"}
              </button>
            </div>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>
            <p className='card-price' >${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>
{
  showFilter && 
  <div className="text-center my-4 d-flex align-items-center justify-content-center">
    <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
    <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Filtered Products</h2>
    <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}} />
  </div>
}
        {/* Product Display Section */}
<div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showFilter &&
      filteredProduct.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: favorite.includes(product._id) ? "red" : "black",
                }}
              >
                {favorite.includes(product._id) ? "❤️" : "🤍"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => handleAddtoCart(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: addToCart.includes(product._id) ? "blue" : "black",
                }}
              >
                {addToCart.includes(product._id) ? "✅" : "🛒"}
              </button>
            </div>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>

            <p className='card-price' >${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                 <ProductPage selectedProduct={selectedProduct} products={products} mode={mode} favorite={favorite} cart={cartProduct} handleFavorite={handleFavorite} handleAddtoCart={handleAddtoCart} ></ProductPage>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>
          
        {showCartProducts&& 
                <div className="text-center my-4 d-flex align-items-center justify-content-center">
                    <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
                    <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Cart Products</h2>
                    <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}}/>
                  </div>
            }
            <div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showCartProducts &&
      cartProduct.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          {/* Favorite Button */}
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
            {favorite.includes(product._id) ? "❤️" : "🤍"}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => handleAddtoCart(product._id)}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              border: "none",
              background: "transparent",
              fontSize: "20px",
              color: addToCart.includes(product._id) ? "blue" : "black",
            }}
          >
            {addToCart.includes(product._id) ? "✅" : "🛒"}
          </button>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>

            <p className='card-price' >${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                 <ProductPage selectedProduct={selectedProduct} products={products} mode={mode} favorite={favorite} cart={cartProduct} handleFavorite={handleFavorite} handleAddtoCart={handleAddtoCart} ></ProductPage>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>
            
        {showFavorite && 
                <div className="text-center my-4 d-flex align-items-center justify-content-center">
                  <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
                  <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Fvaorites</h2>
                  <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}} />
                </div>
            }
            <div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showFavorite &&
      favoriteproductsList.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          {/* Favorite Button */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: favorite.includes(product._id) ? "red" : "black",
                }}
              >
                {favorite.includes(product._id) ? "❤️" : "🤍"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => handleAddtoCart(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: addToCart.includes(product._id) ? "blue" : "black",
                }}
              >
                {addToCart.includes(product._id) ? "✅" : "🛒"}
              </button>
            </div>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>
            <p className='card-price' >${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                 <ProductPage selectedProduct={selectedProduct} products={products} mode={mode} favorite={favorite} cart={cartProduct} handleFavorite={handleFavorite} handleAddtoCart={handleAddtoCart} ></ProductPage>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>
        
        
         <div className="text-center my-4 d-flex align-items-center justify-content-center">
            <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
            <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Mobiles</h2>
            <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}} />
          </div>
       <div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showMobiles &&
      mobilesProduct.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: favorite.includes(product._id) ? "red" : "black",
                }}
              >
                {favorite.includes(product._id) ? "❤️" : "🤍"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => handleAddtoCart(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: addToCart.includes(product._id) ? "blue" : "black",
                }}
              >
                {addToCart.includes(product._id) ? "✅" : "🛒"}
              </button>
            </div>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>
            <p className='card-price'>${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                 <ProductPage selectedProduct={selectedProduct} products={products} mode={mode} favorite={favorite} cart={cartProduct} handleFavorite={handleFavorite} handleAddtoCart={handleAddtoCart} ></ProductPage>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>
        <div className="text-center my-4 d-flex align-items-center justify-content-center">
          <hr className="flex-grow-1 me-3" style={{color: mode==='light' ? 'black' : 'white'}} />
          <h2 className={`m-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Appliances</h2>
          <hr className="flex-grow-1 ms-3" style={{color: mode==='light' ? 'black' : 'white'}} />
        </div>
<div className="container mt-5">
  <div className="row gx-4 gy-4 justify-content-center">
    {showAppliances &&
      appliancesProduct.map((product) => (
        <div
          className={`product-card-${mode} col-12 col-sm-6 col-md-4 col-lg-3 mx-3 fade-in`}
          key={product._id}
          style={{
            backgroundColor: mode === "light" ? "white" : "#8b8b8b",
            position: "relative",
            minWidth: '20 px'
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: favorite.includes(product._id) ? "red" : "black",
                }}
              >
                {favorite.includes(product._id) ? "❤️" : "🤍"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => handleAddtoCart(product._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  color: addToCart.includes(product._id) ? "blue" : "black",
                }}
              >
                {addToCart.includes(product._id) ? "✅" : "🛒"}
              </button>
            </div>

          {product.images.length > 1 ? (
  <Slider {...sliderSettings}>
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
            <div>
              <button className='btn' style={{border: '5px'}} onClick={()=>setProductCount(productCount=== 0 ? 0 : productCount-1)}>-</button>
              <button className='btn btn-secondary'>{productCount}</button>
              <button className='btn' style={{border: '5px'}}onClick={()=>setProductCount(productCount > product.stock? showAlert("Cannot select more than stock" , "warning"): productCount+1)}>+</button>
            </div>

            <p className='card-price'>${product.price}</p>
            <p className="text-success">Stock Available: {product.stock}</p>

            <Link to={`/product/${product._id}`}>
              <button
              className="btn btn-primary w-100"
              disabled={product.stock === 0}
              style={{
                backgroundColor: mode === "light" ? "blue" : "#d9ad9c",
              }}
              onClick={() => handleStock(product._id)}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            </Link>

            {showForm && selectedProduct?.id === product._id && (
              <div className="mt-3">
                 <ProductPage selectedProduct={selectedProduct} products={products} mode={mode} favorite={favorite} cart={cartProduct} handleFavorite={handleFavorite} handleAddtoCart={handleAddtoCart} ></ProductPage>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
</div>
    </>
  )
} 