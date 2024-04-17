import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import "./dashboard.css"

const Dashboard = () => {
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
