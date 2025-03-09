const User = require('../models/userModel');
const { Op } = require('sequelize');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    
    // Don't return the password in the response
    const userData = newUser.get({ plain: true });
    delete userData.password;
    
    res.status(201).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
};

// Get all users (with optional filtering)
exports.getAllUsers = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { firstName, lastName, email, minAge, maxAge } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (firstName) {
      whereConditions.first_name = { [Op.like]: `%${firstName}%` };
    }
    
    if (lastName) {
      whereConditions.last_name = { [Op.like]: `%${lastName}%` };
    }
    
    if (email) {
      whereConditions.email = { [Op.like]: `%${email}%` };
    }
    
    if (minAge) {
      whereConditions.age = { ...whereConditions.age, [Op.gte]: parseInt(minAge) };
    }
    
    if (maxAge) {
      whereConditions.age = { ...whereConditions.age, [Op.lte]: parseInt(maxAge) };
    }
    
    const users = await User.findAll({
      where: whereConditions,
      attributes: { exclude: ['password'] } // Exclude password from results
    });
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Don't allow password updates through this endpoint
    const { password, ...updateData } = req.body;
    
    const [updated] = await User.update(updateData, {
      where: { id: userId }
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get updated user
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Update password specifically
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    // Get user with password
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await User.destroy({
      where: { id: userId }
    });
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create a user object without password to return
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    
    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        message: 'Login successful'
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};