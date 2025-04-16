
import React, { createContext, useContext, useState, useCallback, useEffect, use } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userName, setUserName] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [navProfileState, setNavProfileState] = useState(false);
  const { token } = useAuth();
  const apiUrl = 'http://localhost:8000/api/';

  console.log(userName);
  console.log(navProfileState)

  useEffect(() => {
    if (userName) {
      fetchUserPosts(userName);
    }
  }, [userName,navProfileState]);

  const fetchPosts = useCallback(
    async (pageNum = 1, forceFetch = false) => {
      if (isComplete || isLoading || (!forceFetch && posts.length > 0 && pageNum === 1)) return;
      setIsLoading(true);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await axios.get(`${apiUrl}posts/?page=${pageNum}`, { headers });
        const newPosts = response.data.posts;
        console.log('Fetched posts:', newPosts);
        setPosts((prevPosts) =>
          pageNum === 1 ? newPosts : [...prevPosts, ...newPosts]
        );
        setIsComplete(!response.data.has_next);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, isComplete, isLoading, posts.length, apiUrl]
  );

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(1);
    }
  }, [fetchPosts, posts.length]);

  const uploadPost = async (text, category, link, image, model_3d, model_3d_bin, model_3d_png) => {
    if (!token) {
      console.error('No token available for posting');
      return;
    }

    const formData = new FormData();
    formData.append('post', text);
    if (category) formData.append('category', category);
    if (link) formData.append('link', link);
    if (image) formData.append('image', image);
    if (model_3d) formData.append('model_3d', model_3d);
    if (model_3d_bin) formData.append('model_3d_bin', model_3d_bin);
    if (model_3d_png) {
      if (Array.isArray(model_3d_png)) {
        model_3d_png.forEach((png, index) => {
          formData.append(`textures[${index}]`, png);
        });
      } else {
        formData.append('textures[0]', model_3d_png);
      }
    }

    try {
      const response = await axios.post(`${apiUrl}posts/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded post:', response.data);
      setPosts((prev) => [response.data, ...prev]);
      setPage(1);
      setIsComplete(false);
      fetchPosts(1, true); // Force refresh after upload
    } catch (error) {
      console.error('Error uploading post:', error.response?.data || error);
    }
  };

  const resetPosts = () => {
    setPosts([]);
    setPage(1);
    setIsComplete(false);
    fetchPosts(1, true);
  };

  const fetchUserPosts = useCallback(async (user) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}profile/${user}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPosts(response.data); 
      setIsComplete(true); 
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setIsLoading(false);
    }
    }, [token, apiUrl]);

 
  console.log('Rendering PostContext:', userPosts);

  function addPost(post) {
    alert('addPost not implemented');
  } 


  
  const value = {
    posts,
    setPosts,
    userPosts,
    userName,
    setUserName,
    navProfileState,
    setNavProfileState,
    addPost,
    page,
    setPage,
    isLoading,
    setIsLoading,
    fetchUserPosts,
    isComplete,
    fetchPosts, 
    uploadPost,
    resetPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePosts() {
  return useContext(PostContext);
}