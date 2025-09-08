const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});