'use client';
import { useEffect, useState } from 'react';

declare global { interface Window { Pi: any; } }

export default function Home() {
  const [status, setStatus] = useState("Đang kiểm tra hệ thống...");
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
      // Khi vừa vào App, kiểm tra xem có thanh toán nào bị kẹt không
      authenticate();
    } catch (e) { setStatus("Lỗi khởi tạo SDK."); }
  };

  const authenticate = async () => {
    try {
      const scopes = ['username', 'payments', 'wallet_address'];
      // Hàm onIncompletePaymentFound sẽ xử lý các giao dịch bị báo "Error! Pending payment"
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setUser(auth.user);
      setStatus("Đã sẵn sàng!");
    } catch (e) { setStatus("Cần mở trong Pi Browser."); }
  };

  // QUAN TRỌNG: Hàm này giúp xử lý lỗi "Pending payment" của bạn
  async function onIncompletePaymentFound(payment: any) {
    setStatus("Đang xử lý giao dịch bị kẹt...");
    try {
      await fetch('/api/pi/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid }),
      });
      setStatus("Đã giải phóng giao dịch treo! Hãy thử lại.");
    } catch (err) {
      console.error("Không thể giải phóng giao dịch:", err);
    }
  }

  const handlePayment = async () => {
    const paymentData = {
      amount: 1,
      memo: "Xác thực Bước 10",
      metadata: { orderId: "FIX-STEP-10" },
    };

    const callbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        await fetch('/api/pi/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }),
        });
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        setStatus("Đang hoàn tất...");
        await fetch('/api/pi/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid }),
        });
        setStatus("THÀNH CÔNG! Check Bước 10 ngay.");
      },
      onCancel: (pId: string) => setStatus("Đã hủy."),
      onError: (err: Error) => setStatus("Lỗi: " + err.message),
    };
    window.Pi.createPayment(paymentData, callbacks);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white text-center">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">CONNECT-PI-SUPREME</h1>
      <div className="p-6 border border-yellow-600/20 rounded-xl bg-gray-900 w-full max-w-xs">
        <p className="mb-4 text-sm">{status}</p>
        {user && (
          <button onClick={handlePayment} className="w-full bg-yellow-600 p-3 rounded-lg font-bold">
            THANH TOÁN LẠI 1 PI
          </button>
        )}
      </div>
    </main>
  );
}
