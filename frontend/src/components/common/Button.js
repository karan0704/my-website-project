// Reusable Button component
import React from 'react';

const Button = ({
                    children,
                    onClick,
                    disabled = false,
                    variant = 'primary',
                    fullWidth = false,
                    loading = false
                }) => {
    // Build CSS classes based on props
    let buttonClasses = 'btn';
    buttonClasses += ` btn-${variant}`;
    if (fullWidth) buttonClasses += ' btn-full';

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;
