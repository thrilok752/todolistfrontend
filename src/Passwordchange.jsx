import React, { useState } from 'react';

// Receives the accessToken and a function to switch back to the list view
function PasswordChange({ accessToken, onPasswordChangeSuccess }) {
    const [current_password, setCurrentPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [re_new_password, setReNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Djoser password change endpoint
    const PASSWORD_CHANGE_URL = "http://127.0.0.1:8000/auth/users/set_password/";

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setIsLoading(true);

        if (new_password !== re_new_password) {
            setError("New passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(PASSWORD_CHANGE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // CRITICAL: Must be authenticated
                    'Authorization': `Bearer ${accessToken}`, 
                },
                body: JSON.stringify({ 
                    current_password: current_password,
                    new_password: new_password,
                    re_new_password: re_new_password, // Required by Djoser
                }),
            });

            if (response.ok) {
                // Success: Returns 204 No Content (No JSON body expected)
                alert("Password changed successfully! You will need to log in again.");
                onPasswordChangeSuccess(); // Triggers logout in App.jsx

            } else {
                // Failure: Handle Djoser validation errors (e.g., bad current password)
                const errorData = await response.json();
                
                let errorMessage = "Password change failed. Please try again.";
                if (errorData.current_password) errorMessage = `Current password error: ${errorData.current_password[0]}`;
                else if (errorData.new_password) errorMessage = `New password error: ${errorData.new_password[0]}`;
                else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors[0];

                setError(errorMessage);
            }

        } catch (error) {
            console.error("Password change request failed:", error);
            setError("Network error. Could not connect to the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {/* Current Password Input (Verification) */}
                <div>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={current_password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

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
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition duration-150"
                >
                    {isLoading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                <button onClick={onPasswordChangeSuccess} className="text-indigo-600 hover:underline">
                    Cancel and Back to List
                </button>
            </p>
        </div>
    );
}

export default PasswordChange;