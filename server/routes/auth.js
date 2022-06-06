const express = require('express');
const User = require('../models/User.model');
const argon2 = require('argon2');
const JWT = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello Router user'));

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing username or password' });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      console.log('router.post ~ user', user);
      return res.status(400).json({ success: false, message: 'user existed' });
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    // return access token
    const accessToken = JWT.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log('router.post ~ accessToken', accessToken);

    res.json({ success: true, message: 'create user successful', accessToken });
  } catch (err) {
    console.log('router.post ~ err', err);
    res.status(500).json({
      success: false,
      message: 'create failed',
    });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Login missing username or password' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user is not existed',
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(500).json({
        success: false,
        message: 'Login failed 2',
      });
    }

    const accessToken = JWT.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ success: true, message: 'Login successful', accessToken });
  } catch (err) {
    console.log('router.post ~ err', err);
    res.status(500).json({
      success: false,
      message: 'Login failed 3',
    });
  }
});

module.exports = router;
