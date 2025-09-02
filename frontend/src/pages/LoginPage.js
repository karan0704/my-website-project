// Login page that shows either login or register form
import React, { useState } from 'react';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';

const LoginPage = () => {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="container">
            {showRegister ? (
                <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
                <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
            )}

            {/* Test users info */}
            <div style={{
                border: '1px solid #ffc107',
                backgroundColor: '#fff3cd',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '20px'
            }}>
                <h4>Test Users:</h4>
                <p><strong>Username:</strong> demo_user | <strong>Password:</strong> demo123</p>
                <p><strong>Username:</strong> Karan007 | <strong>Password:</strong> 123456789</p>
            </div>
        </div>
    );
};

export default LoginPage;
