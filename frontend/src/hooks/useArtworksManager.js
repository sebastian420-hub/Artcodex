import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCallback } from 'react';

export function useArtworksManager(category) {
    const [artworks, setArtworks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const apiUrl = 'http://localhost:8000/api/';
    
    const fetchArtworks = useCallback(async (category) => {
        setIsLoading(true);
    
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
        const response = await axios.get(`${apiUrl}posts/?category=${category}`, { headers });
        const newArtworks = response.data.posts;
        console.log('Fetched artworks:', newArtworks);
        setArtworks(newArtworks);
        } catch (error) {
        console.error('Error fetching artworks:', error);
        } finally {
        setIsLoading(false);
        }
    });
    
    useEffect(() => {
        fetchArtworks(category); 
    }, []);

    
    return { artworks, fetchArtworks, isLoading };
}