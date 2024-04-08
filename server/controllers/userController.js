const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, address, age } = req.body;
    const user = await User.create({ first_name, last_name, email, password, address, age });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};