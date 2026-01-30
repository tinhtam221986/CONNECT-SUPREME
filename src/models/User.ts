import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  display_name: { type: String, default: "Pioneer" },
  bio: { type: String, default: "" },
  avatar_url: { type: String, default: "" },
  cover_url: { type: String, default: "" },
  piUid: { type: String },
}, { 
  timestamps: true,
  strict: false // Cho phép lưu các trường linh hoạt
});

export default models.User || model('User', UserSchema);
