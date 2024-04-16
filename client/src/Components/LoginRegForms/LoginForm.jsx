import "./LoginReg.css"
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Login failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Redirect to dashboard after successful login
            navigate('/dashboard');

        } catch (error) {
            setError('Login failed. Please try again.')
            console.error('Login error:', error);
        }
    };

    return (
        <div className="form">
            <div className="card bg-dark">
                <h2 className="text-center mt-2">Login</h2>
                <div className="card-body">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="email" className="form-control" name="email" value={email} required placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" name="password" value={password} required placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn mt-2">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
