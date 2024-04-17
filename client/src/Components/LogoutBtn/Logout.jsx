import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    const handleDelete = () => {
        axios.get('http://localhost:3001/logout')
            .then(res => {
                navigate('/');
            }).catch(err => console.log(err));
    };

    return (
        <button className='w-100 p-1 m-2' onClick={handleDelete}>Logout</button>
    );
};

export default Logout;
