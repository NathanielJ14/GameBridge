import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            // Send a request to the server to clear the session
            const response = await fetch('http://localhost:3001/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                // Clear session on the client side
                sessionStorage.clear();
                // Redirect user to the root URL
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleSubmit}>Logout</button>
    );
};

export default Logout;
