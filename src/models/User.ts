// src/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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

export default mongoose.models.User || mongoose.model('User', UserSchema);
