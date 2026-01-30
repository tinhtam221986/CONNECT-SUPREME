import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { pi_id, display_name, bio, avatar_url, cover_url } = data;

    if (!pi_id) {
      return NextResponse.json({ success: false, error: "Thiếu ID" }, { status: 400 });
    }

    // Sử dụng updateOne để né lỗi ép kiểu của TypeScript
    await (User as any).updateOne(
      { username: pi_id },
      { 
        $set: { 
          ...(display_name && { display_name }),
          ...(bio && { bio }),
          ...(avatar_url && { avatar_url }),
          ...(cover_url && { cover_url })
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi API User:", error);
    return NextResponse.json({ success: false, error: "Lỗi lưu DB" }, { status: 500 });
  }
}
