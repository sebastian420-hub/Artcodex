import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


export default function FollowButton({ userName }) {
    const { token, user, isAuthenticated, followStatus } = useAuth();
    const apiUrl = 'http://localhost:8000/api/';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const storedData = JSON.parse(localStorage.getItem(`is${user}Following${userName}`));
    const [isFollowing, setIsFollowing] = useState(storedData ? storedData.isFollowing : false);

    useEffect(() => {
        if (!isAuthenticated || !followStatus.length) return;

        const isUserFollowed = followStatus.some(follow => follow.username === userName);
        if (!storedData) {
            localStorage.setItem(
                `is${user}Following${userName}`,
                JSON.stringify({ isFollowing: isUserFollowed, username: userName })
            );
        }
        
    }, [followStatus, userName, user, isAuthenticated, storedData]);

    const onFollow = async () => {
        try {
            const response = await axios.post(`${apiUrl}follow/${userName}/`, {}, { headers });
            const data = {
                isFollowing: response.data.isFollowing,
                username: userName,
            };
            localStorage.setItem(`is${user}Following${userName}`, JSON.stringify(data));
            console.log('isFollowing:', response.data.isFollowing);
            if (response.data.isFollowing === true){
                setIsFollowing(true);
                console.log('Followed user:', isFollowing);

            }else {
                setIsFollowing(false);
                console.log('Followed user:', isFollowing);
            }
            
            
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    console.log('isFollowing_out:', isFollowing);
    

    return (
        <button
            className={`btn btn-${isFollowing ? 'danger' : 'primary'} btn-sm mx-2 ${userName}`}
            onClick={onFollow}
        >
            {isFollowing ? 'Following' : 'Follow'} 
        </button>
    );
}