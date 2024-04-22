import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import "./dashboard.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
        } else {
            // Fetch user data from the server
            axios.get('http://localhost:3001/dashboard', { withCredentials: true })
                .then(res => {
                    setUserData(res.data); // Set user data received from the server
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching user data:', err);
                    navigate('/');
                });
        }
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='dashboard'>
            <Navbar />
            <div>
                <h2>Dashboard</h2>
                <p>Welcome to your dashboard!</p>
                <h3>hello {userData.userName}</h3>
                <h3>email: {userData.email}</h3>
            </div>
        </div>
    );
};

export default Dashboard;
