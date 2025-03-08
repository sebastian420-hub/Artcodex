import React, { use } from 'react';
import Post from './Post';
import { usePostManager } from '../hooks/usePostManager';
import UploadForm from './UploadForm';
import { useEffect, useRef } from 'react';

export default function PostList() {
  const { posts, isLoading } = usePostManager();
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  const observerRef = useRef(null);

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

  const ToggleOpen = () => {
    setIsUploadOpen(!isUploadOpen);
  }
  
  if (isLoading && posts.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <button className='btn btn-primary mb-3' onClick={ToggleOpen}>Upload</button>
      {isUploadOpen && <UploadForm />}
      <div id="posts" className='posts-container'>
        {posts.map(post => (
        <div key={post.id} className="post-item row" data-visible="false">
          <Post 
          post={post} 
          shouldRenderModel={post.dataset?.visible === 'true'}
          onLikeUpdate={(id, count) => console.log(`Post ${id} likes: ${count}`)} />
        </div>
        ))}
      </div>
      {isLoading && <div>Loading more posts...</div>}
    </div>
  );
}

