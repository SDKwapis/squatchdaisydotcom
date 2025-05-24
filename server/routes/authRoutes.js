const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET = 'your_super_secret_key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.validPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Logged in successfully' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// TEMPORARY: Register route to create your first user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const newUser = await User.create({ email, password });
    res.status(201).json({ message: 'User created', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin.html'));
});

module.exports = router;

