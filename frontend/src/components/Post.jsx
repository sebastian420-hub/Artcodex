import React, { useState, memo, useMemo } from 'react';
import axios from 'axios';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';
import ModelViewer from './ModelViewer';
import FollowButton from './FollowButton';
import { NavLink } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import Profile from './Profile';

export default function Post({ post, isExpanded, onLikeUpdate, onClose, isthisProfile }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [loadModel, setLoadModel] = useState(false);

  const { userName, setUserName, setNavProfileState  } = usePosts();

  const { token } = useAuth();
  const apiUrl = 'http://localhost:8000/api/';

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}posts/${post.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(response.data.likes_count);
      if (onLikeUpdate) onLikeUpdate(post.id, response.data.likes_count);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const toggleComments = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const handleLoadModel = () => {
    setLoadModel(!loadModel);
  };


  const fetchProfile = (username) => {
      setNavProfileState(true);
      setUserName(username);
  };



  const urlImage = useMemo(() => {
    if (post.image && post.image.startsWith('/media/')) {
      return apiUrl.replace('/api/', '') + post.image;
    }
    return '';
  }
  , [post.image]);

  const urlModel = useMemo(() => {
    if (post.model_3d_data && post.model_3d_data.file.startsWith('/media/')) {
      return apiUrl.replace('/api/', '') + post.model_3d_data.file;
    }
    return '';
  }
  , [post.model_3d_data]);

  return (
    <div className="post-card" style={{ width: '100%' }}>
      {isExpanded && (
        <button
          className="btn btn-primary btn-sm mb-3 me-2"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Close
        </button>
      )}
      <div className="card shadow-sm" style={{ borderRadius: '4px' }}>
        <div className="card-body">
          <h5 className="card-title">
            <NavLink to="/profile" onClick={(e) => {
              fetchProfile(post.user.username);
            }}>{post.user.username}</NavLink>

            <FollowButton userName={post.user.username} />
          </h5>
          <p className="card-text">{post.post}</p>
          { !urlImage  && post.image && (
            <a href={post.link}>
              <img
                src={post.image}
                alt="Post image"
                loading="lazy"
                className="img-fluid object-fit-cover"
              />
            </a>
          )}
          { urlImage && (
            <a href={post.link}>
              <img
                src={urlImage}
                alt="Post image"
                loading="lazy"
                className="img-fluid object-fit-cover"
              />
            </a>
          )}
          
          { !urlModel && post.model_3d_data && (
            <div>
              <button
                className="btn btn-primary btn-sm mb-2"
                onClick={handleLoadModel}
                style={{ borderRadius: '8px' }}
              >
                Load 3D Model
              </button>
              {loadModel && <ModelViewer modelUrl={post.model_3d_data.file} />}
            </div>
          )}
          { urlModel && (
            <div>
              <button
                className="btn btn-primary btn-sm mb-2"
                onClick={handleLoadModel}
                style={{ borderRadius: '8px' }}
              >
                Load 3D Model
              </button>
              {loadModel && <ModelViewer modelUrl={urlModel} />}
            </div>
          )}
          <small className="text-muted">
            Created: {new Date(post.timestamp).toLocaleString()}
          </small>
        </div>
        <div className="card-footer d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
          <button
            className="btn btn-outline-primary btn-sm me-2 like-btn"
            onClick={handleLike}
            style={{ borderRadius: '8px' }}
          >
            <span className="text-muted me-3">{likes}</span> {likes === 1 ? 'Like' : 'Likes'}
          </button>
          <button
            className="btn btn-primary btn-sm comment-toggle"
            onClick={toggleComments}
            style={{ borderRadius: '8px' }}
          >
            <span className="material-symbols-outlined">comment</span>
          </button>
        </div>
        {isCommentOpen && <CommentSection postId={post.id} />}
      </div>
    </div>
  );
}

