import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function useCommentManager(postId) {
  const [comments, setComments] = useState([]);
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    fetchComments();
  }, [postId, token]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}posts/${postId}/comments/`,
        { headers }
      );
      setComments(response.data);
      console.log('Comments:', response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const submitComment = async (commentText) => {
    try {
      const response = await axios.post(
        `${apiUrl}comments/`,
        { post: postId, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return { comments, submitComment, fetchComments };
}