// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // אימייל חייב להיות ייחודי
    },
    password: { // יכיל את הסיסמה המוצפנת
      type: String,
      required: true,
    },
    // ניתן להוסיף כאן מערך של קישורים השייכים למשתמש
    // links: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Link',
    //   },
    // ],
  },
  {
    timestamps: true, // מוסיף createdAt ו-updatedAt אוטומטית
  }
);

const User = mongoose.model('User', UserSchema);
export default User;