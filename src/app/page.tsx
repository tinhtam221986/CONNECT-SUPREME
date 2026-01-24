'use client';
import { useEffect, useState } from 'react';

declare global {
  interface Window { Pi: any; }
}

export default function Home() {
  const [status, setStatus] = useState("Đang khởi tạo...");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: true }); // Để true để test
      authenticate();
    }
  }, []);

  const authenticate = async () => {
    try {
      const scopes = ['username', 'payments', 'wallet_address'];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setUser(auth.user);
      setStatus("Sẵn sàng cho giao dịch thử nghiệm!");
    } catch (e) {
      setStatus("Vui lòng mở trong Pi Browser để tiếp tục.");
    }
  };

  // Nút thanh toán quan trọng cho Bước 10
  const createPayment = () => {
    const paymentData = {
      amount: 1,
      memo: "Kiểm tra thanh toán CONNECT-PI-SUPREME",
      metadata: { orderId: "TEST-101" },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId: string) => {
        console.log("Đang chờ Server phê duyệt:", paymentId);
        // Lưu ý: Trong môi trường Testnet đơn giản, bước này có thể bỏ qua 
        // nhưng thực tế cần gọi API xác thực trên Server.
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log("Giao dịch đã xong on-chain, TxID:", txid);
        setStatus("Giao dịch thành công! Hãy quay lại Checklist.");
      },
      onCancel: (paymentId: string) => { console.log("Hủy giao dịch"); },
      onError: (error: Error, payment?: any) => { console.error("Lỗi:", error); },
    };

    window.Pi.createPayment(paymentData, callbacks);
  };

  function onIncompletePaymentFound(payment: any) {
    console.log("Có giao dịch chưa hoàn tất:", payment);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white text-center">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">CONNECT-PI-SUPREME</h1>
      <div className="p-6 border border-gray-700 rounded-xl bg-gray-900 shadow-2xl max-w-sm">
        <p className="mb-4 text-gray-300">{status}</p>
        
        {user ? (
          <>
            <p className="text-green-400 mb-6">Chào @{user.username}</p>
            <button 
              onClick={createPayment}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-lg transition-all animate-pulse"
            >
              THANH TOÁN 1 PI (TESTNET)
            </button>
            <p className="text-xs text-gray-500 mt-4 italic">* Đây là giao dịch thử nghiệm, không mất tiền thật</p>
          </>
        ) : (
          <p className="text-red-400 font-mono text-sm">Cần đăng nhập qua Pi Browser</p>
        )}
      </div>
    </main>
  );
}
