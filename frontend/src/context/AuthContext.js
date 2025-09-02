// Authentication context - manages user login state across the entire app
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Provider component that wraps the entire app
export const AuthProvider = ({ children }) => {
    // State to track current user and login status
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to log in a user
    const login = (userData) => {
        console.log('User logged in:', userData.username);
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Function to log out a user
    const logout = () => {
        console.log('User logged out');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Values available to all components
    const contextValue = {
        user,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
