// Registration form component
import React, { useState } from 'react';
import { registerUser } from '../../services/authService';
import { validateRegisterForm } from '../../utils/validation';
import { MESSAGES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSwitchToLogin }) => {
    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const formErrors = validateRegisterForm(username, email, password);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const result = await registerUser(username, email, password);

            if (result.success) {
                alert(MESSAGES.REGISTER_SUCCESS);
                // Clear form and switch to login
                setUsername('');
                setEmail('');
                setPassword('');
                onSwitchToLogin();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert(MESSAGES.NETWORK_ERROR);
        }

        setLoading(false);
    };

    return (
        <div className="card">
            <h2 className="mb-lg">Create Account</h2>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    value={username}
                    onChange={setUsername}
                    placeholder="Choose a username"
                    required
                    error={errors.username}
                />

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                    required
                    error={errors.email}
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Choose a password"
                    required
                    error={errors.password}
                />

                <Button
                    type="submit"
                    variant="success"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? MESSAGES.LOADING_REGISTER : 'Create Account'}
                </Button>
            </form>

            <div className="text-center mb-md" style={{ marginTop: '16px' }}>
                <span>Already have an account? </span>
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    Login here
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;
