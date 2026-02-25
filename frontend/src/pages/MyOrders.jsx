import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";

export default function MyOrders() {
  const { cartItems, clearCart } = useCart();
  const [orders, setOrders] = useState([]);

  // 🧮 Calculations
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );
  const tax = subtotal * 0.1;
  const shipping = cartItems.length > 0 ? 25 : 0;
  const total = subtotal + tax + shipping;

  // 📦 Place Order
  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Kritika Devi",
          customerEmail: "kritika@mail.com",
          items: cartItems,
          totalAmount: total,
        }),
      });

      const data = await res.json();
      setOrders((prev) => [data, ...prev]);
      clearCart();
      toast.success("Order placed successfully 🎉");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  // 📥 Fetch Orders
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">📦 My Orders</h2>

      {/* CART SUMMARY */}
      {cartItems.length > 0 && (
        <div className="card shadow-sm p-4 mb-5">
          <h5 className="fw-bold mb-3">Order Summary</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              Subtotal <strong>${subtotal.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Tax (10%) <strong>${tax.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Shipping <strong>${shipping.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between fs-5">
              Total <strong className="text-success">${total.toFixed(2)}</strong>
            </li>
          </ul>

          <button
            className="btn btn-primary mt-4"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      )}

      {/* ORDER LIST */}
      {orders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <FaBoxOpen size={50} className="mb-3 opacity-50" />
          <p>No orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card shadow-sm p-4 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">
                Order ID: {order._id.slice(-6)}
              </h6>
              <span
                className={`badge ${
                  order.status === "Delivered"
                    ? "bg-success"
                    : order.status === "Shipped"
                    ? "bg-info"
                    : order.status === "Cancelled"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-2 text-muted small">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>

            <div className="mb-2">
              <strong>Total:</strong> ${order.totalAmount}
            </div>

            <div>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mb-2"
                >
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                    className="me-3"
                  />
                  <div>
                    <div className="fw-bold">{item.name}</div>
                    <div className="text-muted">${item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}