// ============================================================================
// INPUT COMPONENT - Reusable form input with validation
// ============================================================================
// This component creates a consistent input field used throughout the app

import React from 'react';

// INPUT COMPONENT DEFINITION
// ==========================
// Props explanation:
// - label: Text to display above input field
// - type: Input type (text, email, password, etc.)
// - value: Current value of input (controlled component)
// - onChange: Function called when user types
// - placeholder: Hint text shown in empty input
// - disabled: Whether input is disabled during loading
// - error: Error message to display below input
// - id: Unique identifier for accessibility
const Input = ({
                   label,
                   type = "text",
                   value,
                   onChange,
                   placeholder,
                   disabled = false,
                   error = null,
                   id
               }) => {
    console.log(`🔤 Rendering input field: ${id}`);

    return (
        <div className="form-group">
            {/* INPUT LABEL */}
            {/* htmlFor connects label to input for accessibility */}
            <label htmlFor={id} className="input-label">
                {label}
            </label>

            {/* INPUT FIELD */}
            {/* This is a "controlled component" - React controls the value */}
            <input
                id={id}                                    // Unique identifier
                type={type}                                // Input type (text, password, etc.)
                value={value}                              // Current value from parent state
                onChange={onChange}                        // Function to update parent state
                placeholder={placeholder}                  // Hint text
                disabled={disabled}                        // Disable during API calls
                className={`input-field ${error ? 'input-error' : ''}`}  // Dynamic CSS classes
            />

            {/* ERROR MESSAGE */}
            {/* Only show if error exists */}
            {error && (
                <div className="field-error">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};

// Export component for use in other files
export default Input;
