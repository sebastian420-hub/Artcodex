import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostProvider } from './context/PostContext'; 
import Navbar from './components/Navbar.jsx';
import PostList from './components/PostLists.jsx'; 
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx'; 
import ArtworksCreation from './components/ArtworksCreation.jsx';
import { usePosts } from './context/PostContext';
import GraphicEditor from './components/GraphicEditor.jsx';
import Matrix from './components/Matrix.jsx';

import './App.css';

export default function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const  userName  = usePosts();
  const username = userName ? userName : user;
  return (
    <AuthProvider>
      <PostProvider>
        <BrowserRouter>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/feed" element={<PostList />} />
              <Route path="/artworks" element={<ArtworksCreation />} />
              <Route path="/3D-editor" element={
                  <GraphicEditor />
              } />
              <Route path="/graphics" element={<Matrix />} />
              <Route path="/login" element={<Login />} />
              <Route path={"/profile"} element={<Profile />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </BrowserRouter>
      </PostProvider>
    </AuthProvider>
  );
}
