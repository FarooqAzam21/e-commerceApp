const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5000
app.use(cors())
app.use(express.json())
let products = [
        {
        id: 1,
        title : "Fridge",
        price: 150,
        features: ["Long lasting cooling", "Low energy consuming" , "In low price"],
        images: [
            "",
            "",
            ""
        ],
        stock: 10,
        category: 'Aplliances'  },
    {
        id: 3,
        title : "LED",
        price: 550,
        features: ["HD Display", "HDMI Port" ,"Multiple USB Port", "In low price"],
        images: [
            "",
            "",
            ""
        ],
        stock: 3,
        category: 'Aplliances'  },   
    {
        id: 2,
        title : "Iphone 16 pro",
        price: 250,
        features: ["Long lasting Battery", "HD Cameras" , "in low price"],
        images: [
            "/iPhone-16-Teal-1.png",
            "/th (3).jpeg",
            "/iPhone-16-Pro-Mock-Header-Updated.jpg"
        ],
        stock: 19,
        category: 'Mobiles'
    }
    ]

app.get('/api/products' , (req , res)=>{
    res.json(products)
})
app.post('/api/products' , (req , res)=>{
    const newProduct = req.body
    newProduct.id = products.length + 1
    products.push(newProduct)
    res.status(201).json({message: "Product added successfuly" , products: newProduct})
})
app.listen(PORT ,()=>{
    console.log(`Server is running on ${PORT}`)
})