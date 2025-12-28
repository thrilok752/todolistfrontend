import React, { useState } from 'react';
import { API_BASE_URL } from './api';
function ForgotPasswordRequest({ switchToLogin }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Djoser reset password request endpoint
    // const REQUEST_URL = "http://127.0.0.1:8000/auth/users/reset_password/";
    const REQUEST_URL = `${API_BASE_URL}/auth/users/reset_password/`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(REQUEST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Djoser expects the email field in the body
                body: JSON.stringify({ email: email }),
            });

            // NOTE: Djoser returns a 204 No Content status on success, 
            // but for security, it often returns 204 even if the email doesn't exist, 
            // to avoid revealing which emails are registered.
            if (response.status === 204) {
                setMessage("If your account exists, you will receive a password reset link shortly.");
            } else {
                // Handle potential API errors (though 204 is common for security)
                const errorData = await response.json();
                setError(errorData.email ? errorData.email[0] : "An error occurred.");
            }

        } catch (error) {
            console.error("Password reset request failed:", error);
            setError("Network error. Could not connect to the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Reset Password</h2>
            <p className="text-center text-sm mb-4 text-gray-600">Enter your email to receive a password reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">

                {message && <div className="p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

                <div>
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
                >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                <button onClick={switchToLogin} className="text-indigo-600 hover:underline">
                    Back to Login
                </button>
            </p>
        </div>
    );
}

export default ForgotPasswordRequest;