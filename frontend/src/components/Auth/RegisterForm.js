// ============================================================================
// REGISTER FORM COMPONENT - Simple Registration Form
// ============================================================================
// 🎯 This component lets new users create accounts

import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Message from '../UI/Message';
import { validateUsername, validateEmail, validatePassword } from '../../utils/validation';
import { registerUser } from '../../services/api';

const RegisterForm = ({ onRegister, loading }) => {
    console.log("📝 RegisterForm component started");

    // COMPONENT STATE
    // ===============
    // Form input values
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Error and success messages
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // FORM VALIDATION
    // ===============
    const validateForm = () => {
        console.log("🔍 Checking registration form...");

        const newErrors = {};

        // Check each field
        const usernameError = validateUsername(username);
        if (usernameError) {
            newErrors.username = usernameError;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            newErrors.email = emailError;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        setErrors(newErrors);

        const isValid = Object.keys(newErrors).length === 0;
        console.log(`✅ Registration form is ${isValid ? 'valid' : 'invalid'}`);
        return isValid;
    };

    // FORM SUBMISSION
    // ===============
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("📤 User clicked register button");

        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            console.log(`🚀 Trying to register user: ${username}`);

            // Call API to register user
            await registerUser(username, email, password);

            console.log("✅ Registration successful!");

            // Show success message
            setSuccess('✅ Account created successfully! You can now login.');

            // Clear form after successful registration
            setUsername('');
            setEmail('');
            setPassword('');

        } catch (err) {
            console.error("❌ Registration failed:", err.message);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    // RENDER COMPONENT
    // ================
    return (
        <div className="register-form">
            {/* FORM TITLE */}
            <h2 className="form-title">
                📝 Create Account
            </h2>

            {/* SUCCESS AND ERROR MESSAGES */}
            <Message message={success} type="success" />
            <Message message={error} type="error" />

            {/* REGISTRATION FORM */}
            <form onSubmit={handleSubmit} className="auth-form">

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
                    placeholder="Choose a username"
                    disabled={loading}
                    error={errors.username}
                />

                {/* EMAIL INPUT */}
                <Input
                    id="register-email"
                    label="📧 Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        console.log(`📧 Registration email: ${e.target.value}`);
                        setEmail(e.target.value);
                    }}
                    placeholder="Enter your email"
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
                        console.log(`🔒 Registration password (${e.target.value.length} chars)`);
                        setPassword(e.target.value);
                    }}
                    placeholder="Create a password"
                    disabled={loading}
                    error={errors.password}
                />

                {/* REGISTER BUTTON */}
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth={true}
                    loading={loading}
                >
                    📝 Create Account
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;
