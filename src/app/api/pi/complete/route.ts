import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();
    const apiKey = process.env.PI_API_KEY;

    // Gọi API Pi để hoàn tất giao dịch
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
