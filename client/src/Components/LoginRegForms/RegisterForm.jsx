import "./LoginReg.css";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/api/register', username, email, password, confirmPassword)
            .then(res => {
                if (res.data.Status === 'Success') {
                    navigate('/dashboard');
                } else {
                    alert('Error');
                }
            })
            .then(err => console.log(err));
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Check if passwords match
    //     if (password !== confirmPassword) {
    //         setError('Passwords do not match');
    //         return;
    //     }

    //     try {
    //         // Send registration data to backend
    //         const response = await fetch('http://localhost:3001/api/register', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ username, email, password }),
    //         });

    //         const data = await response.json();
    //         console.log(data); // Handle success response
    //         navigate('/dashboard');

    //     } catch (error) {
    //         setError('Registration failed. Please try again.');
    //         console.error('Error:', error);
    //     }
    // };


    return (
        <div className="form">
            <div className="card bg-dark">
                <h2 className="text-center mt-2">Register</h2>
                <div className="card-body">
                    {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="username" value={username} required placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" name="email" value={email} required placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" name="password" value={password} required placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} required placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
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
