import React from "react";
import "../css/Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer bg-color-sub text-white mt-5">
      <div className="container py-4">
        <div className="row">

          {/* About Section */}
          <div className="col-md-4 mb-3">
            <h5>FurnShop</h5>
            <p>Modern furniture for your home and office. Quality products with fast delivery.</p>
          </div>

          {/* Links Section */}
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/products" className="footer-link">Products</a></li>
              <li><a href="/cart" className="footer-link">Cart</a></li>
              <li><a href="/login" className="footer-link">Login</a></li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="col-md-4 mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3 mt-2">
              <a href="#" className="footer-icon"><FaFacebook /></a>
              <a href="#" className="footer-icon"><FaTwitter /></a>
              <a href="#" className="footer-icon"><FaInstagram /></a>
              <a href="#" className="footer-icon"><FaLinkedin /></a>
            </div>
          </div>

        </div>

        {/* Bottom Text */}
        <div className="text-center mt-3">
          <small>© {new Date().getFullYear()} FurnShop. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
