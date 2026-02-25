const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const Admin = require('../model/Admin');

const signIn = async (req, res) => {
  // Accept either `number` or legacy `pass` as the phone/number field
  const { email, password, name, address, number, pass } = req.body;
  const phone = number ?? pass;

  try {
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ message: 'name, email, number, and password are required' });
    }

    const parsedNumber = Number(phone);
    if (Number.isNaN(parsedNumber)) {
      return res.status(400).json({ message: 'number must be numeric' });
    }

    const isUserExists = await Admin.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bycript.hash(password, 12);

    await Admin.create({
      name,
      email,
      address,
      number: parsedNumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Credentials error' });
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bycript.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        number: user.number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { signIn, login };
