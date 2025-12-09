import React, { useState } from 'react';

// Receives onRegistrationSuccess to pass the new user's credentials back to App.jsx
function Register({ onRegistrationSuccess, switchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [re_password, setRePassword] = useState(''); // CRITICAL: Password confirmation
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Djoser registration endpoint
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
                    password: password,
                    re_password: re_password, // Required by Django setting
                }),
            });

            if (response.ok) {
                // SUCCESS: Registration successful. The user is created.
                // We typically redirect or automatically log them in now.
                alert("Registration successful! You can now log in.");
                
                // Use the successful credentials to automatically log the user in
                onRegistrationSuccess(username, password); 

            } else {
                // FAILURE: Display error messages from Djoser/DRF
                const errorData = await response.json();
                
                // Handle complex validation errors from Django (e.g., username already exists)
                let errorMessage = "Registration failed. Please check your details.";
                if (errorData.username) errorMessage = `Username error: ${errorData.username[0]}`;
                else if (errorData.password) errorMessage = `Password error: ${errorData.password[0]}`;
                else if (errorData.re_password) errorMessage = `Password confirmation error: ${errorData.re_password[0]}`;
                
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
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Display */}
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

                <div>
                    <input
                        type="email"
                        placeholder="EmailAddress"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
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
                
                {/* Password Confirmation Input (CRITICAL) */}
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


                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition duration-150"
                >
                    {isLoading ? 'Creating...' : 'Register'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account? 
                <button onClick={switchToLogin} className="text-indigo-600 hover:underline ml-1">
                    Log In
                </button>
            </p>
        </div>
    );
}

export default Register;