// ============================================================================
// REGISTER FORM COMPONENT - Handles new user registration
// ============================================================================
// This component provides a form for new users to create accounts

import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Message from '../UI/Message';
import { validateUsername, validateEmail, validatePassword } from '../../utils/validation';

// REGISTER FORM COMPONENT DEFINITION
// ===================================
// Props explanation:
// - onRegister: Function called when registration is successful
// - loading: Whether API call is in progress
const RegisterForm = ({ onRegister, loading }) => {
    console.log("📝 RegisterForm component initialized");

    // COMPONENT STATE
    // ===============
    // State for form inputs and validation
    const [username, setUsername] = useState('');     // Username input
    const [email, setEmail] = useState('');           // Email input
    const [password, setPassword] = useState('');     // Password input
    const [errors, setErrors] = useState({});         // Field-specific errors
    const [error, setError] = useState('');           // General error message
    const [success, setSuccess] = useState('');       // Success message

    // FORM VALIDATION FUNCTION
    // =========================
    // Validates all registration form fields
    const validateForm = () => {
        console.log("🔍 Validating registration form...");

        const newErrors = {};  // Collect validation errors

        // Validate each field using utility functions
        const usernameError = validateUsername(username);
        if (usernameError) newErrors.username = usernameError;

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        // Update errors state
        setErrors(newErrors);

        // Return validation result
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`✅ Registration form validation: ${isValid ? 'Valid' : 'Invalid'}`);
        return isValid;
    };

    // FORM SUBMISSION HANDLER
    // =======================
    // Called when user submits registration form
    const handleSubmit = async (e) => {
        // Prevent page refresh
        e.preventDefault();
        console.log("📤 Registration form submitted");

        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate form before submission
        if (!validateForm()) {
            console.log("❌ Registration form validation failed");
            return;
        }

        try {
            console.log(`🚀 Attempting registration for user: ${username}`);

            // Call parent's register function
            await onRegister(username, email, password);

            console.log("✅ Registration successful");

            // Show success message
            setSuccess('✅ Registration successful! You can now login.');

            // Clear form fields after successful registration
            setUsername('');
            setEmail('');
            setPassword('');

        } catch (err) {
            // Handle registration errors
            console.error("❌ Registration failed:", err.message);
            setError(err.message || 'Registration failed');
        }
    };

    // COMPONENT RENDER
    // ================
    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">

                {/* FORM TITLE */}
                <h2 className="form-title">📝 Create Account</h2>

                {/* SUCCESS/ERROR MESSAGES */}
                <Message message={success} type="success" />
                <Message message={error} type="error" />

                {/* USERNAME INPUT */}
                <Input
                    id="register-username"
                    label="👤 Username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                        console.log(`👤 Registration username: ${e.target.value}`);
                        setUsername(e.target.value);
                    }}
                    placeholder="Choose a username (min 3 characters)"
                    disabled={loading}
                    error={errors.username}
                />

                {/* EMAIL INPUT */}
                <Input
                    id="register-email"
                    label="📧 Email"
                    type="email"                             // Browser will validate email format
                    value={email}
                    onChange={(e) => {
                        console.log(`📧 Registration email: ${e.target.value}`);
                        setEmail(e.target.value);
                    }}
                    placeholder="Enter your email address"
                    disabled={loading}
                    error={errors.email}
                />

                {/* PASSWORD INPUT */}
                <Input
                    id="register-password"
                    label="🔒 Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        console.log(`🔒 Registration password (length: ${e.target.value.length})`);
                        setPassword(e.target.value);
                    }}
                    placeholder="Create a password (min 6 characters)"
                    disabled={loading}
                    error={errors.password}
                />

                {/* SUBMIT BUTTON */}
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                >
                    📝 Create Account
                </Button>
            </form>
        </div>
    );
};

// Export component
export default RegisterForm;
