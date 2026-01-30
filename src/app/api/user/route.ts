import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { pi_id, display_name, bio, avatar_url, cover_url } = data;

    // Log này sếp có thể xem trong Vercel Dashboard > Logs
    console.log("Hệ thống nhận lệnh từ sếp:", pi_id);

    // Cưỡng chế cập nhật: Thử tìm theo username HOẶC pi_id
    const updateResult = await (User as any).findOneAndUpdate(
      { $or: [{ username: pi_id }, { piUid: pi_id }, { pi_id: pi_id }] },
      { 
        $set: { 
          username: pi_id,
          display_name,
          bio,
          ...(avatar_url && { avatar_url }),
          ...(cover_url && { cover_url })
        } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updateResult });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
