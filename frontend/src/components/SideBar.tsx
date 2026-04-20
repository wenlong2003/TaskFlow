import { Link } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function Sidebar({ isOpen, isAuthenticated, onClose, onLogout }: SidebarProps) {
  return (
    <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>

        <div className="sidebar-links">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/dashboard" onClick={onClose}>Dashboard</Link>
          <Link to="/calendar" onClick={onClose}>Calendar</Link>
        </div>

        <hr />
        <div className="sidebar-section">
          {!isAuthenticated ? (
            <div className="auth-links">
              <Link to="/signin" onClick={onClose}>Sign In</Link>
              <Link to="/signup" onClick={onClose}>Sign Up</Link>
            </div>
          ) : (
            <>
              <div className="user-settings">
                <h4>User Settings</h4>
                <button className="settings-btn">Account Settings</button>
              </div>

              <button
                className="logout-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;