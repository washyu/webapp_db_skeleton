
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/users', userRoutes);

sequelize.sync({ force: true }).then(() => {
  app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port ${process.env.API_PORT}`);
  });
});