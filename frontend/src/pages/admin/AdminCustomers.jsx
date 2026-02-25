import React, { useState } from "react";
import { FaUserTag, FaEnvelope, FaCalendarAlt, FaShoppingBasket, FaSearch, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

const dummyCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com", orders: 12, joined: "2025-06-01", spend: 2450.00 },
  { id: 2, name: "Sarah Lee", email: "sarah@example.com", orders: 1, joined: "2025-07-15", spend: 120.50 },
  { id: 3, name: "Michael Chen", email: "m.chen@tech.com", orders: 5, joined: "2025-08-20", spend: 890.00 },
  { id: 4, name: "Emma Wilson", email: "emma.w@design.com", orders: 8, joined: "2025-09-10", spend: 1100.25 },
];

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = dummyCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTier = (orders) => {
    if (orders >= 10) return { label: "VIP", color: "bg-warning text-dark" };
    if (orders >= 5) return { label: "Loyal", color: "bg-info-subtle text-info" };
    return { label: "New", color: "bg-light text-secondary" };
  };

  return (
    <div className="container-fluid py-4">
      {/* Header & Stats */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="fw-black text-dark mb-1">Customer Directory</h2>
          <p className="text-muted small">Manage your relationships and view buying history.</p>
        </div>
        <div className="col-md-6 text-md-end">
          <div className="d-inline-flex gap-2">
            <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white px-3 border">
              <span className="input-group-text bg-transparent border-0"><FaSearch className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-0 shadow-none small" 
                placeholder="Find a customer..." 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer List Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted small fw-bold">
                <th className="ps-4 py-3">CUSTOMER</th>
                <th className="py-3">TIER</th>
                <th className="py-3">ORDER HISTORY</th>
                <th className="py-3">TOTAL SPEND</th>
                <th className="py-3">JOINED DATE</th>
                <th className="pe-4 py-3 text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => {
                const tier = getTier(c.orders);
                return (
                  <tr key={c.id} className="border-bottom-faint">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{c.name}</div>
                          <div className="text-muted x-small d-flex align-items-center gap-1">
                            <FaEnvelope size={10} /> {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-1 fw-bold ${tier.color}`} style={{ fontSize: '10px' }}>
                        {tier.label}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1 bg-light rounded-pill" style={{ height: '6px', maxWidth: '100px' }}>
                          <div className="progress-bar bg-primary" style={{ width: `${Math.min(c.orders * 10, 100)}%` }}></div>
                        </div>
                        <span className="small fw-bold text-dark">{c.orders}</span>
                      </div>
                    </td>
                    <td>
                      <div className="fw-black text-dark">${c.spend.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="text-secondary small d-flex align-items-center gap-1">
                        <FaCalendarAlt size={12} /> {c.joined}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-light text-primary rounded-3 p-2 shadow-sm border" title="View Profile">
                          <FaExternalLinkAlt size={12} />
                        </button>
                        <button className="btn btn-sm btn-light text-danger rounded-3 p-2 shadow-sm border" title="Delete Account">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-5">
              <FaUserTag size={40} className="text-muted opacity-25 mb-3" />
              <h5 className="text-muted fw-bold">No customers found</h5>
              <p className="text-muted small">Try searching for a different name or email.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 800; }
        .x-small { font-size: 0.75rem; }
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .border-bottom-faint { border-bottom: 1px solid rgba(0,0,0,0.03); }
        .bg-info-subtle { background-color: #e0f7fa !important; color: #00838f !important; }
        .table-hover tbody tr:hover { background-color: #fcfdfe; }
      `}</style>
    </div>
  );
}