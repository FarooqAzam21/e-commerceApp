import React, { useState } from 'react'
import './Product.css'
import { Link } from 'react-router-dom'
export default function Navbar({ title , onFavorite , onCart , mode , handleMode , alert , handleAlert}) {
    const [addProductForm , setAddProductForm] = useState(false)
    const[product , setProduct] = useState([])
    const handleProductform=()=>{
        setAddProductForm((prev)=>!prev)
    }
  return (
    <nav className={`navbar navbar-expand-lg  navbar-dark bg-${mode}`} >
        <div className="container-fluid" >
            <Link className="navbar-brand" to="/" style={{color: mode==='light' ? 'black' : 'white'}}>{title}</Link>
        <button className={`navbar-toggler bg-${mode === 'light' ? 'dark' : 'dark'}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#" style={{color: mode==='light' ? 'black' : 'white'}}>Home</a>
            </li>
            <li className="nav-item dropdown" >
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" 
                style={{color: mode==='light' ? 'black' : 'white'}}>
                Services
                </a>
                <ul className="dropdown-menu" style={{color: mode==='light' ? 'black' : 'white'}}>
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </li>
            <li className="nav-item">
                <a className="nav-link active" style={{color: mode==='light'? 'black': 'white'}}>About</a>
            </li>
            </ul>
            <Link to={"/cart"}>
                <button className="btn btn-primary me-2" 
                type="button" onClick={onCart} style={{ backgroundColor: mode==='light'? 'blue': '#d9ad9c'}}>
                🛒
            </button>
            </Link>
            <button className="btn me-2" type="button" onClick={onFavorite} style={{ backgroundColor: mode==='light'? 'blue': '#d9ad9c'}}>❤️</button>
            <Link to={'/admin/dashboard/'}>
                <button className='btn btn-primary'>Add Product</button>
            </Link>
            <div className="form-check form-switch">
                <input className="form-check-input mx-3" type="checkbox" role="switch" id="switchCheckDefault" onClick={handleMode}/>
                <label className="form-check-label" htmlFor="switchCheckDefault" style={{color: mode==='light'? 'black' : 'white'}}>Enable Dark Mode</label>
            </div>

        </div>
    </div>
    </nav>
  )
}
