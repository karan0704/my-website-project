// ============================================================================
// APP COMPONENT - Main application entry point
// ============================================================================
// This is the root component that manages the entire application state

import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import './App.css';

// APP COMPONENT DEFINITION
// ========================
// This component manages the global application state and routing
function App() {
    console.log("🎯 App component initialized");

    // GLOBAL APPLICATION STATE
    // ========================
    // user: stores logged-in user data (null = not logged in, object = logged in)
    const [user, setUser] = useState(null);

    // LOGIN HANDLER
    // =============
    // Called when user successfully logs in
    const handleLogin = (userData) => {
        console.log(`✅ App: User logged in successfully - ${userData.username}`);
        setUser(userData);  // Store user data in state
    };

    // LOGOUT HANDLER
    // ==============
    // Called when user wants to log out
    const handleLogout = () => {
        console.log("🚪 App: User logging out");
        setUser(null);  // Clear user data from state
    };

    // CONDITIONAL RENDERING
    // =====================
    // Show different components based on authentication state

    console.log(`🎯 App rendering - User logged in: ${!!user}`);

    return (
        <div className="app">
            {/* AUTHENTICATION CHECK */}
            {/* If user exists, show Dashboard; otherwise show AuthPage */}
            {user ? (
                // USER IS LOGGED IN - Show Dashboard
                <Dashboard
                    user={user}                             // Pass user data
                    onLogout={handleLogout}                 // Pass logout handler
                />
            ) : (
                // USER IS NOT LOGGED IN - Show Authentication
                <AuthPage
                    onLogin={handleLogin}                   // Pass login handler
                />
            )}
        </div>
    );
}

// Export App component for use in index.js
export default App;
