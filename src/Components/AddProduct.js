import React, { useState } from "react";
import axios from "axios";

export default function AddProduct({ refreshProduct, setLoader, product, setProduct }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    features: "",
    images: "",
  });

  const [updateProduct, setUpdateProduct] = useState({}); // ✅ for modal editing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ProductToSend = {
      title: formData.title,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
      features: formData.features.split(","), // ✅ fix (was category)
      images: formData.images.split(","),
    };

    try {
      await axios.post("http://localhost:5000/api/products", ProductToSend);
      refreshProduct();
      alert("Product added successfully");
      setFormData({
        title: "",
        price: "",
        stock: "",
        category: "",
        features: "",
        images: "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to add Product");
    }
  };

  // ✅ UPDATE PRODUCT
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${updateProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(updateProduct),
        }
      );
      const data = await res.json();

      setProduct(
        product.map((p) => (p._id === updateProduct._id ? data : p)) // ✅ fix replace with new data
      );

      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("updateModal")
      );
      modal.hide();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      setProduct(product.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const styles = { width: "500px" };

  return (
    <>
      <div className="container mt-4">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="form-control mb-2"
          />
          <input
            style={styles}
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="form-control mb-2"
          />
          <input
            style={styles}
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="form-control mb-2"
          />
          <input
            style={styles}
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="form-control mb-2"
          />
          <input
            style={styles}
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Features (comma separated)"
            className="form-control mb-2"
          />
          <input
            style={styles}
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="Images URLs (comma separated)"
            className="form-control mb-2"
          />
          <button style={styles} type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
      </div>

      {/* PRODUCT TABLE */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">Product #</th>
            <th scope="col">Product ID</th>
            <th scope="col">Product Title</th>
            <th scope="col">Product Stock</th>
            <th scope="col">Product Price</th>
            <th scope="col">Product Category</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {product.map((p, index) => (
            <tr key={p._id}>
              <th scope="row">{index + 1}</th>
              <td>{p._id}</td>
              <td>{p.title}</td>
              <td>{p.stock}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#updateModal"
                  onClick={() => setUpdateProduct(p)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* UPDATE MODAL */}
      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Product</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updateProduct.title || ""}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={updateProduct.price || ""}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={updateProduct.stock || ""}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        stock: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updateProduct.category || ""}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        category: e.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
