import { NextResponse } from 'next/server';
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

    // Ép kiểu (User as any) để vượt qua lỗi TypeScript kiểm tra signature
    const updatedUser = await (User as any).findOneAndUpdate(
      { pi_id: pi_id },
      { 
        $set: { 
          display_name: display_name, 
          bio: bio, 
          updatedAt: new Date() 
        } 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("Lỗi API User:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
