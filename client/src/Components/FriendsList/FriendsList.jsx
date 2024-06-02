import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FriendsList.css';

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
        <div className='friendList px-5 py-2'>
            <h1 className='text-center'>Friends List</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Status</th>
                        <th scope="col">Name</th>
                        <th scope="col">Active On</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Display friends list using friends name and online status */}
                    {friends.map(friend => (
                        <tr key={friend.steamid}>
                            <td>{friend.personastate === 1 ? 'Online' : 'Offline'}</td>
                            <td>{friend.name}</td>
                            <td>Steam</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FriendsList;



// Notes

// Fix steam personastate on frineds list to get it from the api instead of db