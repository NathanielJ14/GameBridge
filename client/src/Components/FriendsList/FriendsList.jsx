import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the friends list with their online statuses
        const fetchFriends = async () => {
            try {
                const response = await axios.get('http://localhost:3001/steam/friends', { withCredentials: true });
                setFriends(response.data.response.players);
                setLoading(false);
            } catch (error) {
                setError('Error fetching friends list');
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Friends List</h1>
            <ul>
                {friends.map((friend) => (
                    <li key={friend.steamid}>
                        {friend.personaname} - {friend.personastate === 1 ? 'Online' : 'Offline'}
                    </li>
                ))}
            </ul>
            <button type="submit" className="btn keyBtn">Add a friend</button>
        </div>
    );
};

export default FriendsList;
