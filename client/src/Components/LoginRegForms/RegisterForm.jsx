import "./LoginReg.css";
import React, { useState } from "react";

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Send registration data to backend
        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
            .then(response => response.json())
            .then(data => {
                // Show success message, redirect
                console.log(data);
            })
            .catch(error => {
                setError('Registration failed. Please try again.');
                console.error('Error:', error);
            });
    };

    return (
        <div className="form">
            <div className="card bg-dark">
                <h2 className="text-center mt-2">Register</h2>
                <div className="card-body">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="username" required placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="email" required placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="confirmPassword" required placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
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
