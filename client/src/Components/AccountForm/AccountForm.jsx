import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./AccountForm.css";

const AccountForm = () => {
    const [steamKey, setSteamKey] = useState('');
    const [steamId, setSteamId] = useState('');
    const { id } = useParams();

    // Function to fetch user's account data
    const fetchAccountData = () => {
        axios.get(`http://localhost:3001/account/${id}`, { withCredentials: true })
            .then(response => {
                const { steamKey, steamId } = response.data;
                setSteamKey(steamKey || "");
                setDiscordKey(steamId || "");
            })
            .catch(error => console.error("Error fetching account data:", error));
    };
    
    useEffect(() => {
        fetchAccountData();
    }, [id]); // Fetch data when userId changes

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = { steamKey, steamId };
        axios.post(`http://localhost:3001/account/${id}`, data, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    console.log("Account data saved successfully.");
                } else {
                    console.error("Failed to save account data.");
                }
            })
            .catch(error => console.error("Error saving account data:", error));
    };

    return (
        <form className="accountForm text-center" onSubmit={handleSubmit}>
            <h2 className="text-center mt-4 mb-5 accountHeader">Connect your accounts</h2>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="steamKey" className="form-label keyLabel">Steam Key</label>
                    <input type="text" className="form-control" id="steamKey" placeholder="Your Steam API Key" value={steamKey} onChange={(e) => setSteamKey(e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="steamId" className="form-label keyLabel">Steam Id</label>
                    <input type="text" className="form-control" id="steamId" placeholder="Your Steam Id" value={steamId} onChange={(e) => setSteamId(e.target.value)} />
                </div>
            </div>
            <div className="text-center mt-3">
                <button type="submit" className="btn keyBtn">Save Keys</button>
            </div>
        </form>
    )
}

export default AccountForm;
