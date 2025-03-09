const sequelize = require('../config/database');
const seedUsers = require('../seeders/userSeeder');

async function initializeDatabase(shouldSeed = false) {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized.');
    
    // Seed if requested
    if (shouldSeed) {
      await seedUsers();
    }
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

module.exports = initializeDatabase;