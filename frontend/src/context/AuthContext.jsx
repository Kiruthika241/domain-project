// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, name, role } or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("furnshop_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (err) {
      // ignore parse errors
      console.error("Failed to load user from localStorage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, name, role }) => {
    // replace with real API in production
    const session = { email, name, role };
    localStorage.setItem("furnshop_user", JSON.stringify(session));
    setUser(session);
  };

  const register = async ({ name, email, role }) => {
    // replace with real API
    const session = { email, name, role };
    localStorage.setItem("furnshop_user", JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem("furnshop_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout, loading }), [user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// named export hook — other modules should import { useAuth }
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
