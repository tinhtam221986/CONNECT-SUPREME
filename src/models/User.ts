import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  display_name: { type: String },
  bio: { type: String },
  avatar_url: { type: String },
  cover_url: { type: String },
  piUid: { type: String },
}, { timestamps: true });

// Tránh lỗi gán lại model khi hot-reload
export default models.User || model('User', UserSchema);
