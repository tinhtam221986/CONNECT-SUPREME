import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    const apiKey = process.env.PI_API_KEY;

    if (!apiKey) {
      console.error("Thiếu PI_API_KEY trong biến môi trường");
      return NextResponse.json({ error: "Cấu hình Server lỗi" }, { status: 500 });
    }

    // Sử dụng fetch mặc định của Next.js để không bị lỗi thiếu thư viện axios
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Pi API Error:", errorData);
      return NextResponse.json({ error: "Pi Network từ chối phê duyệt" }, { status: 400 });
    }

    return NextResponse.json({ message: "Approved" }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi Server:", error.message);
    return NextResponse.json({ error: "Lỗi hệ thống nội bộ" }, { status: 500 });
  }
}
