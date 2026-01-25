import { NextResponse } from 'next/server';
// Sử dụng đường dẫn tương đối để đảm bảo Vercel tìm thấy file
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { pi_id, display_name, bio } = body;

    if (!pi_id) {
      return NextResponse.json({ success: false, error: "Thiếu ID người dùng" }, { status: 400 });
    }

    // Tìm và cập nhật theo pi_id
    const updatedUser = await User.findOneAndUpdate(
      { pi_id: pi_id },
      { 
        $set: { 
          display_name: display_name, 
          bio: bio, 
          updatedAt: new Date() 
        } 
      },
      { new: true, upsert: true } // Nếu chưa có thì tạo mới
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("Lỗi API User:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
