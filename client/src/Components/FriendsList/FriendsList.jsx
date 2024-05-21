import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const { id } = useParams();

     // Function to fetch friends data
    const fetchFriendsData = () => {
        axios.get(`http://localhost:3001/friend/${id}`, { withCredentials: true })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setFriends(response.data);
                } else {
                    console.error("Expected an array but got:", response.data);
                }
            })
            .catch(error => console.error("Error fetching friends data:", error));
    };

    useEffect(() => {
        fetchFriendsData();
    }, [id]);

    return (
        <div>
            <h1 className='text-center'>Friends List</h1>
            <ul>
                {friends.map(friend => (
                    <li key={friend.steamFriendId}>{friend.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default FriendsList;
