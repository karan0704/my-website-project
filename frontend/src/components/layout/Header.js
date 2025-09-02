// Header component with user info and logout
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();

    // Don't show header if user is not logged in
    if (!isAuthenticated) return null;

    return (
        <div className="header">
            <h1>Welcome, {user?.username}!</h1>
            <Button variant="danger" onClick={logout}>
                Logout
            </Button>
        </div>
    );
};

export default Header;
