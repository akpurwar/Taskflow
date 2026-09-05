const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // creates a unique index at the DB level, not just app-level validation
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default on .find()/.findOne()
    },
    refreshToken: {
      type: String,
      select: false, // current valid refresh token (or hash of it), invalidated on logout
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);