import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { pi_id, display_name, bio } = body;

    // Tìm và cập nhật, nếu chưa có thì tạo mới
    const updatedUser = await User.findOneAndUpdate(
      { pi_id: pi_id },
      { $set: { display_name, bio, updatedAt: new Date() } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("Lỗi API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
