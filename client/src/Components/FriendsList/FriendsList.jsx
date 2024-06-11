import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FriendsList.css';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [steamFriends, setSteamFriends] = useState([]);
    const { id } = useParams();

    // Function to get the status string from personastate code
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

    // Function to get the dot class name from personastate code
    const getDotClassName = (personastate) => {
        switch (personastate) {
            case 0:
                return 'dotOffline';
            case 1:
                return 'dotOnline';
            case 2:
                return 'dotBusy';
            case 3:
                return 'dotAway';
            case 4:
                return 'dotSnooze';
            case 5:
                return 'dotTrade';
            case 6:
                return 'dotPlay';
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

    // Merge the friends data with the Steam friends data and sort
    const mergeFriendsData = () => {
        const merged = friends.map(friend => {
            const steamFriend = steamFriends.find(sf => sf.steamid === friend.steamFriendId);
            return {
                ...friend,
                personastate: steamFriend ? steamFriend.personastate : null,
            };
        });
        return sortFriends(merged);
    };

    // Sort friends: online first, offline last
    const sortFriends = (friends) => {
        return friends.sort((a, b) => {
            const order = [1, 6, 5, 2, 3, 4, 0]; // Online, Looking to play, Looking to trade, Busy, Away, Snooze, Offline
            return order.indexOf(a.personastate) - order.indexOf(b.personastate);
        });
    };

    useEffect(() => {
        fetchFriendsData();
        fetchSteamFriends();
    }, [id]);

    const mergedFriends = mergeFriendsData();

    return (
        <div className='friendList px-5 py-2'>
            <h1 className='text-center header'>Friends List</h1>


            <div className='friendCol'> 
                <div className='friendRow'>
                    <div className='friendAvatar'>
                        
                    </div>
                    <div className='friendInfo'>

                    </div>
                </div>
            </div>

            <table className="table">
                
                <tbody>
                    {/* Display friends list using friends name and online status */}
                    {mergedFriends.map(friend => (
                        <tr key={friend.steamid}>
                            <td>
                                <div className={`rounded-circle ${getDotClassName(friend.personastate)}`}></div>
                            </td>
                            <td>{friend.name}</td>
                            <td>{getStatusString(friend.personastate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FriendsList;
