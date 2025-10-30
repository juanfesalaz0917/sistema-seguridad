// src/components/Sidebar/Sidebar.bootstrap.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarBootstrap: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const cls = `sidebar-bootstrap ${sidebarOpen ? "open" : "closed"}`;

  return (
    <aside className={cls} aria-hidden={!sidebarOpen} role="navigation">
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{background:'transparent'}}>
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 80, height: 36, borderRadius: 8, background: '#091430ff' }} />
          <h4 className="m-0" style={{color:'#E6EEFA', fontWeight:700}}>TailAdmin</h4>
        </div>
        <button
          className="btn btn-sm btn-outline-light d-lg-none"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        >
          ✕
        </button>
      </div>

      <nav className="p-3">
        <h6 className="text-uppercase small mb-3" style={{color:'#9fb4d9'}}>Gestión</h6>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                "nav-link px-3 py-2 rounded d-flex align-items-center" +
                (isActive ? " active-bootstrap" : "")
              }
              style={{ color: '#cfe7ff' }}
            >
              {/* icon placeholder */}
              <span style={{width:20, marginRight:12, display:'inline-block', textAlign:'center'}}>👥</span>
              Users
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/roles"
              className={({ isActive }) =>
                "nav-link px-3 py-2 rounded d-flex align-items-center" +
                (isActive ? " active-bootstrap" : "")
              }
              style={{ color: '#cfe7ff' }}
            >
              <span style={{width:20, marginRight:12, display:'inline-block', textAlign:'center'}}>🔑</span>
              Roles
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/permissions"
              className={({ isActive }) =>
                "nav-link px-3 py-2 rounded d-flex align-items-center" +
                (isActive ? " active-bootstrap" : "")
              }
              style={{ color: '#cfe7ff' }}
            >
              <span style={{width:20, marginRight:12, display:'inline-block', textAlign:'center'}}>🛡️</span>
              Permissions
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{flex:1}} />

      <div className="p-3 border-top">
        <small style={{color:'#9fb4d9'}}>© {new Date().getFullYear()} TailAdmin</small>
      </div>
    </aside>
  );
};

export default SidebarBootstrap;
