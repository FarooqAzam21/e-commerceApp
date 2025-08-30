const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1️⃣ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2️⃣ Define Product Schema
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  features: [String],
  images: [String],
  stock: Number,
  category: String,
});

const Product = mongoose.model('Product', productSchema);

// 3️⃣ Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/products/:id' , async (req , res)=>{
  try{
    const updateProduct = await Product.findByIdAndUpdate(
    req.params.id ,
    req.body,
    {new : true}
  )
  if(!updateProduct) return res.status(404).json({message: "Product not found"})
    res.json({message: "Product updated successfully " , product: updateProduct})
  }
  catch(err){
    res.status(500).json({eroor: err.message})
  }
})
app.delete('/api/products/:id' , async (req , res)=>{
  try{
    const deletedProduct = await Product.findOneAndDelete(req.params.id)
    if(!deletedProduct) return res.status(404).json({message: "Product not find "})
    res.json({message: "Product deleted successfully"})  
  }catch(err){
    res.status(500).json({error: err.message})
  }
})

// 4️⃣ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
