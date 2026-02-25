// src/pages/Login.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import AuthSplitLayout from "./AuthSplitLayout";
import { useAuth } from "../context/AuthContext";
import "../css/auth-modern.css";
import split from "../assets/split.jpg";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const API_BASE = "http://localhost:5000/api";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  // Prefill saved email (optional UX)
  useEffect(() => {
    const saved = localStorage.getItem("saved_email");
    if (saved) setData((p) => ({ ...p, email: saved }));
  }, []);

  const emailOk = useMemo(() => emailRx.test(data.email.trim()), [data.email]);
  const passOk = useMemo(() => data.password.trim().length >= 6, [data.password]);
  const valid = emailOk && passOk;

  const onChange = (e) =>
    setData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onKeyUp = (e) =>
    setCaps(e.getModifierState && e.getModifierState("CapsLock"));

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return toast.error("Please fill the form correctly.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || "Login failed.");
      }

      // body: { user: {id,name,email}, token, message }
      // pass what your AuthContext expects:
      login({
        id: body.user.id,
        name: body.user.name,
        email: body.user.email,
        token: body.token,
      });

      localStorage.setItem("saved_email", data.email.trim());

      toast.success(body.message || "Logged in!");
      setLoading(false);

      nav(loc.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <AuthSplitLayout
      title="Welcome back! Please enter your details."
      subtitle="Please Login To Your Account"
      media={{
        img: split,
        heading: "Welcome back",
        text: "Log in to access your voice-enabled calculations and saved projects.",
        bullets: ["Sync across devices", "Quick voice shortcuts", "Secure sessions"],
      }}
    >
      <form onSubmit={submit} className="stack">
        {/* Email */}
        <div className="field">
          <div className="field-icon"><FaEnvelope /></div>
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
          <div className="field-icon"><FaLock /></div>
          <input
            type={show ? "text" : "password"}
            name="password"
            className="input"
            placeholder="Enter your Password"
            value={data.password}
            onChange={onChange}
            onKeyUp={onKeyUp}
            required
          />
          <button
            type="button"
            className="peek-btn"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {caps && <p className="hint warn">Caps Lock is ON.</p>}

        <div className="row-between">
          <span />
          <Link to="/forgot-password" className="link-muted">Forgot Password?</Link>
        </div>

        <button
          className="btn"
          style={{ background: "#232f3e", color: "white" }}
          type="submit"
          disabled={loading || !valid}
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <div className="or"><span>Or</span></div>

        <button type="button" className="btn btn-ghost">
          <FaGoogle className="me-2" /> Login with Google
        </button>

        <p className="center">
          Don’t have an account? <Link to="/register" className="link">Sign up</Link>
        </p>

        <p className="legal">
          By continuing, you agree to our <Link to="/terms">Terms</Link> &{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </form>
    </AuthSplitLayout>
  );
}
