'use client';
import { useEffect, useState } from 'react';

declare global {
  interface Window { Pi: any; }
}

export default function Home() {
  const [status, setStatus] = useState("Đang khởi tạo hệ thống...");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSDK = setInterval(() => {
      if (typeof window !== 'undefined' && window.Pi) {
        clearInterval(checkSDK);
        initPi();
      }
    }, 500);
    return () => clearInterval(checkSDK);
  }, []);

  const initPi = async () => {
    try {
      await window.Pi.init({ version: "2.0", sandbox: false });
      authenticate();
    } catch (e) {
      setStatus("Vui lòng mở bằng Pi Browser.");
    }
  };

  const authenticate = async () => {
    try {
      const scopes = ['username', 'payments', 'wallet_address'];
      const auth = await window.Pi.authenticate(scopes, (p: any) => console.log("Incomplete:", p));
      setUser(auth.user);
      setStatus("Sẵn sàng giao dịch Bước 10");
    } catch (e) {
      setStatus("Cần quyền truy cập từ Pi Browser.");
    }
  };

  const handlePayment = async () => {
    setStatus("Đang khởi tạo thanh toán...");
    
    const paymentData = {
      amount: 1,
      memo: "Xác thực Bước 10 - CONNECT-SUPREME",
      metadata: { orderId: "PRO-STEP-10" },
    };

    const callbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        setStatus("Đang chờ Server phê duyệt...");
        try {
          const res = await fetch('/api/pi/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId }),
          });
          if (res.ok) {
            setStatus("Server đã duyệt! Hãy nhập mật khẩu ví.");
          } else {
            setStatus("Server từ chối. Kiểm tra API Key trên Vercel.");
          }
        } catch (err) {
          setStatus("Lỗi kết nối Server.");
        }
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log("Hoàn tất TxID:", txid);
        setStatus("THÀNH CÔNG! Quay lại Checklist.");
        alert("Giao dịch hoàn tất! TxID: " + txid);
      },
      onCancel: (paymentId: string) => setStatus("Giao dịch đã hủy."),
      onError: (error: Error) => setStatus("Lỗi: " + error.message),
    };

    window.Pi.createPayment(paymentData, callbacks);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white text-center">
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">CONNECT-PI-SUPREME</h1>
      <div className="p-8 border-2 border-yellow-600/30 rounded-2xl bg-gray-900 shadow-xl max-w-sm w-full">
        <p className="mb-6 text-gray-300">{status}</p>
        {user && (
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded border border-gray-700">
              <p className="text-xs text-yellow-500">Pioneer</p>
              <p className="font-bold">@{user.username}</p>
            </div>
            <button 
              onClick={handlePayment}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-black py-4 rounded-xl transition-transform active:scale-95"
            >
              THANH TOÁN 1 PI
            </button>
          </div>
        )}
      </div>
      <footer className="mt-8 text-gray-600 text-[10px]">Version 1.0.2 - API Standard</footer>
    </main>
  );
}
