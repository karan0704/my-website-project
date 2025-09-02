// App.js
// Main application component

import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import userAPI from './services/api';
import './App.css';

function App() {
    // State for users list and editing
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    // Load users when app starts
    useEffect(function() {
        loadUsers();
    }, []);

    // Load all users from API
    function loadUsers() {
        userAPI.getAll()
            .then(function(data) {
                setUsers(data);
            })
            .catch(function(error) {
                console.error('Error loading users:', error);
                alert('Error loading users. Please check the server.');
            });
    }

    // Save user (create new or update existing)
    function handleSave(userData) {
        if (editingUser) {
            // Update existing user
            userAPI.update(editingUser._id, userData)
                .then(function() {
                    alert('User updated successfully!');
                    setEditingUser(null);
                    loadUsers();
                })
                .catch(function(error) {
                    console.error('Error updating user:', error);
                    alert('Error updating user. Please try again.');
                });
        } else {
            // Create new user
            userAPI.create(userData)
                .then(function() {
                    alert('User added successfully!');
                    loadUsers();
                })
                .catch(function(error) {
                    console.error('Error creating user:', error);
                    alert('Error adding user. Please check if email already exists.');
                });
        }
    }

    // Start editing a user
    function handleEdit(user) {
        setEditingUser(user);
    }

    // Cancel editing
    function handleCancel() {
        setEditingUser(null);
    }

    // Delete a user
    function handleDelete(userId) {
        if (window.confirm('Are you sure you want to delete this user?')) {
            userAPI.delete(userId)
                .then(function() {
                    alert('User deleted successfully!');
                    loadUsers();
                })
                .catch(function(error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user. Please try again.');
                });
        }
    }

    return (
        <div className="app">
            <header>
                <h1>User Management System</h1>
            </header>

            <main>
                <UserForm
                    user={editingUser}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />

                <UserList
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>
        </div>
    );
}

export default App;
