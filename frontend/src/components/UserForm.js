
// components/UserForm.js
// Form for adding and editing users

import React, { useState, useEffect } from 'react';

function UserForm(props) {
    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
    });

    // Fill form if editing existing user
    useEffect(function() {
        if (props.user) {
            setFormData({
                name: props.user.name || '',
                email: props.user.email || '',
                age: props.user.age || ''
            });
        }
    }, [props.user]);

    // Handle form submission
    function handleSubmit(event) {
        event.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.age) {
            alert('Please fill all fields');
            return;
        }

        // Call parent function to save user
        props.onSave(formData);

        // Clear form after successful save
        setFormData({ name: '', email: '', age: '' });
    }

    // Handle input changes
    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        setFormData(function(prevData) {
            return {
                ...prevData,
                [name]: value
            };
        });
    }

    return (
        <div className="form-container">
            <h3>{props.user ? 'Edit User' : 'Add New User'}</h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                />

                <div className="form-buttons">
                    <button type="submit" className="btn-save">
                        {props.user ? 'Update' : 'Add User'}
                    </button>

                    {props.user && (
                        <button type="button" className="btn-cancel" onClick={props.onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default UserForm;
