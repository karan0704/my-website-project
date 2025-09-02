// Main dashboard page after login
import React, {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import ProfileForm from '../components/forms/ProfileForm';
import DeleteProfileForm from '../components/forms/DeleteProfileForm';
import Button from '../components/common/Button';

const DashboardPage = () => {
    const {user} = useAuth();
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);

    return (
        <Layout>
            {/* User profile information */}
            <div className="card">
                <h3 className="mb-md">Your Profile Information</h3>
                <div style={{marginBottom: '8px'}}>
                    <strong>Username:</strong> {user.username}
                </div>
                <div style={{marginBottom: '8px'}}>
                    <strong>Email:</strong> {user.email}
                </div>
                <div style={{marginBottom: '16px'}}>
                    <strong>User ID:</strong> {user._id}
                </div>

                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <Button onClick={() => {
                        setShowProfileEditor(!showProfileEditor);
                        setShowDeleteForm(false);
                    }}>
                        {showProfileEditor ? 'Hide Profile Editor' : 'Edit Profile'}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowDeleteForm(!showDeleteForm);
                            setShowProfileEditor(false);
                        }}
                    >
                        {showDeleteForm ? 'Cancel Delete' : 'Delete Account'}
                    </Button>
                </div>
            </div>

            {/* Profile editor form */}
            {showProfileEditor && <ProfileForm user={user}/>}

            {/* Delete profile form */}
            {showDeleteForm && (
                <DeleteProfileForm
                    user={user}
                    onCancel={() => setShowDeleteForm(false)}
                />
            )}
        </Layout>
    );
};

export default DashboardPage;
