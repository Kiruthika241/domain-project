import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash, FaBoxOpen, FaEraser } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    mrp: "",
    stock: "",
    image: null,
  });

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    []
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const startEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      category: "",
      price: "",
      mrp: "",
      stock: "",
      image: null,
    });
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      toast.error("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("mrp", form.mrp);
    formData.append("stock", form.stock);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editing) {
        const res = await fetch(
          `http://localhost:5000/api/products/${editing._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        const data = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p._id === data._id ? data : p))
        );

        toast.success("Product Updated");
      } else {
        const res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setProducts((prev) => [data, ...prev]);

        toast.success("Product Added");
      }

      resetForm();
    } catch {
      toast.error("Error saving product");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });

    setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.info("Product Deleted");
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Inventory Control</h2>

      {/* FORM */}
      <div className="card shadow-sm p-4 mb-5">
        <h5>{editing ? "Edit Product" : "Add Product"}</h5>

        <form onSubmit={saveProduct} className="row g-3 mt-2">
          <div className="col-md-4">
            <input
              name="name"
              placeholder="Product Name"
              className="form-control"
              value={form.name}
              onChange={onChange}
            />
          </div>

          <div className="col-md-2">
            <input
              name="category"
              placeholder="Category"
              className="form-control"
              value={form.category}
              onChange={onChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="form-control"
              value={form.price}
              onChange={onChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="mrp"
              placeholder="MRP"
              className="form-control"
              value={form.mrp}
              onChange={onChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              className="form-control"
              value={form.stock}
              onChange={onChange}
            />
          </div>

          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  image: e.target.files[0],
                }))
              }
            />
          </div>

          <div className="col-md-6 d-flex gap-2">
            <button className="btn btn-dark w-100" type="submit">
              {editing ? "Update" : "Add"}
            </button>

            {(editing || form.name) && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetForm}
              >
                <FaEraser />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt={p.name}
                      width="60"
                      height="60"
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{fmt.format(p.price)}</td>
                  <td>
                    {p.stock <= 5 ? (
                      <span className="text-danger">
                        Low ({p.stock})
                      </span>
                    ) : (
                      p.stock
                    )}
                  </td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-light me-2"
                      onClick={() => startEdit(p)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => removeProduct(p._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <FaBoxOpen size={40} />
                    <div>No products found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}