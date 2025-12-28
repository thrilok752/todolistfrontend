import React, { useState } from 'react';
import { API_BASE_URL } from './api';

// This component receives a function (onLoginSuccess) from App.jsx 
// to pass the acquired token back up.
function Login({ onLoginSuccess, switchToRegister, switchToReset }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- Configuration ---
    // This is the SimpleJWT/Djoser token creation endpoint
    // const LOGIN_URL = "http://127.0.0.1:8000/auth/jwt/create/";
    const LOGIN_URL = `${API_BASE_URL}/auth/jwt/create/`;

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Body must contain the credentials required by SimpleJWT
                body: JSON.stringify({ 
                    username: username,
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Token received
                console.log("Login Successful! Tokens received:", data);
                
                // CRITICAL: Pass the ACCESS token to the parent component (App.jsx)
                // localStorage.setItem('accessToken', data.access); // We'll add this later for persistence
                onLoginSuccess(data.access);
            } else {
                // FAILURE: Display error message from Django/DRF
                const errorMessage = data.detail || "Invalid credentials or server error.";
                setError(errorMessage);
            }

        } catch (error) {
            console.error("Login request failed:", error);
            setError("Network error. Could not connect to the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">User Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Display */}
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {/* Username/Email Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Password Input */}
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-right text-xs mt-1">
                         <button onClick={switchToReset} type='button' className="text-indigo-600 hover:underline">
                            Forgot Password?
                        </button>
                    </p>
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition duration-150"
                >
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account? 
                <button onClick={switchToRegister} className="text-indigo-600 hover:underline ml-1">
                    Register Now
                </button>
            </p>
            
        </div>
    );
}

export default Login;