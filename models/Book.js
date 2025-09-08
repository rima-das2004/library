const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  ISBN: { type: String, unique: true, required: true },
  available: { type: Boolean, default: true },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', default: null },
});

module.exports = mongoose.model('Book', BookSchema);