import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
// Thử lại với alias @ nếu sếp đã có tsconfig chuẩn, 
// hoặc dùng đường dẫn chuẩn xác bên dưới
import User from '../../../models/User'; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.pi_id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID Pi' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { pi_id: data.pi_id },
      { $set: data },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Lỗi API User:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
