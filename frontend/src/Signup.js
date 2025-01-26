import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = ({ onSignup, onLoginClick }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Signup Data:', { username, email, password });

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:3000/signup', { 
                username, 
                email, 
                password 
            });
            onSignup();
        } catch (err) {
            console.error('Full Signup Error:', err.response);
            setError('Registration failed. Username or email might already exist.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                />
                <button type="submit">Sign Up</button>
                <p className="login-link">
                    Already have an account? 
                    <button 
                        type="button" 
                        onClick={onLoginClick} 
                        className="login-button"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Signup;