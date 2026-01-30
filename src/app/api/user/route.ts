import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Log để kiểm tra dữ liệu sếp gửi lên (Xem trong Vercel Logs)
    console.log("Dữ liệu sếp gửi:", data);

    const { pi_id, display_name, bio, avatar_url, cover_url } = data;

    if (!pi_id) {
      return NextResponse.json({ success: false, error: "Thiếu định danh!" }, { status: 400 });
    }

    // Cơ chế tìm kiếm "Vạn năng": Thử mọi trường định danh có thể có
    const updatedUser = await (User as any).findOneAndUpdate(
      { 
        $or: [
          { username: pi_id },
          { pi_id: pi_id },
          { display_name: pi_id }
        ] 
      },
      { 
        $set: { 
          username: pi_id, // Đảm bảo luôn có username
          ...(display_name && { display_name }),
          ...(bio && { bio }),
          ...(avatar_url && { avatar_url }),
          ...(cover_url && { cover_url })
        } 
      },
      { new: true, upsert: true, lean: true } // Nếu không thấy thì tạo mới luôn (Upsert)
    );

    console.log("Kết quả DB:", updatedUser);

    return NextResponse.json({ 
      success: true, 
      message: "Đã ép DB lưu thành công!",
      data: updatedUser 
    });
  } catch (error: any) {
    console.error("LỖI HỆ THỐNG:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
