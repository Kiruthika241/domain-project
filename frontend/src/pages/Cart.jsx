// src/pages/Cart.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // ---- Display helpers ----
  const fmt = useMemo(
    () => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }),
    []
  );

  // ---- Local quantity state (kept in this component only) ----
  // Default quantity = 1 per item. Sync if cartItems change.
  const [qtyById, setQtyById] = useState({});
  useEffect(() => {
    setQtyById((prev) => {
      const next = { ...prev };
      cartItems.forEach((it) => {
        if (!next[it.id]) next[it.id] = 1;
      });
      // Drop quantities for items no longer in cart
      Object.keys(next).forEach((id) => {
        if (!cartItems.find((it) => String(it.id) === String(id))) delete next[id];
      });
      return next;
    });
  }, [cartItems]);

  const setQty = useCallback((id, q) => {
    setQtyById((prev) => ({ ...prev, [id]: Math.max(1, Math.min(10, q)) }));
  }, []);

  // ---- Pricing rules (tweak if you like) ----
  const SHIPPING_THRESHOLD = 750; // Free shipping at or above this subtotal
  const SHIPPING_FLAT = 29;       // Otherwise flat shipping
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null); // { code, discountPct, freeShip }

  const applyCoupon = useCallback(() => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    if (code === "SAVE10") setApplied({ code, discountPct: 10, freeShip: false });
    else if (code === "FREESHIP") setApplied({ code, discountPct: 0, freeShip: true });
    else setApplied({ code, discountPct: 0, freeShip: false, invalid: true });
  }, [coupon]);

  const clearCoupon = useCallback(() => {
    setApplied(null);
    setCoupon("");
  }, []);

  // ---- Totals ----
  const lineItems = useMemo(
    () =>
      cartItems.map((it) => {
        const qty = qtyById[it.id] || 1;
        const price = Number(it.price) || 0;
        return { ...it, qty, lineTotal: price * qty, unitPrice: price };
      }),
    [cartItems, qtyById]
  );

  const subtotal = useMemo(
    () => lineItems.reduce((sum, li) => sum + li.lineTotal, 0),
    [lineItems]
  );

  const discount = useMemo(() => {
    if (!applied || !applied.discountPct) return 0;
    return (subtotal * applied.discountPct) / 100;
  }, [applied, subtotal]);

  const qualifiesFreeShip = applied?.freeShip || subtotal >= SHIPPING_THRESHOLD;
  const shipping = subtotal === 0 ? 0 : qualifiesFreeShip ? 0 : SHIPPING_FLAT;

  const total = useMemo(() => Math.max(0, subtotal - discount) + shipping, [subtotal, discount, shipping]);

  const remainingForFreeShip = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100));

  // ---- Empty cart ----
  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="display-6 mb-2">🛒 Your cart is empty</div>
          <p className="text-muted mb-4">Looks like you haven’t added anything yet.</p>
          <Link className="btn btn-primary" to="/products">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-3 text-center">🛒 Your Cart</h1>

      {/* Free shipping banner */}
      <div className={`alert ${qualifiesFreeShip ? "alert-success" : "alert-info"} mb-4`} role="status">
        {qualifiesFreeShip ? (
          <>🎉 You’ve unlocked <strong>FREE shipping</strong>!</>
        ) : (
          <>Spend <strong>{fmt.format(remainingForFreeShip)}</strong> more to unlock <strong>FREE shipping</strong>.</>
        )}
        <div className="progress mt-2" style={{ height: 8 }}>
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      <div className="row g-4">
        {/* Left: items */}
        <div className="col-12 col-lg-8">
          <div className="list-group">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="list-group-item d-flex flex-wrap align-items-center justify-content-between shadow-sm mb-3 rounded border-0"
                style={{ boxShadow: "0 6px 16px rgba(16,24,40,.06)" }}
              >
                <div className="d-flex align-items-center me-3" style={{ minWidth: 230 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/120x120?text=No+Image")}
                    style={{
                      width: 84,
                      height: 84,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginRight: 14,
                      background: "#f3f4f6",
                    }}
                  />
                  <div>
                    <h6 className="mb-1">{item.name}</h6>
                    <div className="text-muted small">Unit: {fmt.format(item.unitPrice)}</div>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="d-flex align-items-center gap-2 my-2 my-lg-0">
                  <div className="input-group" style={{ width: 130 }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, (qtyById[item.id] || 1) - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      min={1}
                      max={10}
                      value={qtyById[item.id] || 1}
                      onChange={(e) => setQty(item.id, Number(e.target.value))}
                      aria-label="Quantity"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, (qtyById[item.id] || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line total + remove */}
                <div className="text-end" style={{ minWidth: 160 }}>
                  <div className="fw-semibold">{fmt.format(item.lineTotal)}</div>
                  <button
                    className="btn btn-sm btn-link text-danger mt-1"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Link to="/products" className="btn btn-outline-secondary">
              ← Continue shopping
            </Link>
          </div>
        </div>

        {/* Right: summary */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: 16 }}>
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>{fmt.format(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Discount</span>
                <span className={discount > 0 ? "text-success" : "text-muted"}>
                  − {fmt.format(discount)}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? <span className="text-success">FREE</span> : fmt.format(shipping)}</span>
              </div>

              {/* Coupon */}
              <div className="mb-3">
                <label className="form-label">Have a coupon?</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Try SAVE10 or FREESHIP"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  {applied ? (
                    <button className="btn btn-outline-danger" onClick={clearCoupon}>
                      Remove
                    </button>
                  ) : (
                    <button className="btn btn-outline-primary" onClick={applyCoupon}>
                      Apply
                    </button>
                  )}
                </div>
                {applied?.invalid && (
                  <div className="small text-danger mt-1">Invalid code.</div>
                )}
                {applied && !applied.invalid && (
                  <div className="small text-success mt-1">
                    Applied <strong>{applied.code}</strong>
                    {applied.discountPct ? ` (−${applied.discountPct}%)` : ""}
                    {applied.freeShip ? " (Free shipping)" : ""}
                  </div>
                )}
              </div>

              <hr />

              <div className="d-flex justify-content-between fs-5 mb-3">
                <strong>Total</strong>
                <strong>{fmt.format(total)}</strong>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/myorders")}
              >
                Proceed to Checkout
              </button>

              <p className="text-muted small mt-2 mb-0">
                Secure checkout · No additional fees at payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
