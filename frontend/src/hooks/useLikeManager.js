import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function useLikeManager() {
  const { token } = useAuth();
  const [likes, setLikes] = useState({});
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

  const likePost = useCallback(async (postId) => {
    try {
      const response = await axios.post(
        `${apiUrl}posts/${postId}/like/`,
        { headers },
      );
      setLikes(prev => ({
        ...prev,
        [postId]: response.data.likes_count,
      }));
      return response.data.likes_count;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }, [token]);

  return { likePost, likes };
}