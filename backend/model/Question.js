const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question:          { type: String, required: true },
  correct_answer:    { type: String, required: true },
  incorrect_answers: [{ type: String }],
  category:          { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  difficulty:        { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  hint:              { type: String, default: '' },
  createdAt:         { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', QuestionSchema);
