import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../css/Navbar.css";

export default function Navbar() {
  const { cartItems = [] } = useCart() ?? {};
  const { user, logout } = useAuth() ?? {};
  const navigate = useNavigate();

  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const collapseRef = useRef(null);

  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "User");
  const avatarLetter = (displayName || "?").charAt(0).toUpperCase();

  useEffect(() => {
    function handleDocClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (collapseRef.current && !collapseRef.current.contains(e.target)) {
        const toggler = document.getElementById("navbar-toggler-btn");
        if (toggler && toggler.contains(e.target)) return;
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const handleLogout = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
    if (logout) logout();
    navigate("/login");
  };

  const onNavigateClose = () => setMobileOpen(false);

  return (
    <nav className="navbar navbar-expand-md navbar-dark border-bottom sticky-top">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          onClick={onNavigateClose}
        >
          <span style={{ fontSize: 26 }}>🛒</span>
          <span className="ms-2 fw-bold fs-4 text-light">FurnShop</span>
        </Link>

        <button
          id="navbar-toggler-btn"
          type="button"
          className="navbar-toggler"
          onClick={(e) => {
            e.stopPropagation();
            setMobileOpen((s) => !s);
          }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          ref={collapseRef}
          className={`navbar-collapse ${mobileOpen ? "show-mobile" : ""}`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-md-0 align-items-center">

            <li className="nav-item me-3">
              <Link className="nav-link d-flex align-items-center" to="/" onClick={onNavigateClose}>
                <FaHome className="me-2" />
                Home
              </Link>
            </li>

            <li className="nav-item me-3">
              <Link className="nav-link d-flex align-items-center" to="/products" onClick={onNavigateClose}>
                <FaBoxOpen className="me-2" />
                Products
              </Link>
            </li>

            <li className="nav-item me-3 position-relative">
              <Link
                className="nav-link d-flex align-items-center position-relative"
                to="/cart"
                onClick={onNavigateClose}
              >
                <FaShoppingCart className="me-2" />
                Cart

                {cartCount > 0 && (
                  <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {!user ? (
              <li className="nav-item me-3">
                <Link className="btn btn-outline-light px-3" to="/login" onClick={onNavigateClose}>
                  Login
                </Link>
              </li>
            ) : (
              <li
                className="nav-item dropdown"
                ref={dropdownRef}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="btn btn-outline-light d-flex align-items-center user-toggle-btn"
                  onClick={() => setDropdownOpen((s) => !s)}
                >
                  <div className="avatar-circle me-2">
                    {avatarLetter}
                  </div>
                  <span>
                    {displayName.length > 12
                      ? displayName.substring(0, 12) + "…"
                      : displayName}
                  </span>
                </button>

                {dropdownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show mt-2 shadow-sm">
                    <li className="px-3 py-2">
                      <small className="text-muted">Signed in as</small>
                      <div className="fw-semibold">{user?.email}</div>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger fw-semibold"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}