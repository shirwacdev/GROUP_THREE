const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../model/Admin');
const Student = require('../model/Student');
const Question = require('../model/Question');
const Category = require('../model/Category');
const Score = require('../model/Score');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecrete';


// ── Auth ──────────────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    await Admin.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Admin registered' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Dashboard Stats ───────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const totalStudents    = await Student.countDocuments();
    const totalQuestions   = await Question.countDocuments();
    const totalCategories  = await Category.countDocuments();
    const totalQuizzesTaken = await Score.countDocuments();
    
    // Find highest score
    const bestScoreEntry = await Score.findOne().sort({ score: -1 });
    const highestScore = bestScoreEntry ? bestScoreEntry.score : 0;

    const recentScores = await Score.find().populate('student', 'name').sort({ createdAt: -1 }).limit(6);
    res.json({ totalStudents, totalQuestions, totalCategories, totalQuizzesTaken, highestScore, recentScores });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Category Management ───────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    // Attach question count per category
    const result = await Promise.all(categories.map(async (cat) => {
      const questionCount = await Question.countDocuments({ category: cat._id });
      return { ...cat.toObject(), questionCount };
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Category already exists' });
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    // Delete all questions in that category
    await Question.deleteMany({ category: req.params.id });
    res.json({ message: 'Category and its questions deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Question Management ───────────────────────────────────────────
const getAllQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const questions = await Question.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createQuestion = async (req, res) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── User Management ───────────────────────────────────────────────
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await Score.deleteMany({ student: req.params.id });
    res.json({ message: 'Student and records deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateStudentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    if (!['active', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const student = await Student.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  register, login, getStats,
  getCategories, createCategory, updateCategory, deleteCategory,
  createQuestion, deleteQuestion, getAllQuestions,
  getAllStudents, deleteStudent, updateStudentStatus,
};
