const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // In seconds
    required: true
  },
  history: [
    {
      question: String,
      selected: String,
      correct: String,
      isCorrect: Boolean,
      points: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Score", scoreSchema);
