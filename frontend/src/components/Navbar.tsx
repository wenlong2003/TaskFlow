// Navbar.tsx
import React from "react";
import "./Navbar.css";
import Toggle from "./toggle";
import { Link } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  isDark: boolean;
  toggleDark: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout?: () => void;
  onOpenSidebar: () => void;
}

function Navbar({ isAuthenticated, onLogout, isDark, toggleDark, onOpenSidebar }: NavbarProps) {
  return (
    <nav>
      <button className="sidebar-btn" onClick={onOpenSidebar}> ☰ </button>
      <ul className="nav-links">
        <li className="link"><Link to="/">Home</Link></li>
        <li className="link"><Link to="/dashboard">Dashboard</Link></li>
        <li className="link"><Link to="/calendar">Calendar</Link></li>

        {!isAuthenticated ? (
          <>
            <li className="link"><Link to="signup" className="signup-btn">Sign Up</Link></li>
            <li className="link"><Link to="signin" className="login-btn">Log In</Link></li>
          </>
        ) : null}
      </ul>
      <div className="toggle-wrapper">
        <Toggle handleChange={toggleDark} isChecked={isDark} />
      </div>
    </nav>
  );
}

export default Navbar;