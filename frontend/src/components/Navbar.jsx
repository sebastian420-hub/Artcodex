// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { userName, setUserName, setNavProfileState  } = usePosts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openNav = () => {
    console.log('openNav');
    document.getElementById("navbarNav").classList.toggle("show");
  }

  const navProfile = () => {
    console.log('navProfile', user);
    setNavProfileState(true);
    setUserName(user);
    
  }


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
          onClick={openNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mx-auto" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/feed">Feed</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/artworks">Codex</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/3d-editor">Editor</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/graphics">Matrix</NavLink>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item" id="logout">
                  <NavLink className="nav-link" id="logout-link" onClick={handleLogout}>Logout</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile" onClick={navProfile}>{user}</NavLink>
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

