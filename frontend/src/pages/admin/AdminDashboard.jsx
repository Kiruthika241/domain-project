import React from "react";
import { 
  FaCouch, FaShoppingBag, FaUsers, FaDollarSign, 
  FaArrowUp, FaArrowDown, FaEllipsisV, FaBell,
  FaSearch, FaTools
} from "react-icons/fa";

export default function AdminDashboard() {
  const stats = [
    { label: "Revenue", value: 12850, icon: <FaDollarSign />, color: "#4f46e5", trend: "+12.5%", isCash: true },
    { label: "Orders", value: 18, icon: <FaShoppingBag />, color: "#10b981", trend: "+4.2%", isCash: false },
    { label: "Customers", value: 23, icon: <FaUsers />, color: "#f59e0b", trend: "-1.1%", isCash: false },
    { label: "Products", value: 42, icon: <FaCouch />, color: "#ec4899", trend: "+2.0%", isCash: false },
  ];

  return (
    <div className="bg-light min-vh-100 p-4 p-lg-5">
      <div className="container-fluid">
        {/* Top Header Bar */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">Performance Hub</h2>
            <p className="text-muted small mb-0">Track your business growth and inventory health.</p>
          </div>
          
          <div className="d-flex gap-3 align-items-center">
            {/* Search Bar */}
            <div className="input-group border-0 shadow-sm rounded-pill overflow-hidden bg-white px-3 align-items-center" style={{ width: '280px', height: '45px' }}>
               <FaSearch className="text-muted me-2"/>
               <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Search data..."/>
            </div>
            {/* Notification Bell */}
            <button className="btn btn-white shadow-sm rounded-circle border p-0 d-flex align-items-center justify-content-center position-relative" style={{ width: '45px', height: '45px' }}>
              <FaBell className="text-secondary"/>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid - Now stretches full width */}
        <div className="row g-4 mb-5">
          {stats.map((s, i) => (
            <div className="col-md-6 col-xl-3" key={i}>
              <div className="card border-0 shadow-sm rounded-4 h-100 transition-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="rounded-3 p-2 text-white shadow-sm" style={{ backgroundColor: s.color, width: '42px', height: '42px', display: 'grid', placeItems: 'center' }}>
                      {s.icon}
                    </div>
                    <span className={`small fw-bold px-2 py-1 rounded-pill ${s.trend.startsWith('+') ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '11px' }}>
                      {s.trend}
                    </span>
                  </div>
                  <div>
                    <h6 className="text-muted fw-semibold small mb-1">{s.label}</h6>
                    <h3 className="fw-bold text-dark mb-0">
                      {s.isCash ? `$${s.value.toLocaleString()}` : s.value}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="row g-4">
          {/* Recent Activity Table */}
          <div className="col-xl-8">
            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
              <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Activity</h5>
                <button className="btn btn-link btn-sm text-decoration-none fw-bold">View Reports</button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light border-0 text-uppercase">
                      <tr>
                        <th className="ps-4 py-3 border-0 text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Transaction</th>
                        <th className="py-3 border-0 text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Status</th>
                        <th className="py-3 border-0 text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Amount</th>
                        <th className="pe-4 py-3 border-0 text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((_, idx) => (
                        <tr key={idx} className="cursor-pointer border-top">
                          <td className="ps-4 py-4">
                            <div className="fw-bold text-dark mb-0 small">Order #ORD-99{idx}</div>
                            <div className="text-muted x-small">2 mins ago • Card Payment</div>
                          </td>
                          <td>
                            <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2" style={{ fontSize: '10px' }}>Success</span>
                          </td>
                          <td className="fw-bold text-dark small">$429.00</td>
                          <td className="pe-4 text-end">
                             <button className="btn btn-light rounded-3 text-muted border-0 p-2"><FaEllipsisV size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Sidebar (Now inside the main grid) */}
          <div className="col-xl-4">
             <div className="card border-0 shadow-sm rounded-4 bg-dark text-white overflow-hidden h-100">
               <div className="card-body p-4 d-flex flex-column h-100">
                  <div className="mb-auto">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">Inventory Health</h5>
                      <FaTools className="text-secondary opacity-50"/>
                    </div>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="x-small text-white-50">Storage Capacity</span>
                        <span className="x-small fw-bold">78%</span>
                      </div>
                      <div className="progress bg-secondary bg-opacity-25 rounded-pill" style={{ height: '8px' }}>
                        <div className="progress-bar bg-primary shadow" role="progressbar" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10">
                      <p className="mb-0 x-small fw-bold text-primary text-uppercase mb-1" style={{ letterSpacing: '1px' }}>Action Required</p>
                      <p className="mb-0 small fw-medium">4 items are reaching critical low stock levels. Review now to avoid stockouts.</p>
                    </div>
                  </div>
                  <button className="btn btn-primary w-100 mt-5 py-3 rounded-3 fw-bold shadow-lg border-0 transition-btn">
                    Review Inventory
                  </button>
               </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .x-small { font-size: 0.725rem; }
        .transition-card { transition: all 0.3s cubic-bezier(.25,.8,.25,1); }
        .transition-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; }
        .bg-success-subtle { background-color: #d1e7dd; color: #0f5132 !important; }
        .bg-danger-subtle { background-color: #f8d7da; color: #842029 !important; }
        .btn-white { background-color: white; color: #6c757d; }
        .transition-btn:hover { background-color: #3730a3 !important; transform: scale(1.02); }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}