import React, { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import Login from './Loginform';
import Register from './Registerform';
import PasswordChange from './passwordchange';
import ForgotPasswordRequest from './Passwordforgot';
import PasswordResetConfirm from './Passwordresetform';

function App() {
    // 1. Initialize token state from localStorage
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('accessToken') || null
    );
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // State to toggle between 'login', 'register', 'list', and 'changePassword' views
    const [view, setView] = useState(accessToken ? 'list' : 'login'); 

    // Function to handle successful login, saving the token
    const handleLoginSuccess = (token) => {
        localStorage.setItem('accessToken', token); 
        setAccessToken(token);
        setView('list'); // Switch to the To-Do list view
        setRefreshTrigger(prev => prev + 1); 
    };

    const handleRegistrationSuccess = (username, password) => {
        alert("Account created. Please log in.");
        setView('login');
    };
    
    // Function to handle logout and password change success (forces re-login)
    const handleLogout = () => {
        localStorage.removeItem('accessToken'); 
        setAccessToken(null);
        setView('login'); // Switch back to the Login view
    };
    
    const handleTodoAction = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const checkResetUrl = () => {
    // Get the hash part of the URL (e.g., "#/path/to/something")
    const hash = window.location.hash;
    
    // Define the pattern to match: #/password/reset/confirm/UID/TOKEN
    // Note: The pattern uses the structure you defined in Django settings.
    const pattern = /^#\/password\/reset\/confirm\/([\w-]+)\/([\w-]+)/;
    
    const match = hash.match(pattern);
    
    if (match) {
        // match[1] is the UID, match[2] is the TOKEN
        return { uid: match[1], token: match[2] };
    }
    return null;
};

// Check URL hash on load
const resetParams = checkResetUrl();
    
    // If we have reset params, we should render the confirmation component immediately
    if (resetParams) {
        return (
            <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
                <PasswordResetConfirm 
                    uid={resetParams.uid} 
                    token={resetParams.token} 
                    switchToLogin={() => {
                        // Clear the hash after successful reset
                        window.location.hash = ''; 
                        setAccessToken(null);
                        setView('login');
                    }}
                />
            </div>
        );
    }

    // --- Conditional Rendering for Auth Views ---
    const renderAuthView = () => {
        if (view === 'register') {
            return <Register 
                       onRegistrationSuccess={handleRegistrationSuccess} 
                       switchToLogin={() => setView('login')}
                   />
        }
        
        if (view === 'resetRequest') { // <--- NEW VIEW STATE
            return <ForgotPasswordRequest 
                       switchToLogin={() => setView('login')}
                   />
        }
        
        // Default view is Login
        return (
            <Login 
                onLoginSuccess={handleLoginSuccess} 
                switchToRegister={() => setView('register')}
                switchToReset={() => setView('resetRequest')} // <--- NEW PROP
            />
        );
    }
    
    // --- Conditional Rendering for Main/Task Views ---

    if (view === 'changePassword') {
        return (
            <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
                <PasswordChange 
                    accessToken={accessToken} 
                    onPasswordChangeSuccess={handleLogout} // Triggers logout/re-login
                />
            </div>
        );
    }

    if (!accessToken) {
        return (
            <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
                {renderAuthView()}
            </div>
        );
    }

    // If a token EXISTS, show the main application
    return (
        <div className="min-h-screen w-screen bg-gray-100 p-8">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-700">Secure To-Do List</h1>
                    {/* Logout and Password Change Buttons */}
                    <div>
                        <button
                            onClick={() => setView('changePassword')} // <--- NEW BUTTON
                            className="bg-gray-400 text-white px-3 py-1 mr-2 rounded-md hover:bg-gray-500 transition duration-150 text-sm"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-150"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <TodoForm onTodoCreated={handleTodoAction} accessToken={accessToken} />
                <hr className="my-6 border-gray-200" />
                <TodoList refreshTrigger={refreshTrigger} accessToken={accessToken} />
            </div>
        </div>
    );
}

export default App;