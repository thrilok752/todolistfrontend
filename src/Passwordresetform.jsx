import React, { useState } from 'react';
import { API } from './api';
// NOTE: This component assumes you are using React Router or similar
// to capture the UID and Token from the URL. Since we don't know your exact router 
// setup, we'll use placeholder variables for demonstration.

// In a real app using React Router, you would typically use `useParams()` to get uid and token.
// For now, we'll assume they are passed as props or defined here for testing.

function PasswordResetConfirm({ uid, token, switchToLogin }) {
    // Replace these placeholders with actual values captured from the URL 
    // when integrating with a router (e.g., const { uid, token } = useParams();)
    const [uidState] = useState(uid || 'placeholder-uid'); 
    const [tokenState] = useState(token || 'placeholder-token');

    const [new_password, setNewPassword] = useState('');
    const [re_new_password, setReNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Djoser reset password confirmation endpoint
    // const CONFIRM_URL = "http://127.0.0.1:8000/auth/users/reset_password_confirm/";
    const CONFIRM_URL = API.passwordresetform;
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (new_password !== re_new_password) {
            setError("New passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(CONFIRM_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    uid: uidState,               // Required for confirmation
                    token: tokenState,           // Required for confirmation
                    new_password: new_password,
                    re_new_password: re_new_password,
                }),
            });

            if (response.status === 204) {
                // Success: Password changed
                alert("Your password has been reset successfully. Please log in.");
                switchToLogin(); // Redirect to login page

            } else {
                // Failure: Handle Djoser validation errors (e.g., token expired, password mismatch)
                const errorData = await response.json();
                
                let errorMessage = "Password reset failed. The link may be expired or invalid.";
                if (errorData.uid) errorMessage = `UID error: ${errorData.uid[0]}`;
                else if (errorData.token) errorMessage = `Token error: ${errorData.token[0]}`;
                else if (errorData.new_password) errorMessage = `Password error: ${errorData.new_password[0]}`;
                
                setError(errorMessage);
            }

        } catch (error) {
            console.error("Password reset confirmation failed:", error);
            setError("Network error. Could not connect to the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Set New Password</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

                {/* New Password Input */}
                <div>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={new_password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
                
                {/* Confirm New Password Input */}
                <div>
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={re_new_password}
                        onChange={(e) => setReNewPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
                >
                    {isLoading ? 'Setting New Password...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}

export default PasswordResetConfirm;