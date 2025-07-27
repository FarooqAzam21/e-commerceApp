import React, { useState } from 'react'
import axios from 'axios'


export default function AddProduct({refreshProduct , setLoader}) {
    const [formData , setFormData] = useState({
        title: '',
        price: '',
        stock: '',
        category: '',
        features: '',
        images: ''
    })
    const handleChange =(e)=>{
        const {name , value} = e.target
        setFormData(prev=>({
            ...prev , [name] :value
        }))
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const ProductToSend = {
            title: formData.title,
            price: formData.price,
            stock: formData.stock,
            category: formData.category,
            features: formData.category.split(','),
            images: formData.images.split(',')
        }
        try{
            const res = await axios.post("http://localhost:5000/api/products" , ProductToSend)
            setLoader(true)
            refreshProduct()
            alert("Product added successfully")
            setFormData(
                {title: '',
                price: '',
                stock: '',
                category: '',
                features: '',
                images: ''})
        }
        catch(err){
            console.error(err)
            alert("Unavble to add Product")
        }
    }
  return (
    <>
        <div className="container mt-4">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="form-control mb-2" />
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="form-control mb-2" />
        <input name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="form-control mb-2" />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="form-control mb-2" />
        <input name="features" value={formData.features} onChange={handleChange} placeholder="Features (comma separated)" className="form-control mb-2" />
        <input name="images" value={formData.images} onChange={handleChange} placeholder="Images URLs (comma separated)" className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
    </>
  )
}
