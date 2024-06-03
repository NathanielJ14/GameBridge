import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
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
                setSteamId(steamId || "");
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
        <div>
            <h2 className="text-center mt-4 mb-3 neonHeader">Your Accounts</h2>
            <div className="row mx-0">
                <form className="text-center col-md-6" onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center">
                        <div className="border border-secondary rounded p-4 m-4">
                            <div className="mb-4">
                                <h2 className="mb-4 accountHeaders">Connect your steam account</h2>
                                <label htmlFor="steamKey" className="form-label keyLabel">Steam Key</label>
                                <input type="text" className="form-control" id="steamKey" placeholder="Your Steam API Key" value={steamKey} onChange={(e) => setSteamKey(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="steamId" className="form-label keyLabel">Steam Id</label>
                                <input type="text" className="form-control" id="steamId" placeholder="Your Steam Id" value={steamId} onChange={(e) => setSteamId(e.target.value)} />
                            </div>
                            <div className="text-center mt-3">
                                <button type="submit" className="btn btn-lg keyBtn px-5">Save Steam Keys</button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="col-md-6">
                    <div className="d-flex justify-content-center">
                        <div className="border border-secondary rounded p-4 m-4">
                            <div className="mb-4">
                                <h2 className="mb-4 accountHeaders">Connect your discord account</h2>
                                <div className="text-center mt-3">
                                    <Link to={'https://discord.com/oauth2/authorize?client_id=1241751545951948800&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Faccount%2F%3Aid&scope=identify+connections+relationships.read+presences.read'} className="btn btn-lg keyBtn px-5">
                                        Discord
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountForm;
