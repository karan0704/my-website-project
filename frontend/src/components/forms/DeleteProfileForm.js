// Delete profile form component
import React, { useState } from 'react';
import { deleteUserProfile } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { MESSAGES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

const DeleteProfileForm = ({ user, onCancel }) => {
    // Form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Auth context
    const { logout } = useAuth();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!currentPassword) {
            alert('Please enter your current password to delete your account');
            return;
        }

        // Double confirmation
        const confirmDelete = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone!'
        );

        if (!confirmDelete) {
            return;
        }

        const finalConfirm = window.confirm(
            'This will permanently delete all your data. Are you absolutely sure?'
        );

        if (!finalConfirm) {
            return;
        }

        setLoading(true);

        try {
            const result = await deleteUserProfile(user._id, currentPassword);

            if (result.success) {
                alert(MESSAGES.PROFILE_DELETE_SUCCESS);
                // Log out the user and redirect to login
                logout();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert(MESSAGES.NETWORK_ERROR);
        }

        setLoading(false);
    };

    return (
        <div className="card" style={{ border: '2px solid #dc3545' }}>
            <h3 className="mb-lg" style={{ color: '#dc3545' }}>Delete Your Account</h3>

            <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px'
            }}>
                <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
            </div>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Enter your current password to confirm"
                    type="password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Enter your current password"
                    required
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onCancel}
                        disabled={loading}
                        style={{ flex: 1 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="danger"
                        loading={loading}
                        disabled={loading}
                        style={{ flex: 1 }}
                    >
                        {loading ? MESSAGES.LOADING_DELETE : 'Delete Account'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DeleteProfileForm;
