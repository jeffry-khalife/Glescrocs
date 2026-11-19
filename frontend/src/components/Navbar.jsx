import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    GlesCrocs
                </Link>

                <div className="navbar-actions">
                    <Link to="/admin/login" className="navbar-signin-btn">
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
}
