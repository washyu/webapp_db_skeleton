const { faker } = require('@faker-js/faker');
const User = require('../models/userModel');
const sequelize = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

async function seedUsers() {
  try {
    // Sync the database with {force: true} to reset tables if needed
    await sequelize.sync({ force: true });
    
    console.log('Database synced and reset successfully.');
    
    // Create some predefined users for testing
    const defaultUsers = [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'admin123', // Will be hashed by User model hooks
        address: '123 Admin St, Admin City',
        age: 35,
        avatarIndex: 0 // Admin gets the first avatar
      },
      {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'test123', // Will be hashed by User model hooks
        address: '456 Test Ave, Test Town',
        age: 28,
        avatarIndex: 1
      }
    ];
    
    // Create additional random users
    const randomUsers = [];
    
    for (let i = 0; i < 20; i++) {
      // Create random password with consistent format
      const password = `password${i + 1}`;
      
      randomUsers.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: password, // Will be hashed by User model hooks
        address: faker.location.streetAddress() + ', ' + faker.location.city(),
        age: faker.number.int({ min: 18, max: 80 }),
        avatarIndex: Math.floor(Math.random() * 15) // Random avatar from 15 possibilities
      });
    }
    
    // Combine all users
    const allUsers = [...defaultUsers, ...randomUsers];
    
    // Insert all users into the database
    await User.bulkCreate(allUsers, { individualHooks: true });
    
    // Create a credentials object with all login info
    const credentials = allUsers.map(user => ({
      email: user.email,
      password: user.password,
      name: `${user.first_name} ${user.last_name}`,
      avatarIndex: user.avatarIndex
    }));
    
    // Log success
    console.log('Database seeded successfully!');
    
    // Output credentials as JSON
    console.log('All user credentials:');
    console.log(JSON.stringify(credentials, null, 2));
    
    // Save credentials to a file for reference
    try {
      const filePath = path.resolve(__dirname, '../test_credentials.json');
      await fs.writeFile(
        filePath,
        JSON.stringify(credentials, null, 2)
      );
      console.log(`Test credentials saved to: ${filePath}`);
    } catch (writeErr) {
      console.error('Could not save credentials to file:', writeErr);
    }
    
    return credentials;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

// If run directly (node seeders/userSeeder.js)
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  // Export for use in other files
  module.exports = seedUsers;
}