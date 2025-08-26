// ============================================================================
// AUTH TOGGLE COMPONENT - Switch Between Login and Register
// ============================================================================
// 🎯 This component provides a button to switch between login and register forms

import React from 'react';
import Button from '../UI/Button';

const AuthToggle = ({ isRegister, onToggle, loading }) => {
    console.log(`🔄 AuthToggle - Current mode: ${isRegister ? 'Register' : 'Login'}`);

    // TOGGLE BUTTON CLICK
    // ===================
    const handleToggle = () => {
        console.log(`🔄 User wants to switch to ${isRegister ? 'Login' : 'Register'} mode`);
        onToggle(); // Call the function passed from parent
    };

    return (
        <div className="auth-toggle">
            {/* MESSAGE BASED ON CURRENT MODE */}
            <p className="toggle-message">
                {isRegister ?
                    '🤔 Already have an account?' :
                    '🆕 Need an account?'
                }
            </p>

            {/* TOGGLE BUTTON */}
            <Button
                variant="secondary"
                onClick={handleToggle}
                disabled={loading}
            >
                {isRegister ? '🔐 Switch to Login' : '📝 Create Account'}
            </Button>
        </div>
    );
};

export default AuthToggle;
