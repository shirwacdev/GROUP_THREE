const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../model/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const isUserExists = await Student.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (student.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending or deactivated. Please contact admin.' });
    }

    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
