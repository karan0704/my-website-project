// services/api.js
// API calls for user CRUD operations

const API_URL = 'http://localhost:5010/api';

// User API functions
const userAPI = {
    // Get all users
    getAll: function() {
        return fetch(API_URL + '/users')
            .then(function(response) {
                return response.json();
            });
    },

    // Get single user by ID
    getById: function(id) {
        return fetch(API_URL + '/users/' + id)
            .then(function(response) {
                return response.json();
            });
    },

    // Create new user
    create: function(userData) {
        return fetch(API_URL + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then(function(response) {
                return response.json();
            });
    },

    // Update user
    update: function(id, userData) {
        return fetch(API_URL + '/users/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then(function(response) {
                return response.json();
            });
    },

    // Delete user
    delete: function(id) {
        return fetch(API_URL + '/users/' + id, {
            method: 'DELETE'
        })
            .then(function(response) {
                return response.json();
            });
    }
};

export default userAPI;
