// ============================================================================
// DASHBOARD COMPONENT - User's main application view
// ============================================================================
// This component shows the user's logged-in experience

import React from 'react';
import Button from '../components/UI/Button';

// DASHBOARD COMPONENT DEFINITION
// ===============================
// Props explanation:
// - user: Logged-in user data (from App.js)
// - onLogout: Function called when user wants to log out
const Dashboard = ({ user, onLogout }) => {
    console.log(`🎯 Dashboard component loaded for user: ${user.username}`);

    // LOGOUT HANDLER
    // ==============
    // Called when user clicks logout button
    const handleLogout = () => {
        console.log(`🚪 User ${user.username} logging out`);
        onLogout();  // Call parent function to clear user state
    };

    return (
        <div className="dashboard">
            <div className="dashboard-container">

                {/* WELCOME HEADER */}
                <div className="welcome-section">
                    <h1 className="welcome-title">🎉 Welcome, {user.username}!</h1>
                    <p className="welcome-message">✅ You are successfully logged in.</p>
                </div>

                {/* USER INFORMATION */}
                <div className="user-info">
                    <h3>👤 User Details:</h3>
                    <div className="user-details">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>

                {/* LOGOUT SECTION */}
                <div className="logout-section">
                    <Button
                        variant="danger"                       // Red button styling
                        onClick={handleLogout}                 // Logout handler
                    >
                        🚪 Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Export component
export default Dashboard;
