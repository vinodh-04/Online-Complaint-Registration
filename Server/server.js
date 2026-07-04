const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Added mongoose import
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 2. Added MongoDB Connection block
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Database connected successfully!'))
    .catch((err) => console.error('Database connection error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('Online Complaint Registration API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});