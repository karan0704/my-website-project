// ============================================================================
// LOGIN FORM COMPONENT - Handles user login functionality
// ============================================================================
// This component provides a form for existing users to log into their accounts

import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Message from '../UI/Message';
import { validateUsername, validatePassword } from '../../utils/validation';

// LOGIN FORM COMPONENT DEFINITION
// ================================
// Props explanation:
// - onLogin: Function called when login is successful (passed from parent)
// - loading: Whether API call is in progress (passed from parent)
const LoginForm = ({ onLogin, loading }) => {
    console.log("🔐 LoginForm component initialized");

    // COMPONENT STATE
    // ===============
    // useState hooks manage component's internal state
    const [username, setUsername] = useState('');     // Username input value
    const [password, setPassword] = useState('');     // Password input value
    const [errors, setErrors] = useState({});         // Field validation errors
    const [error, setError] = useState('');           // General error message

    // FORM VALIDATION FUNCTION
    // =========================
    // Validates form inputs before submission
    const validateForm = () => {
        console.log("🔍 Validating login form...");

        const newErrors = {};  // Object to collect validation errors

        // Validate username using utility function
        const usernameError = validateUsername(username);
        if (usernameError) newErrors.username = usernameError;

        // Validate password using utility function
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        // Update errors state
        setErrors(newErrors);

        // Return true if no errors, false if there are errors
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`✅ Form validation result: ${isValid ? 'Valid' : 'Invalid'}`);
        return isValid;
    };

    // FORM SUBMISSION HANDLER
    // =======================
    // Called when user submits the login form
    const handleSubmit = async (e) => {
        // Prevent default form submission (which would refresh the page)
        e.preventDefault();
        console.log("📤 Login form submitted");

        // Clear any previous error messages
        setError('');

        // Validate form before submission
        if (!validateForm()) {
            console.log("❌ Form validation failed");
            return;  // Stop submission if validation fails
        }

        try {
            console.log(`🚀 Attempting login for user: ${username}`);

            // Call parent's login function (which makes API call)
            await onLogin(username, password);

            console.log("✅ Login successful");

        } catch (err) {
            // Handle login errors
            console.error("❌ Login failed:", err.message);
            setError(err.message || 'Login failed');
        }
    };

    // COMPONENT RENDER
    // ================
    return (
        <div className="auth-form-container">
            {/* FORM ELEMENT */}
            {/* onSubmit handler prevents page refresh and calls our function */}
            <form onSubmit={handleSubmit} className="auth-form">

                {/* FORM TITLE */}
                <h2 className="form-title">🔐 Login</h2>

                {/* ERROR MESSAGE */}
                {/* Only displayed if there's a general error */}
                <Message message={error} type="error" />

                {/* USERNAME INPUT */}
                {/* This is a "controlled component" - React manages the value */}
                <Input
                    id="login-username"                      // Unique ID for accessibility
                    label="👤 Username"                      // Label text
                    type="text"                              // Input type
                    value={username}                         // Current value from state
                    onChange={(e) => {                       // Function called when user types
                        console.log(`👤 Username input: ${e.target.value}`);
                        setUsername(e.target.value);           // Update state with new value
                    }}
                    placeholder="Enter your username"        // Hint text
                    disabled={loading}                       // Disable during API calls
                    error={errors.username}                  // Show validation error if any
                />

                {/* PASSWORD INPUT */}
                <Input
                    id="login-password"
                    label="🔒 Password"
                    type="password"                          // Hide password characters
                    value={password}
                    onChange={(e) => {
                        console.log(`🔒 Password input (length: ${e.target.value.length})`);
                        setPassword(e.target.value);
                    }}
                    placeholder="Enter your password"
                    disabled={loading}
                    error={errors.password}
                />

                {/* SUBMIT BUTTON */}
                <Button
                    type="submit"                            // Makes button submit the form
                    variant="primary"                        // Primary button styling
                    fullWidth                                // Takes full width of container
                    loading={loading}                        // Shows loading state
                >
                    🔐 Login
                </Button>
            </form>
        </div>
    );
};

// Export component for use in other files
export default LoginForm;
