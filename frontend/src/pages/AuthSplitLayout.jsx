import React from "react";
import "../css/auth-modern.css";
import split from '../assets/split.jpg';

export default function AuthSplitLayout({
  children,
  title,
  subtitle,
  media = {
    img: split,
    heading: "Welcome back",
    text: "Log in to access your voice-enabled calculations and saved projects.",
    bullets: ["Sync across devices", "Quick voice shortcuts", "Secure sessions"],
  },
}) {
  return (
    <div className="auth-wrap">
      <div className="auth-grid">
        {/* Left panel */}
        <section className="pane pane--media">
          <img className="pane-media" src={media.img} alt="" />
          <div className="pane-overlay" />
          <div className="pane-content">
            <h2 className="pane-title">{media.heading}</h2>
            <p className="pane-sub">{media.text}</p>
            <ul className="pane-list">
              {media.bullets.map((b, i) => <li key={i}>• {b}</li>)}
            </ul>
          </div>
        </section>

        {/* Right panel */}
        <section className="pane pane--form">
          <div className="form-head">
            <h3 className="form-title">{title}</h3>
            {subtitle && <p className="form-sub">{subtitle}</p>}
          </div>
          <div className="form-body">{children}</div>
        </section>
      </div>

      <footer className="auth-foot">© {new Date().getFullYear()} FurnShop</footer>
    </div>
  );
}
