// server.js
// Portfolio Backend — Node.js + Express + MySQL

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

// Import MySQL connection (tests connection on load)
require('./db/connection');

// Import MySQL Contact model
const Contact = require('./models/Contact');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:  'running',
    message: 'Dhanusri Portfolio Backend API is running ✅',
    database: 'MySQL',
    version: '2.0.0'
  });
});

// ─── POST /api/contact — Save contact form submission ────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all fields: name, email, and message.'
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    // Save to MySQL
    const savedContact = await Contact.create({ name, email, message });

    console.log(`📩 New contact saved [ID: ${savedContact.id}] — ${name} <${email}>`);

    return res.status(201).json({
      success: true,
      message: 'Message received! Thank you for reaching out.',
      data: savedContact
    });

  } catch (err) {
    console.error('❌ Error saving contact:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

// ─── GET /api/contacts — Retrieve all messages (admin use) ───────────────────
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    return res.json({
      success: true,
      count:   contacts.length,
      data:    contacts
    });
  } catch (err) {
    console.error('❌ Error fetching contacts:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Server error while fetching contacts.'
    });
  }
});

// ─── GET /api/contacts/:id — Get single message by ID ────────────────────────
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found.' });
    }
    return res.json({ success: true, data: contact });
  } catch (err) {
    console.error('❌ Error fetching contact:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Server error.'
    });
  }
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/              → Health check`);
  console.log(`   POST http://localhost:${PORT}/api/contact   → Submit contact form`);
  console.log(`   GET  http://localhost:${PORT}/api/contacts  → View all messages\n`);
});
