import { NextResponse } from 'next/server';
// Sử dụng đường dẫn tương đối chuẩn xác
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data || !data.pi_id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID Pi' }, { status: 400 });
    }

    // Ép kiểu User sang 'any' để vượt qua lỗi TypeScript "not callable"
    const UserModel = User as any;

    const updatedUser = await UserModel.findOneAndUpdate(
      { pi_id: data.pi_id },
      { 
        $set: {
          display_name: data.display_name,
          bio: data.bio,
          avatar_url: data.avatar_url,
          cover_url: data.cover_url,
          socials: data.socials,
          updatedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Lỗi API User:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý dữ liệu' }, 
      { status: 500 }
    );
  }
}

