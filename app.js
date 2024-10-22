// server.js


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');


// Load environment variables from .env file
dotenv.config();


// Connect to MongoDB with error handling
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process if there's a failure
    }
};


// Initialize Express app
const app = express();


// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests


// Routes
app.use('/api/users', userRoutes);
app.use('/api', expenseRoutes); // Update this line to include /expenses


// Start server and connect to MongoDB
const PORT = process.env.PORT || 5000;


const startServer = async () => {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};


// Start the server
startServer();
