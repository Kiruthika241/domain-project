import React, { useEffect, useMemo, useState } from "react";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 📥 Fetch Orders
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );

      toast.success("Order updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  // 🗑 Delete Order
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE",
    });

    setOrders((prev) => prev.filter((o) => o._id !== id));
    toast.info("Order deleted");
  };

  // 🔍 Filter + Search
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter =
        filter === "All" || o.status === filter;
      const matchSearch =
        o.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        o._id.includes(searchTerm);

      return matchFilter && matchSearch;
    });
  }, [orders, filter, searchTerm]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Order Management</h2>

      {/* Search */}
      <div className="input-group mb-4">
        <span className="input-group-text">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID or customer..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="mb-4 d-flex gap-2">
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn ${
                filter === tab
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id}>
                <td>
                  <div className="fw-bold">
                    {o._id.slice(-6)}
                  </div>
                  <div className="text-muted small">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </td>

                <td>
                  <div className="fw-bold">
                    {o.customerName}
                  </div>
                  <div className="text-muted small">
                    {o.customerEmail}
                  </div>
                </td>

                <td>
                  <select
                    className="form-select form-select-sm"
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>

                <td>${o.totalAmount}</td>

                <td className="text-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteOrder(o._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No matching orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}