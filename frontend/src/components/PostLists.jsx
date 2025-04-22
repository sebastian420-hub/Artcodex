// components/PostList.jsx
import React, { useEffect, useRef, useState } from 'react';
import Post from './Post';
import { usePosts } from '../context/PostContext';
import UploadForm from './UploadForm';

export default function PostList() {
  const { posts,page, isLoading, fetchPosts, resetPosts } = usePosts();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const observerRef = useRef(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !isLoading &&
        !posts.isComplete
      ) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchPosts(page + 1);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isLoading, posts.isComplete, fetchPosts, posts.page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = 'true';
          }
        });
      },
      { threshold: 0.1 }
    );
    observerRef.current = observer;

    const elements = document.querySelectorAll('.post-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [posts]);

  const handlePostClick = (postId) => {
    lastScrollPosition.current = window.scrollY;
    setActivePostId(postId);
  };

  const handleClose = () => {
    setActivePostId(null);
    setTimeout(() => {
      window.scrollTo(0, lastScrollPosition.current);
    }, 0);
  };



  if (isLoading && posts.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div id="posts" className="posts-container">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`post-item ${activePostId === post.id ? 'expanded' : ''}`}
            data-visible="false"
            data-post-id={post.id}
            onClick={() => handlePostClick(post.id)}
          >
            <Post
              post={post}
              isExpanded={activePostId === post.id}
              shouldRenderModel={false}
              onLikeUpdate={(id, count) => console.log(`Post ${id} likes: ${count}`)}
              onClose={handleClose}
            />
          </div>
        ))}
      </div>
      {isLoading && <div>Loading more posts...</div>}
      <button onClick={resetPosts}>Refresh Feed</button>
    </div>
  );
}