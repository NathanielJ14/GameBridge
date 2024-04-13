import "./LoginReg.css";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Send registration data to backend
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            console.log(data); // Handle success response
            navigate('/dashboard');

        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Error:', error);
        }
    };


    return (
        <div className="form">
            <div className="card bg-dark">
                <h2 className="text-center mt-2">Register</h2>
                <div className="card-body">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="username" value={username} required placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="email" value={email} required placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="password" value={password} required placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} required placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn mt-2">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
