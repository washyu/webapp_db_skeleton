const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// CREATE - Create a new user
router.post('/', userController.createUser);

// READ - Get all users (with optional filtering)
router.get('/', userController.getAllUsers);

// READ - Get a single user by ID
router.get('/:id', userController.getUserById);

// UPDATE - Update a user
router.put('/:id', userController.updateUser);

// DELETE - Delete a user
router.delete('/:id', userController.deleteUser);

// AUTHENTICATION
router.post('/login', userController.loginUser);

// Additional useful routes
router.get('/search/email/:email', userController.getUserByEmail);
router.put('/password/:id', userController.updatePassword);

module.exports = router;