import React, { useEffect, useState } from "react";
import { FaUserShield, FaEnvelope, FaCalendarAlt, FaSearch, FaUserPlus, FaUserCircle } from "react-icons/fa";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Small delay for smooth transition
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h2 className="fw-black text-dark mb-1">System Users</h2>
          <p className="text-muted small">Manage administrative access and registered accounts.</p>
        </div>
        
        <div className="d-flex gap-3">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white px-3 border" style={{ width: '280px' }}>
            <span className="input-group-text bg-transparent border-0"><FaSearch className="text-muted" /></span>
            <input 
              type="text" 
              className="form-control border-0 shadow-none small" 
              placeholder="Search users..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted small fw-bold">
                <th className="ps-4 py-3">USER INFO</th>
                <th className="py-3">ROLE</th>
                <th className="py-3">REGISTRATION DATE</th>
                <th className="py-3 text-center">STATUS</th>
                <th className="pe-4 py-3 text-end">MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // SKELETON LOADER
                [1, 2, 3, 4].map((n) => (
                  <tr key={n} className="skeleton-row">
                    <td className="ps-4 py-3"><div className="skeleton-line w-75"></div></td>
                    <td><div className="skeleton-line w-50"></div></td>
                    <td><div className="skeleton-line w-50"></div></td>
                    <td><div className="skeleton-line mx-auto w-25"></div></td>
                    <td className="pe-4"><div className="skeleton-line ms-auto w-25"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <FaUserCircle size={40} className="text-muted opacity-25 mb-3" />
                    <h6 className="text-muted fw-bold">No Users Found</h6>
                    <p className="text-muted x-small">No data matches your current criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-bottom-faint transition-all">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-box bg-primary bg-opacity-10 text-primary">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{user.name}</div>
                          <div className="text-muted x-small d-flex align-items-center gap-1">
                            <FaEnvelope size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-dark bg-opacity-10 text-dark px-3 py-2 fw-bold" style={{ fontSize: '10px' }}>
                        <FaUserShield className="me-1" /> {user.role || 'Staff'}
                      </span>
                    </td>
                    <td>
                      <div className="text-secondary small d-flex align-items-center gap-1">
                        <FaCalendarAlt size={12} /> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '10px' }}>
                        ● Active
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light rounded-3 px-3 fw-bold border text-muted">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 800; }
        .x-small { font-size: 0.75rem; }
        .avatar-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .border-bottom-faint { border-bottom: 1px solid rgba(0,0,0,0.03); }
        .bg-success-subtle { background-color: #e8f5e9; color: #2e7d32 !important; }
        
        /* Skeleton Animation */
        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .table-hover tbody tr:hover { background-color: #fcfdfe; }
      `}</style>
    </div>
  );
}