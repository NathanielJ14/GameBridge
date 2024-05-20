import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Logout.css";

const Logout = () => {
    const navigate = useNavigate();

    const handleDelete = () => {
        axios.get('http://localhost:3001/logout', { withCredentials: true })
            .then(res => {
                localStorage.removeItem('token');
                navigate('/');
            }).catch(err => console.log(err));
    };

    return (
        <button className='logoutBtn' onClick={handleDelete}>Logout</button>
    );
};

export default Logout;
