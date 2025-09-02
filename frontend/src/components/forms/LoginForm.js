// Login form component
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import { validateLoginForm } from '../../utils/validation';
import { MESSAGES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSwitchToRegister }) => {
    // Form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Auth context
    const { login } = useAuth();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const formErrors = validateLoginForm(username, password);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const result = await loginUser(username, password);

            if (result.success) {
                alert(MESSAGES.LOGIN_SUCCESS);
                login(result.data.user);
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
            <h2 className="mb-lg">Login</h2>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    value={username}
                    onChange={setUsername}
                    placeholder="Enter your username"
                    required
                    error={errors.username}
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    required
                    error={errors.password}
                />

                <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? MESSAGES.LOADING_LOGIN : 'Login'}
                </Button>
            </form>

            <div className="text-center mb-md" style={{ marginTop: '16px' }}>
                <span>Don't have an account? </span>
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    Register here
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
