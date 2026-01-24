import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.pi_id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID Pi' }, { status: 400 });
    }

    // Chúng ta thêm phần kiểm tra để TypeScript biết chắc chắn User.findOneAndUpdate là một hàm
    if (typeof User.findOneAndUpdate !== 'function') {
        throw new Error("Model User chưa được khởi tạo đúng cách.");
    }

    const updatedUser = await User.findOneAndUpdate(
      { pi_id: data.pi_id },
      { $set: data },
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
