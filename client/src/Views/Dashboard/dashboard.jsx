import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import "./dashboard.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            setLoading(false);
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
            </div>
        </div>
    );
};

export default Dashboard;
