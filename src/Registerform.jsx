import React, { useState } from 'react';

function Register({ onRegistrationSuccess, switchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [re_password, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const REGISTER_URL = "http://127.0.0.1:8000/auth/users/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password !== re_password) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email, // <--- 2. EMAIL ADDED TO PAYLOAD
                    password: password,
                    re_password: re_password,
                }),
            });

            if (response.status === 201) {
                // Success
                alert("Registration successful! Please log in.");
                onRegistrationSuccess(username, password);
            } else {
                // Failure: Read the error body for validation messages
                const errorData = await response.json();
                console.log('Registration status:', response.status);
                console.log('Registration response body:', errorData);

                
                let errorMessage = "Registration failed. Please check your details.";
                
                // --- 3. ERROR HANDLING LOGIC ---
                // Check if the error is on a specific field and display the message
                if (errorData.email) {
                    // This handles the unique constraint failure:
                    // Message will be: "user with this email already exists."
                    errorMessage = `Email error: ${errorData.email[0]}`; 
                } else if (errorData.username) {
                    errorMessage = `Username error: ${errorData.username[0]}`;
                } else if (errorData.password) {
                    errorMessage = `Password error: ${errorData.password[0]}`;
                } else if (errorData.non_field_errors) {
                    errorMessage = errorData.non_field_errors[0];
                }
                
                setError(errorMessage);
            }

        } catch (error) {
            console.error("Registration request failed:", error);
            setError("Network error. Could not connect to the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Register Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {/* Username Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Email Input (NEW FIELD) */}
                <div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
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
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
                
                {/* Confirm Password Input */}
                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={re_password}
                        onChange={(e) => setRePassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition duration-150"
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <button onClick={switchToLogin} className="text-indigo-600 hover:underline">
                    Login
                </button>
            </p>
        </div>
    );
}

export default Register;