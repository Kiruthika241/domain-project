import React from "react";
import hero from "../assets/hero.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Home.css";
import chair from '../assets/chair.jpg';
import chair1 from '../assets/chair1.jpg';
import chair2 from '../assets/chair2.jpg';
import chair3 from '../assets/chair3.jpg';
import sofa1 from '../assets/sofa1.jpg';
import combo from '../assets/combo.jpg';




export default function Home() {
  const categories = [
    { name: "Chair", items: 200, icon: "fa-chair", active: true },
    { name: "Sofa", items: 240, icon: "fa-couch" },
    { name: "Table", items: 140, icon: "fa-table" },
    { name: "Bed", items: 340, icon: "fa-bed" },
    { name: "Vanity", items: 440, icon: "fa-lightbulb" },
  ];

  const products = [
    {
      name: "Chair",
      price: "Rs:5000",
      image: chair,
    },
    {
      name: "Chair",
      price: "Rs:7999",
      image: chair1,
    },
    {
      name: "Chair",
      price: "Rs:9299",
      image: chair2,
    },
    {
      name: "Chair",
      price: "Rs:6999",
      image: chair3,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div style={{ height: "80vh", overflow: "hidden" }}>
        <img
          src={hero}
          alt="Hero Background"
          className="img-fluid w-100"
          style={{ objectFit: "cover", height: "100%" }}
        />
      </div>

      {/* Category Section */}
      <div className="container py-5">
        <h4 className="text-center fw-bold mb-4">Category</h4>
        <div className="row g-3 justify-content-center">
          {categories.map((cat, index) => (
            <div className="col-6 col-md-4 col-lg-2" key={index}>
              <div
                className={`card text-center p-3 shadow-sm category-card ${cat.active ? "active" : ""
                  }`}
              >
                <i className={`fas ${cat.icon} fa-2x mb-2`}></i>
                <h6 className="mb-1">{cat.name}</h6>
                <small>{cat.items} Item Available</small>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Product Section */}
        <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
          <h5 className="fw-bold">Popular Product</h5>
          <a href="/products" className="text-decoration-none">
            See all
          </a>
        </div>
        <div className="row g-4">
          {products.map((product, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
              <div className="card h-100 shadow-sm product-card">
                <img
                  src={product.image}
                  className="card-img-top product-img p-3"
                  alt={product.name}
                />
                <div className="card-body text-center">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="text-muted mb-2">Price: {product.price}</p>
                  <button className="btn btn-primary w-100">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* section  */}
      {/* Discount Section */}
      <div className="container my-5">
        <div className="row g-4">
          {/* Left Banner */}
          <div className="col-12 col-md-6">
            <div className="banner-card">
              <img
                src={sofa1}
                alt="Sofa Discount"
              />
              <div className="banner-content">
                <p className="text-white fs-5">Up to 25% Discount</p>
                <h3 className="text-white">
                  Explore Our Luxurious Sofa <br /> Set Collection
                </h3>
                <button
                  className="banner-btn mt-2"
                  onClick={() => (window.location.href = "/products")}
                >
                  Shop Now
                </button>

              </div>
            </div>
          </div>

          {/* Right Banner */}
          <div className="col-12 col-md-6">
            <div className="banner-card">
              <img
                src={combo}
                alt="Combo Discount"
              />
              <div className="banner-content">
                <p className="text-white fw-bold fs-5">20% Discount</p>
                <h3 className="text-white">New Combo Collection</h3>
                <button
                  className="banner-btn mt-2"
                  onClick={() => (window.location.href = "/products")}
                >
                  Shop Now
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>



    </>
  );
}
