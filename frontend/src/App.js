// Main App component - entry point of the application
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Import all styles
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';

// App content that checks if user is logged in
function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? <DashboardPage /> : <LoginPage />}
        </>
    );
}

// Main App component with auth provider
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
