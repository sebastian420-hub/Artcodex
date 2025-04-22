import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function usePostManager() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { token } = useAuth();
  const apiUrl = 'http://localhost:8000/api/';

  // const fetchPosts = useCallback(async (pageNum = 1) => {
  //   console.log(isComplete);
  //   console.log(isLoading);
  //   if (isComplete || isLoading) return;
  //   setIsLoading(true);

  //   const headers = token ? { Authorization: `Bearer ${token}` } : {};
  //   try {
  //     const response = await axios.get(`${apiUrl}posts/?page=${pageNum}`, { headers });
  //     const newPosts = response.data.posts;
  //     console.log('Fetched posts:', newPosts);
  //     setPosts(prevPosts => (pageNum === 1 ? newPosts : [...prevPosts, ...newPosts]));
  //     setIsComplete(!response.data.has_next);
  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [token, isComplete, isLoading, apiUrl]);

  // useEffect(() => {
  //   fetchPosts(1); // Initial fetch
  // }, [fetchPosts]);

  // useEffect(() => {
  //   let timeoutId;
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
  //       !isLoading &&
  //       !isComplete
  //     ) {
  //       clearTimeout(timeoutId);
  //       timeoutId = setTimeout(() => {
  //         setPage(prev => {
  //           const nextPage = prev + 1;
  //           fetchPosts(nextPage);
  //           return nextPage;
  //         });
  //       }, 300); 
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     clearTimeout(timeoutId);
  //   };
  // }, [isLoading, isComplete]);

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
    console.log('model_3d_png:', model_3d_png);
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
        // setPosts(prev => [response.data, ...prev]);
        // setPage(1);
        // setIsComplete(false);
        // fetchPosts(1);
    } catch (error) {
        console.error('Error uploading post:', error.response?.data || error);
    }
};

  const resetPosts = () => {
    setPosts([]);
    setPage(1);
    setIsComplete(false);
  };

  return { posts, isLoading, uploadPost, resetPosts };
}
