// ============================================================================
// BUTTON COMPONENT - Reusable button with different styles
// ============================================================================
// This component creates consistent buttons used throughout the app

import React from 'react';

// BUTTON COMPONENT DEFINITION
// ===========================
// Props explanation:
// - children: Text or elements inside button
// - onClick: Function called when button is clicked
// - type: Button type (submit, button, reset)
// - disabled: Whether button is disabled
// - variant: Button style (primary, secondary, danger)
// - loading: Whether to show loading state
// - fullWidth: Whether button takes full width
const Button = ({
                    children,
                    onClick,
                    type = "button",
                    disabled = false,
                    variant = "primary",
                    loading = false,
                    fullWidth = false
                }) => {
    console.log(`🔘 Rendering button: ${variant}`);

    // DYNAMIC CSS CLASS GENERATION
    // =============================
    // Create CSS class based on props
    const getButtonClass = () => {
        let baseClass = "button";

        // Add full width class if needed
        if (fullWidth) baseClass += " button-full-width";

        // Show loading state if loading
        if (loading) return `${baseClass} button-loading`;

        // Add variant-specific class (primary, secondary, danger)
        return `${baseClass} button-${variant}`;
    };

    return (
        <button
            type={type}                                  // Button type for forms
            onClick={onClick}                            // Click handler function
            disabled={disabled || loading}               // Disable when loading or explicitly disabled
            className={getButtonClass()}                 // Dynamic CSS classes
        >
            {/* BUTTON CONTENT */}
            {/* Show loading text or normal content */}
            {loading ? '⏳ Processing...' : children}
        </button>
    );
};

// Export component for use in other files
export default Button;
