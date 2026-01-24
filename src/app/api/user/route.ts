import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    // Dùng pi_id làm khóa chính để tìm kiếm
    const user = await User.findOneAndUpdate(
      { pi_id: data.pi_id }, 
      { $set: data },
      { upsert: true, new: true } // Nếu không có thì tạo mới (Upsert)
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật dữ liệu' }, { status: 500 });
  }
}
