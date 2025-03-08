import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar.jsx';
import PostList from './components/PostLists.jsx'; 
import Login from './components/Login.jsx'; 
import Register from './components/Register.jsx';
import './App.css';
import ArtworksCreation from './components/ArtworksCreation.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/feed" element={<PostList />} />
            <Route path="/artworks" element={<ArtworksCreation />} />
            <Route path="/3d-editor" element={<div>3D Graphic Editor Page</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}


