import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./FriendsForm.css";

const FriendsForm = () => {
    const [steamFriends, setSteamFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [steamFriendId, setSteamFriendId] = useState('');
    const { id } = useParams();

    useEffect(() => {
        // Fetch the steam friend list with their online statuses
        const fetchSteamFriends = async () => {
            try {
                const response = await axios.get('http://localhost:3001/steam/friends', { withCredentials: true });
                setSteamFriends(response.data.response.players);
                setLoading(false);
            } catch (error) {
                console.log('Error fethcing steam friends list');
                setLoading(false);
            }
        };

        fetchSteamFriends();
    }, []);

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

    // Handle create new friend
    const handleSubmit = (event) => {
        event.preventDefault();

        // Get friend data
        const data = { name, steamFriendId };
        axios.post(`http://localhost:3001/friend/${id}`, data, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    console.log("New friend created successfully.");
                    location.reload();
                } else {
                    console.error("Failed to save friend data.");
                }
            })
            .catch(error => console.error("Error saving friend data:", error));
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className='friendsForm rounded px-5 py-2'>
            <h1>Friends Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="steamName" className="form-label">Steam Name</label>
                    <select className="form-control" id="steamName" onChange={(e) => setSteamFriendId(e.target.value)}>
                        {/* Show list of all friends name and online status */}
                        {steamFriends.map((steamFriend) => (
                            <option key={steamFriend.steamid} value={steamFriend.steamid}>
                                {steamFriend.personaname} - {getStatusString(steamFriend.personastate)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn keyBtn">Add a friend</button>
                </div>
            </form>
        </div>
    );
};

export default FriendsForm;