import { NextResponse } from 'next/server';
// Sử dụng đường dẫn tương đối để Vercel tìm thấy file chính xác
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    // Dùng pi_id (@username) làm khóa chính để cập nhật hoặc tạo mới
    const user = await User.findOneAndUpdate(
      { pi_id: data.pi_id }, 
      { $set: data },
      { upsert: true, new: true } 
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Lỗi API User:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi cập nhật dữ liệu' }, 
      { status: 500 }
    );
  }
}
