const Question = require('../model/Question');
const Category = require('../model/Category');
const Score = require('../model/Score');

// Get published categories (for students)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ published: true }).sort({ createdAt: -1 });
    const result = await Promise.all(categories.map(async (cat) => {
      const questionCount = await Question.countDocuments({ category: cat._id });
      return { ...cat.toObject(), questionCount };
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get questions for a specific category
const getQuestions = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    if (!category) return res.status(400).json({ message: 'Category ID required' });

    const questions = await Question.aggregate([
      { $match: { category: require('mongoose').Types.ObjectId.createFromHexString(category) } },
      { $sample: { size: parseInt(limit) } },
    ]);

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit score
const submitScore = async (req, res) => {
  const { studentId, score, category, totalQuestions, timeTaken, history } = req.body;
  try {
    const newScore = await Score.create({ student: studentId, score, category, totalQuestions, timeTaken, history });
    res.status(201).json(newScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate('student', 'name email')
      .sort({ score: -1, timeTaken: 1 })
      .limit(20);
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getQuestions, getCategories, submitScore, getLeaderboard };
