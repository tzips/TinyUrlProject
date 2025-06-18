import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// יצירת משתמש (כבר יש לך)
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      token: generateToken(createdUser._id),
    });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// קבלת כל המשתמשים
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // לא להחזיר סיסמאות
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// קבלת משתמש לפי מזהה
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// עדכון משתמש
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// מחיקת משתמש
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

