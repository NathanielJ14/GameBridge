import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FriendsList.css';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [steamFriends, setSteamFriends] = useState([]);
    const { id } = useParams();

    // Helper function to get the status string from personastate code
    const getStatusString = (personastate) => {
        switch (personastate) {
            case 0:
                return 'Offline';
            case 1:
                return 'Online';
            case 2:
                return 'Busy';
            case 3:
                return 'Away';
            case 4:
                return 'Snooze';
            case 5:
                return 'Looking to trade';
            case 6:
                return 'Looking to play';
            default:
                return 'Unknown';
        }
    };

    // Function to fetch friends data from the database
    const fetchFriendsData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/friend/${id}`, { withCredentials: true });
            if (Array.isArray(response.data)) {
                setFriends(response.data);
            } else {
                console.error("Expected an array but got:", response.data);
            }
        } catch (error) {
            console.error("Error fetching friends data:", error);
        }
    };

    // Function to fetch Steam friends data
    const fetchSteamFriends = async () => {
        try {
            const response = await axios.get('http://localhost:3001/steam/friends', { withCredentials: true });
            setSteamFriends(response.data.response.players);
        } catch (error) {
            console.error("Error fetching Steam friends list:", error);
        }
    };

    // Merge the friends data with the Steam friends data
    const mergeFriendsData = () => {
        return friends.map(friend => {
            const steamFriend = steamFriends.find(sf => sf.steamid === friend.steamFriendId);
            return {
                ...friend,
                personastate: steamFriend ? steamFriend.personastate : null,
            };
        });
    };

    useEffect(() => {
        fetchFriendsData();
        fetchSteamFriends();
    }, [id]);

    const mergedFriends = mergeFriendsData();

    return (
        <div className='friendList px-5 py-2 rounded'>
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
                    {mergedFriends.map(friend => (
                        <tr key={friend.steamid}>
                            <td>{getStatusString(friend.personastate)}</td>
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