// Profile update form component
import React, { useState } from 'react';
import { updateUserProfile } from '../../services/authService';
import { MESSAGES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfileForm = ({ user }) => {
    // Form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!currentPassword) {
            alert('Please enter your current password');
            return;
        }

        if (!newUsername && !newPassword) {
            alert('Please enter at least one field to update');
            return;
        }

        setLoading(true);

        try {
            const result = await updateUserProfile(
                user._id,
                currentPassword,
                newUsername,
                newPassword
            );

            if (result.success) {
                alert(MESSAGES.PROFILE_UPDATE_SUCCESS + ' Please login again.');
                // Refresh the page to force re-login
                window.location.reload();
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
            <h3 className="mb-lg">Update Your Profile</h3>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Enter your current password"
                    required
                />

                <Input
                    label="New Username (optional)"
                    value={newUsername}
                    onChange={setNewUsername}
                    placeholder="Enter new username or leave empty"
                />

                <Input
                    label="New Password (optional)"
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Enter new password or leave empty"
                />

                <Button
                    type="submit"
                    variant="success"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? MESSAGES.LOADING_UPDATE : 'Update Profile'}
                </Button>
            </form>
        </div>
    );
};

export default ProfileForm;
