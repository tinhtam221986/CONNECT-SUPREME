import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true }, // Định danh chính từ Pi
  display_name: { type: String, default: "Pioneer" },
  bio: { type: String, default: "" },
  avatar_url: { type: String, default: "" },
  cover_url: { type: String, default: "" },
  piUid: { type: String }, // ID nội bộ của Pi Network
}, { 
  timestamps: true,
  strict: true 
});

export default models.User || model('User', UserSchema);
