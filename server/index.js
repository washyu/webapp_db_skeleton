const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./utils/initDb');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/users', userRoutes);

// Check for seed flag in command line arguments
const shouldSeed = process.argv.includes('--seed');

// Initialize database and start server
initializeDatabase(shouldSeed).then(() => {
  app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port ${process.env.API_PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});