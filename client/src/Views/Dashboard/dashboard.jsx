import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import "./dashboard.css";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FriendsList from '../../Components/FriendsList/FriendsList';
import FriendsForm from '../../Components/FriendsForm/FriendsForm';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
        } else {
            // Fetch user data from the server
            axios.get(`http://localhost:3001/dashboard/${id}`, { withCredentials: true })
                .then(res => {
                    if (res.data.id === parseInt(id, 10)) {
                        setUserData(res.data);
                        setLoading(false);
                    } else {
                        navigate(`/dashboard/${res.data.id}`);
                    }
                })
                .catch(err => {
                    console.error('Error fetching user data:', err);
                    navigate('/');
                });
        }
    }, [id, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='dashboard'>
            <Navbar />
            <div>
                <h2 className='text-center mt-5 mb-5 pb-4 neonHeader'>{userData.userName}'s Dashboard</h2>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6 d-flex justify-content-center'>
                            <FriendsList />
                        </div>
                        <div className='col-md-6 d-flex justify-content-center'>
                            <FriendsForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
