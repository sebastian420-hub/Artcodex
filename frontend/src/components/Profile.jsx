import React, { use, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePosts } from '../context/PostContext'; 
import { useAuth } from '../context/AuthContext'; 
import Post from './Post'; 
export default function Profile() {
    const { navProfileState, userPosts, userName, fetchUserPosts, setIsLoading, isLoading } = usePosts();
    const { token, user } = useAuth();

    const [urlImage, setUrlImage] = useState([]);
    const apiUrl = 'http://localhost:8000/api/';

    useEffect(() => {
        userPosts.map((post) => {
            const image = post.image;
            const urlImage = apiUrl.replace('/api/', '') + image;
            setUrlImage(urlImage);
            console.log(urlImage);
    }, [ navProfileState]);
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>My Profile</h1>
            <div className="posts-container">
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post.id} className="post-item">
                             <Post
                                post={post}
                                onLikeUpdate={(id, count) => console.log(`Post ${id} likes: ${count}`)}
                            />
                        </div>
                    ))
                ) : (
                    <div>No posts available</div>
                )}
            </div>
        </div>
    );
}