// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid mx-auto">
        <NavLink className="navbar-brand ml-6" to="/">Artcodex</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mx-auto" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/feed">Feed</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/artworks">Artworks</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/3d-editor">3D Graphic Editor</NavLink>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">{user}</NavLink>
                </li>
              </>
            ) : (
              <><li className="nav-item">
                    <NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/register">Register</NavLink>
                </li></>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

