// Reusable Input component
import React from 'react';

const Input = ({
                   label,
                   type = 'text',
                   value,
                   onChange,
                   placeholder,
                   required = false,
                   error
               }) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span style={{ color: 'red' }}> *</span>}
                </label>
            )}
            <input
                className="form-input"
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={error ? { borderColor: 'red' } : {}}
            />
            {error && (
                <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>
                    {error}
                </small>
            )}
        </div>
    );
};

export default Input;
