import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./LoginReg.css";

const RegisterForm = () => {
    const [values, setValues] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/register', values)
            .then(res => {
                if (res.data.Status === 'Success') {
                    localStorage.setItem('token', res.data.token); // Store token in localStorage
                    navigate('/dashboard'); // Navigate to dashboard on success
                } else {
                    alert(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="form">
            <div className="card bg-dark">
                <h2 className="text-center mt-2">Register</h2>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="userName" required placeholder="Username" onChange={e => setValues({ ...values, userName: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" name="email" required placeholder="Email" onChange={e => setValues({ ...values, email: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" name="password" required placeholder="Password" onChange={e => setValues({ ...values, password: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" name="confirmPassword" required placeholder="Confirm Password" onChange={e => setValues({ ...values, confirmPassword: e.target.value })} />
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
