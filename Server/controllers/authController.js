// controllers/authController.js
const User = require('../model/user');
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, phoneNo, location, password, image } = req.body;
  console.log(name, email, phoneNo, location, password, image);


  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phoneNo,
      location,
      password,
      image,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        location: user.location,
        image: user.image,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Authenticate User (Login)
exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);


  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        location: user.location,
        image: user.image,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { name, email, phoneNo, location, image } = req.body;
    const userId = req.params.id;

    // Check if the phone number already exists for a different user
    const existingUser = await User.findOne({ phoneNo });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'Phone number already in use by another user' });
    }

    // Find the user by ID and update their details
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phoneNo, location, image },
      { new: true } // Returns the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to protect routes (authMiddleware included directly)
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
