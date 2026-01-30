import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { pi_id, display_name, bio, avatar_url, cover_url } = data;

    // Tìm theo username (ví dụ: DANG21986) và cập nhật hoặc tạo mới
    const updatedUser = await User.findOneAndUpdate(
      { username: pi_id }, 
      { 
        $set: { 
          ...(display_name && { display_name }),
          ...(bio && { bio }),
          ...(avatar_url && { avatar_url }),
          ...(cover_url && { cover_url })
        } 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Lỗi API User:", error);
    return NextResponse.json({ success: false, error: "Lỗi lưu DB" }, { status: 500 });
  }
}
