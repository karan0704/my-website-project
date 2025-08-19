// ============================================================================
// AUTH TOGGLE COMPONENT - Switch between login and register forms
// ============================================================================
// This component provides a way to switch between login and registration modes

import React from 'react';
import Button from '../UI/Button';

// AUTH TOGGLE COMPONENT DEFINITION
// =================================
// Props explanation:
// - isRegister: Boolean indicating current mode (true = register, false = login)
// - onToggle: Function called when user wants to switch modes
// - loading: Whether to disable toggle during API calls
const AuthToggle = ({ isRegister, onToggle, loading }) => {
    console.log(`🔄 AuthToggle component - Current mode: ${isRegister ? 'Register' : 'Login'}`);

    // TOGGLE CLICK HANDLER
    // ====================
    // Called when user clicks the toggle button
    const handleToggle = () => {
        console.log(`🔄 Switching from ${isRegister ? 'Register' : 'Login'} to ${isRegister ? 'Login' : 'Register'}`);
        onToggle();  // Call parent function to switch modes
    };

    return (
        <div className="auth-toggle">
            {/* TOGGLE MESSAGE */}
            {/* Different message based on current mode */}
            <p className="toggle-message">
                {isRegister ?
                    '🤔 Already have an account?' :
                    '🆕 Need an account?'
                }
            </p>

            {/* TOGGLE BUTTON */}
            {/* Button text changes based on current mode */}
            <Button
                variant="secondary"                        // Secondary styling (outline button)
                onClick={handleToggle}                    // Click handler
                disabled={loading}                        // Disable during API calls
            >
                {isRegister ? '🔐 Switch to Login' : '📝 Create Account'}
            </Button>
        </div>
    );
};

// Export component
export default AuthToggle;
