import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const currency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const discount = (p) =>
    Math.round(((p.mrp - p.price) / p.mrp) * 100);

  const stars = (n = 4) => {
    return (
      <span>
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={i < Math.round(n) ? "text-warning" : "text-muted"}
          />
        ))}
      </span>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">
        Our Furniture Collection 🛋️
      </h2>

      <div className="row g-4">
        {products.map((p) => (
          <div className="col-md-3 col-sm-6" key={p._id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={`http://localhost:5000${p.image}`}
                alt={p.name}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h6 className="fw-semibold">{p.name}</h6>

                <div className="mb-2">
                  {stars(p.rating)}
                  <small className="text-muted ms-2">
                    ({p.reviews || 0})
                  </small>
                </div>

                <div className="mb-2">
                  <span className="text-muted text-decoration-line-through me-2">
                    {currency(p.mrp)}
                  </span>
                  <span className="text-success fw-bold">
                    {currency(p.price)}
                  </span>
                </div>

                <span className="badge bg-success mb-3">
                  Save {discount(p)}%
                </span>

                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => {
                    addToCart(p);
                    toast.success("Added to cart 🛒");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-5">
            No products available
          </div>
        )}
      </div>
    </div>
  );
}