import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, fullName, phone, location, role, farmSize, primaryCrop } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique ID (simulating Firebase UID)
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user
    const user = new User({
      uid,
      email,
      password: hashedPassword,
      fullName,
      phone,
      location: location || '',
      role,
      farmSize: farmSize || '',
      primaryCrop: primaryCrop || '',
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userProfile = {
      uid: user.uid,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      location: user.location,
      role: user.role,
      farmSize: user.farmSize,
      primaryCrop: user.primaryCrop,
      createdAt: user.createdAt.toISOString(),
    };

    res.status(201).json({ token, user: userProfile });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Handle phone login by converting to the same format used at registration
    const authEmail = emailOrPhone.includes('@')
      ? emailOrPhone
      : `${emailOrPhone}@agrilink.app`;

    // Find user by email
    const user = await User.findOne({ email: authEmail });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userProfile = {
      uid: user.uid,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      location: user.location,
      role: user.role,
      farmSize: user.farmSize,
      primaryCrop: user.primaryCrop,
      createdAt: user.createdAt.toISOString(),
    };

    res.json({ token, user: userProfile });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      uid: user.uid,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      location: user.location,
      role: user.role,
      farmSize: user.farmSize,
      primaryCrop: user.primaryCrop,
      createdAt: user.createdAt.toISOString(),
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { location, fullName, farmSize, primaryCrop } = req.body;
    const updateData = {};

    if (location !== undefined) updateData.location = location;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (farmSize !== undefined) updateData.farmSize = farmSize;
    if (primaryCrop !== undefined) updateData.primaryCrop = primaryCrop;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      uid: user.uid,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      location: user.location,
      role: user.role,
      farmSize: user.farmSize,
      primaryCrop: user.primaryCrop,
      createdAt: user.createdAt.toISOString(),
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};