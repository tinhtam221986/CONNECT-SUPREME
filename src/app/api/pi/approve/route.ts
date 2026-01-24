import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    const apiKey = process.env.PI_API_KEY;

    // Gọi API của Pi Network để xác nhận phê duyệt giao dịch này
    await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${apiKey}` } }
    );

    return NextResponse.json({ message: "Approved" }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi xác thực Backend:", error.response?.data || error.message);
    return NextResponse.json({ error: "Xác thực thất bại" }, { status: 500 });
  }
}
