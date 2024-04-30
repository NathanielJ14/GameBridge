import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AccountForm from '../../Components/AccountForm/AccountForm';

const AccountPage = () => {
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
            axios.get(`http://localhost:3001/account/${id}`, { withCredentials: true })
                .then(res => {
                    if (res.data.id === parseInt(id, 10)) {
                        setUserData(res.data);
                        setLoading(false);
                    } else {
                        navigate(`/account/${res.data.id}`);
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
        <div>
            <Navbar />
            <div>
                <AccountForm />
            </div>
        </div>
    );
};

export default AccountPage;
