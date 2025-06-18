// src/routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js'; // ייבוא ה־middleware

const router = express.Router();

// הרשמה פתוחה – אין צורך בהרשאה
router.post('/', createUser);

// שליפת רשימת משתמשים – מוגנת
router.get('/', protect, getUsers);

// שליפת משתמש לפי ID – מוגנת
router.get('/:id', protect, getUserById);

// עדכון ומחיקה לפי ID – מוגנים
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

export default router;
