// routes/users.js
// CRUD routes for users

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', function(req, res) {
    User.find()
        .then(function(users) {
            res.json(users);
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Error getting users', error: error.message });
        });
});

// GET single user by ID
router.get('/:id', function(req, res) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Error getting user', error: error.message });
        });
});

// CREATE new user
router.post('/', function(req, res) {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    const user = new User(userData);

    user.save()
        .then(function(newUser) {
            res.status(201).json(newUser);
        })
        .catch(function(error) {
            res.status(400).json({ message: 'Error creating user', error: error.message });
        });
});

// UPDATE user
router.put('/:id', function(req, res) {
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
        .then(function(user) {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        })
        .catch(function(error) {
            res.status(400).json({ message: 'Error updating user', error: error.message });
        });
});

// DELETE user
router.delete('/:id', function(req, res) {
    User.findByIdAndDelete(req.params.id)
        .then(function(user) {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        });
});

module.exports = router;
