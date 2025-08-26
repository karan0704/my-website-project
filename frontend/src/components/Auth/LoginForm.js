// ============================================================================
// LOGIN FORM COMPONENT - Simple Login Form for Beginners
// ============================================================================
// 🎯 This component creates a login form where users can enter credentials
// It talks to the backend through our API service

import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Message from '../UI/Message';
import { validateUsername, validatePassword } from '../../utils/validation';
import { loginUser, APP_CONFIG } from '../../services/api';

// MAIN LOGIN FORM COMPONENT
// =========================
// Props (data passed from parent component):
// - onLogin: function to call when login is successful
// - loading: true/false if login request is happening
const LoginForm = ({ onLogin, loading }) => {
    console.log("🔐 LoginForm component started");

    // COMPONENT STATE (data this component remembers)
    // ===============================================
    // Think of state like the component's memory

    // Form input values
    const [username, setUsername] = useState('');     // What user typed in username field
    const [password, setPassword] = useState('');     // What user typed in password field

    // Error handling
    const [errors, setErrors] = useState({});         // Validation errors for each field
    const [error, setError] = useState('');           // General error message

    // FORM VALIDATION FUNCTION
    // ========================
    // Check if the form inputs are valid before sending to backend
    const validateForm = () => {
        console.log("🔍 Checking if form is valid...");

        // Object to collect any errors we find
        const newErrors = {};

        // Check username using our validation function
        const usernameError = validateUsername(username);
        if (usernameError) {
            newErrors.username = usernameError;
            console.log("❌ Username error:", usernameError);
        }

        // Check password using our validation function
        const passwordError = validatePassword(password);
        if (passwordError) {
            newErrors.password = passwordError;
            console.log("❌ Password error:", passwordError);
        }

        // Update the errors state
        setErrors(newErrors);

        // Return true if no errors, false if there are errors
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`✅ Form is ${isValid ? 'valid' : 'invalid'}`);
        return isValid;
    };

    // FORM SUBMISSION HANDLER
    // =======================
    // This function runs when user clicks the login button
    const handleSubmit = async (event) => {
        // Stop the form from refreshing the page (default browser behavior)
        event.preventDefault();
        console.log("📤 User clicked login button");

        // Clear any previous error messages
        setError('');

        // Check if form is valid before sending to backend
        if (!validateForm()) {
            console.log("❌ Form validation failed, not sending to backend");
            return; // Stop here if form is invalid
        }

        try {
            console.log(`🚀 Trying to login user: ${username}`);

            // Call our API service to login user
            // This sends HTTP request to backend
            const response = await loginUser(username, password);

            console.log("✅ Login successful!");

            // Tell the parent component (App.js) that login worked
            // Pass the user data we got back from backend
            onLogin(response.user);

        } catch (err) {
            // If login failed, show error message to user
            console.error("❌ Login failed:", err.message);
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    // RENDER THE COMPONENT (what user sees on screen)
    // ===============================================
    return (
        <div className="login-form">
            {/* FORM TITLE */}
            <h2 className="form-title">
                🔐 Login
            </h2>

            {/* ERROR MESSAGE (only shows if there's an error) */}
            <Message message={error} type="error" />

            {/* THE ACTUAL FORM */}
            <form onSubmit={handleSubmit} className="auth-form">

                {/* USERNAME INPUT FIELD */}
                <Input
                    id="login-username"
                    label="👤 Username"
                    type="text"
                    value={username}                        // Current value from state
                    onChange={(e) => {                      // Function that runs when user types
                        console.log(`👤 User typing username: ${e.target.value}`);
                        setUsername(e.target.value);          // Update state with what user typed
                    }}
                    placeholder="Enter your username"
                    disabled={loading}                      // Disable input when login is happening
                    error={errors.username}                 // Show error if username invalid
                />

                {/* PASSWORD INPUT FIELD */}
                <Input
                    id="login-password"
                    label="🔒 Password"
                    type="password"                         // Hides password with dots
                    value={password}
                    onChange={(e) => {
                        console.log(`🔒 User typing password (${e.target.value.length} characters)`);
                        setPassword(e.target.value);
                    }}
                    placeholder="Enter your password"
                    disabled={loading}
                    error={errors.password}
                />

                {/* LOGIN BUTTON */}
                <Button
                    type="submit"                           // Makes button submit the form
                    variant="primary"
                    fullWidth={true}                        // Button takes full width
                    loading={loading}                       // Shows loading spinner when true
                >
                    🔐 Login
                </Button>
            </form>

            {/* DEBUG INFO (only shows in development) */}
            {APP_CONFIG.IS_DEVELOPMENT && (
                <div className="debug-info">
                    <p>🔧 Debug: Using API {APP_CONFIG.API_BASE_URL}</p>
                </div>
            )}
        </div>
    );
};

// Export so other files can import and use this component
export default LoginForm;
