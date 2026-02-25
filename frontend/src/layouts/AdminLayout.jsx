import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt, FaCouch, FaShoppingBag, FaUsers,
  FaSignOutAlt, FaLock, FaUserShield, FaUserCog, FaArrowLeft
} from "react-icons/fa";

// Reusable NavItem Component
const NavItem = ({ to, icon: Icon, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${
        isActive ? "bg-primary text-white shadow-sm" : "text-light opacity-75 hover-bg-light"
      }`
    }
  >
    <Icon size={18} />
    <span style={{ fontWeight: "500" }}>{label}</span>
  </NavLink>
);

export default function AdminLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("superAdminAuth");
    if (auth === "true") setIsLoggedIn(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock Credentials
    if (email === "admin@furnshop.com" && password === "admin123") {
      localStorage.setItem("superAdminAuth", "true");
      setIsLoggedIn(true);
    } else {
      alert("Invalid Super Admin Credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("superAdminAuth");
    setIsLoggedIn(false);
  };

  // --- LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: "400px" }}>
          <div className="bg-primary p-4 text-center text-white">
            <FaUserShield size={50} className="mb-2" />
            <h3 className="fw-bold m-0 text-uppercase tracking-wider">Super Admin</h3>
            <p className="small opacity-75 m-0">Secure Access Portal</p>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-bold">ADMIN EMAIL</label>
                <input 
                  type="email" 
                  className="form-control bg-light border-0 py-2" 
                  placeholder="admin@furnshop.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">PASSWORD</label>
                <input 
                  type="password" 
                  className="form-control bg-light border-0 py-2" 
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                <FaLock className="me-2 mb-1" size={14} /> Authenticate
              </button>
            </form>
            <div className="text-center mt-3">
               <a href="http://localhost:5173/" className="text-decoration-none small text-muted">
                 <FaArrowLeft size={10} /> Return to Storefront
               </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN PANEL VIEW ---
  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      {/* SIDEBAR */}
      <aside className="bg-dark text-white d-flex flex-column shadow" style={{ width: 260, position: "sticky", top: 0, height: "100vh", zIndex: 1000, background: "linear-gradient(180deg, #212529 0%, #1a1d20 100%)" }}>
        <div className="p-4 border-bottom border-secondary mb-3 text-center">
          <h4 className="m-0 d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase">
            <FaCouch className="text-primary" /> FurnShop
          </h4>
        </div>

        <nav className="nav nav-pills flex-column gap-2 px-3 flex-grow-1">
          <small className="text-uppercase text-secondary fw-bold mb-1 ps-2" style={{ fontSize: '0.65rem' }}>Main Menu</small>
          <NavItem to="/admin" icon={FaTachometerAlt} label="Dashboard" end />
          <NavItem to="/admin/products" icon={FaCouch} label="Products" />
          <NavItem to="/admin/orders" icon={FaShoppingBag} label="Orders" />
          
          <div className="my-3 border-top border-secondary opacity-25"></div>
          
          <small className="text-uppercase text-secondary fw-bold mb-1 ps-2" style={{ fontSize: '0.65rem' }}>Management</small>
          <NavItem to="/admin/customers" icon={FaUsers} label="Customers" />
          <NavItem to="/admin/users" icon={FaUserCog} label="Users" />
        </nav>

        {/* SIDEBAR FOOTER ACTIONS */}
        <div className="p-3 mt-auto border-top border-secondary d-flex flex-column gap-2">
          {/* BACK TO MAIN WEBSITE BUTTON */}
          <a 
            href="http://localhost:5173/" 
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 opacity-75 transition-all"
          >
            <FaArrowLeft size={12} /> View Website
          </a>

          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow-1 d-flex flex-column">
        {/* HEADER */}
        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-3">
             {/* Header Back Button for quick navigation */}
             
             <h5 className="m-0 text-dark fw-bold">Admin Panel</h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <p className="m-0 small fw-bold text-dark">Kiruthika</p>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10" style={{fontSize: '10px'}}>SUPER ADMIN</span>
            </div>
            <img 
              src="https://ui-avatars.com/api/?name=Kiruthika&background=0D6EFD&color=fff" 
              alt="Kiruthika Profile" 
              className="rounded-circle shadow-sm border border-2 border-white" 
              width="40" 
            />
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <section className="p-0 overflow-auto flex-grow-1">
          <div className="container-fluid p-4">
             <Outlet />
          </div>
        </section>
      </main>

      {/* CUSTOM CSS STYLES */}
      <style>{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-bg-light:hover { background: rgba(255,255,255,0.05); color: white !important; opacity: 1 !important; }
        .nav-link.active { box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25); }
        .btn-outline-light:hover { background-color: rgba(255,255,255,0.1); opacity: 1 !important; }
      `}</style>
    </div>
  );
}