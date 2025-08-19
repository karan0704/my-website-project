// ============================================================================
// AUTH PAGE COMPONENT - Main authentication container
// ============================================================================
// This component manages the authentication flow and API calls

import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import AuthToggle from '../components/Auth/AuthToggle';
import { loginUser, registerUser } from '../services/api';

// AUTH PAGE COMPONENT DEFINITION
// ===============================
// Props explanation:
// - onLogin: Function called when user successfully logs in (passed to App.js)
const AuthPage = ({ onLogin }) => {
    console.log("🔐 AuthPage component initialized");

    // COMPONENT STATE
    // ===============
    const [isRegister, setIsRegister] = useState(false);  // Current mode (login/register)
    const [loading, setLoading] = useState(false);        // API call in progress

    // LOGIN HANDLER
    // =============
    // Handles login API call and success/error states
    const handleLogin = async (username, password) => {
        console.log(`🔑 AuthPage handling login for: ${username}`);
        setLoading(true);  // Start loading state

        try {
            // Call API service function
            const response = await loginUser(username, password);
            console.log("✅ Login successful, passing user data to App");

            // Pass user data to parent component (App.js)
            onLogin(response.user);

        } catch (error) {
            console.error("❌ Login failed in AuthPage:", error.message);
            // Re-throw error so LoginForm can display it
            throw error;

        } finally {
            setLoading(false);  // End loading state
        }
    };

    // REGISTER HANDLER
    // ================
    // Handles registration API call and success/error states
    const handleRegister = async (username, email, password) => {
        console.log(`📝 AuthPage handling registration for: ${username}`);
        setLoading(true);

        try {
            // Call API service function
            await registerUser(username, email, password);
            console.log("✅ Registration successful");

            // Switch to login mode after successful registration
            setTimeout(() => {
                console.log("🔄 Switching to login mode after registration");
                setIsRegister(false);
            }, 2000);  // Wait 2 seconds to show success message

        } catch (error) {
            console.error("❌ Registration failed in AuthPage:", error.message);
            // Re-throw error so RegisterForm can display it
            throw error;

        } finally {
            setLoading(false);
        }
    };

    // MODE TOGGLE HANDLER
    // ===================
    // Switches between login and register modes
    const handleToggle = () => {
        console.log(`🔄 Toggling mode from ${isRegister ? 'Register' : 'Login'} to ${isRegister ? 'Login' : 'Register'}`);
        setIsRegister(!isRegister);
    };

    // COMPONENT RENDER
    // ================
    return (
        <div className="auth-page">
            <div className="auth-container">

                {/* CONDITIONAL FORM RENDERING */}
                {/* Show RegisterForm or LoginForm based on current mode */}
                {isRegister ? (
                    <RegisterForm
                        onRegister={handleRegister}           // Pass register handler
                        loading={loading}                     // Pass loading state
                    />
                ) : (
                    <LoginForm
                        onLogin={handleLogin}                 // Pass login handler
                        loading={loading}                     // Pass loading state
                    />
                )}

                {/* MODE TOGGLE */}
                {/* Button to switch between login and register */}
                <AuthToggle
                    isRegister={isRegister}                 // Current mode
                    onToggle={handleToggle}                 // Toggle handler
                    loading={loading}                       // Loading state
                />

                {/* TEST USERS INFO */}
                {/* Show available test users for easy testing */}
                <div className="test-users">
                    <h4>🧪 Test Users (Database):</h4>
                    <div className="test-user">
                        <strong>Username:</strong> demo_user<br/>
                        <strong>Password:</strong> demo123
                    </div>
                    <div className="test-user">
                        <strong>Username:</strong> Karan007<br/>
                        <strong>Password:</strong> 123456789
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export component
export default AuthPage;
