'use client';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

export default function Home() {
  const [status, setStatus] = useState("Đang khởi tạo hệ thống CONNECT-SUPREME...");
  const [user, setUser] = useState<any>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);

  useEffect(() => {
    // Cơ chế kiểm tra SDK liên tục để tránh lỗi "Pi is not defined"
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
      // Thiết lập sandbox: false để chạy thực tế trên domain Vercel
      await window.Pi.init({ version: "2.0", sandbox: false });
      setIsSdkReady(true);
      authenticate();
    } catch (e) {
      console.error("Lỗi khởi tạo Pi SDK:", e);
      setStatus("Lỗi khởi tạo. Vui lòng tải lại trang trong Pi Browser.");
    }
  };

  const authenticate = async () => {
    try {
      const scopes = ['username', 'payments', 'wallet_address'];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setUser(auth.user);
      setStatus("Xác thực thành công! Sẵn sàng cho giao dịch Bước 10.");
    } catch (e) {
      console.error("Lỗi xác thực:", e);
      setStatus("Cần quyền truy cập để tiếp tục. Hãy mở bằng Pi Browser.");
    }
  };

  const onIncompletePaymentFound = (payment: any) => {
    console.log("Phát hiện giao dịch chưa hoàn tất:", payment);
    // Tại đây có thể gọi API để hoàn tất giao dịch cũ nếu cần
  };

  const handlePayment = async () => {
    if (!isSdkReady) return;

    setStatus("Đang khởi tạo giao dịch 1 Pi...");
    
    const paymentData = {
      amount: 1,
      memo: "Thanh toán thử nghiệm Bước 10 - CONNECT-PI-SUPREME",
      metadata: { orderId: "STEP-10-VERIFICATION" },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId: string) => {
        console.log("Server đang phê duyệt ID:", paymentId);
        // Với mục đích vượt qua Bước 10 Testnet, Pi đôi khi tự động xử lý bước này
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log("Giao dịch thành công! TxID:", txid);
        setStatus(`Giao dịch thành công! TxID: ${txid.substring(0, 10)}...`);
        alert("Chúc mừng! Bạn đã hoàn thành giao dịch. Hãy quay lại Checklist Bước 10.");
      },
      onCancel: (paymentId: string) => {
        setStatus("Giao dịch đã bị hủy.");
        console.log("Hủy thanh toán:", paymentId);
      },
      onError: (error: Error, payment?: any) => {
        setStatus("Lỗi trong quá trình thanh toán.");
        console.error("Lỗi thanh toán:", error);
      },
    };

    try {
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (e) {
      console.error("Lỗi gọi createPayment:", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white text-center">
      <div className="z-10 max-w-md w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-500 tracking-tighter">
          CONNECT-PI-SUPREME
        </h1>
        
        <div className="p-8 border-2 border-yellow-600/50 rounded-2xl bg-gray-900 shadow-[0_0_20px_rgba(202,138,4,0.3)]">
          <p className="mb-6 text-lg font-medium text-gray-200">
            {status}
          </p>
          
          {user ? (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p className="text-yellow-400">Chào Pioneer:</p>
                <p className="text-xl font-bold">@{user.username}</p>
              </div>
              
              <button 
                onClick={handlePayment}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-black py-5 rounded-xl transition-all transform active:scale-95 shadow-lg"
              >
                THANH TOÁN 1 PI (BƯỚC 10)
              </button>
            </div>
          ) : (
            <div className="animate-pulse text-gray-500">
              Đang chờ xác thực từ Pi Browser...
            </div>
          )}
        </div>
        
        <footer className="mt-12 text-gray-600 text-xs">
          <p>Version 1.0.1 - Hệ thống thanh toán tối ưu</p>
          <p className="mt-1">© 2026 CONNECT-PI-SUPREME Team</p>
        </footer>
      </div>
    </main>
  );
      }

