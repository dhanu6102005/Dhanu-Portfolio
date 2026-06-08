const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connection established successfully!'))
  .catch((err) => {
    console.error('MongoDB connection error:');
    console.error(err);
  });

// API Routes
app.get('/', (req, res) => {
  res.send('Portfolio Backend API is running...');
});

// Handle contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    // Save message to database
    const newContact = new Contact({
      name,
      email,
      message
    });

    const savedContact = await newContact.save();

    console.log('New message saved to MongoDB:', savedContact);

    res.status(201).json({
      success: true,
      message: 'Message saved successfully!',
      data: savedContact
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      error: 'An error occurred while saving the message. Please try again later.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
