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
  strict: false // Tạm thời để false để tránh lỗi "Path not in schema" khi sếp cập nhật thêm trường mới
});

export default models.User || model('User', UserSchema);
