import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { username, display_name, bio, avatar_url, cover_url } = data;

    if (!username) {
      return NextResponse.json({ success: false, error: "Missing username" }, { status: 400 });
    }

    // Cập nhật hoặc tạo mới dựa trên username
    const updatedUser = await User.findOneAndUpdate(
      { username },
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
    console.error("Backend Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
