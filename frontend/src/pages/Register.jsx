// src/pages/Register.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import AuthSplitLayout from "./AuthSplitLayout";
import "../css/auth-modern.css";
import split from "../assets/split.jpg";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const API_BASE = "http://localhost:5000/api";

function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..5
}

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const nameOk = useMemo(() => data.name.trim().length >= 2, [data.name]);
  const emailOk = useMemo(() => emailRx.test(data.email.trim()), [data.email]);
  const s = useMemo(() => strengthScore(data.password), [data.password]);
  const pwOk = useMemo(() => s >= 3 && data.password.length >= 8, [s, data.password]);
  const cfOk = useMemo(
    () => data.confirm === data.password && data.confirm.length > 0,
    [data.confirm, data.password]
  );
  const valid = nameOk && emailOk && pwOk && cfOk && data.agree;

  const pct = (s / 5) * 100;

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return toast.error("Please complete the form correctly.");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          password: data.password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || "Failed to create account.");
      }

      // Optional: remember email for login page
      localStorage.setItem("saved_email", data.email.trim());

      toast.success(body.message || `Account created! Please log in, ${data.name}.`);

      setLoading(false);
      // Redirect to login page
      nav("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <AuthSplitLayout
      title="Create your account."
      subtitle="Join and start exploring"
      media={{
        img: split,
        heading: "Start your journey",
        text: "Set up your account to sync your projects and personalize your workspace.",
        bullets: ["Personalized picks", "Faster checkout", "Manage orders"],
      }}
    >
      <form onSubmit={submit} className="stack">
        {/* Name */}
        <div className="field">
          <div className="field-icon">
            <FaUser />
          </div>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="Full Name"
            value={data.name}
            onChange={onChange}
            required
          />
        </div>

        {/* Email */}
        <div className="field">
          <div className="field-icon">
            <FaEnvelope />
          </div>
          <input
            type="email"
            name="email"
            className="input"
            placeholder="Enter your email"
            value={data.email}
            onChange={onChange}
            required
          />
        </div>

        {/* Password */}
        <div className="field">
          <div className="field-icon">
            <FaLock />
          </div>
          <input
            type={showPw ? "text" : "password"}
            name="password"
            className="input"
            placeholder="Create a Password"
            value={data.password}
            onChange={onChange}
            required
          />
          <button
            type="button"
            className="peek-btn"
            onClick={() => setShowPw((v) => !v)}
          >
            {showPw ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Strength Bar */}
        {data.password && (
          <div className="strength">
            <div
              className={`bar ${
                pct >= 80 ? "ok" : pct >= 60 ? "good" : pct >= 40 ? "warn" : "bad"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        {/* Confirm */}
        <div className="field">
          <div className="field-icon">
            <FaLock />
          </div>
          <input
            type={showCf ? "text" : "password"}
            name="confirm"
            className="input"
            placeholder="Confirm Password"
            value={data.confirm}
            onChange={onChange}
            required
          />
          <button
            type="button"
            className="peek-btn"
            onClick={() => setShowCf((v) => !v)}
          >
            {showCf ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Terms */}
        <label className="agree">
          <input
            type="checkbox"
            name="agree"
            checked={data.agree}
            onChange={onChange}
          />
          <span>
            I agree to the <Link to="/terms">Terms</Link> &{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </span>
        </label>

        <button
          className="btn"
          style={{ background: "#232f3e", color: "white" }}
          type="submit"
          disabled={loading || !valid}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="or">
          <span>Or</span>
        </div>

        <button type="button" className="btn btn-ghost">
          <FaGoogle className="me-2" /> Sign up with Google
        </button>

        <p className="center">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
