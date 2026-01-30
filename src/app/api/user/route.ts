import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Lấy dữ liệu từ giao diện gửi lên
    const { username, display_name, bio, avatar_url, cover_url } = data;

    if (!username) {
      return NextResponse.json({ success: false, error: "Missing username" }, { status: 400 });
    }

    // SỬ DỤNG (User as any) ĐỂ VƯỢT LỖI TYPE ERROR CỦA VERCEL
    const updatedUser = await (User as any).findOneAndUpdate(
      { username: username }, 
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
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
