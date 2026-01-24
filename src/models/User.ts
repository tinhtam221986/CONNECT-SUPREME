import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  pi_id: { type: String, required: true, unique: true },
  display_name: { type: String, default: "" },
  avatar_url: { type: String, default: "" },
  cover_url: { type: String, default: "" },
  socials: {
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" }
  },
  bio: { type: String, default: "Chào mừng bạn đến với profile của tôi!" },
  updatedAt: { type: Date, default: Date.now }
});

// Cách xuất model an toàn tuyệt đối cho Next.js
const User = models.User || model('User', UserSchema);
export default User;
