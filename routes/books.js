const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');

// Add new book (Admin only)
router.post('/', auth, role('admin'), async (req, res) => {
  const { title, author, ISBN } = req.body;
  try {
    let book = await Book.findOne({ ISBN });
    if (book) return res.status(400).json({ message: 'Book with this ISBN already exists' });

    book = new Book({ title, author, ISBN });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all available books (any authenticated user)
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Borrow a book (Member only)
router.post('/borrow/:id', auth, role('member'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.available) return res.status(400).json({ message: 'Book is already borrowed' });

    book.available = false;
    book.borrowedBy = req.user._id;
    await book.save();

    res.json({ message: `Book borrowed successfully: ${book.title}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;