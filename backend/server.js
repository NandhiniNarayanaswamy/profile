const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const redisClient = require('./config/redis'); // ✅ Import Redis from separate file
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

dotenv.config(); // ✅ Load environment variables

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Make Redis client available app-wide if needed
app.set('redisClient', redisClient);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
