'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script'; // Import component Script để nạp SDK chuẩn nhất
import LoginView from '../components/auth/LoginView';
import ProfileView from '../components/profile/ProfileView';

// Khai báo kiểu dữ liệu cho window.Pi
declare global {
  interface Window {
    Pi: any;
  }
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  // 1. Hàm khởi tạo SDK (Duy trì các kết nối cũ)
  const initPi = () => {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: false });
      setIsReady(true);
      console.log("Pi SDK đã sẵn sàng 🫡");
    }
  };

  useEffect(() => {
    // Kiểm tra SDK mỗi 500ms nếu Script chưa kịp load
    const timer = setInterval(() => {
      if (window.Pi) {
        initPi();
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // 2. Màn hình chờ chuyên nghiệp
  if (!isReady) {
    return (
      <>
        {/* Nạp SDK Pi Network trực tiếp từ nguồn chính thức */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="afterInteractive"
          onLoad={initPi}
        />
        <div className="bg-black min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-yellow-500 text-xs font-mono animate-pulse">ĐANG THIẾT LẬP KẾT NỐI PI SDK...</p>
          </div>
        </div>
      </>
    );
  }

  // 3. Điều phối màn hình (Login -> Profile)
  return (
    <main className="bg-black min-h-screen">
      {user ? (
        <ProfileView user={user} />
      ) : (
        <LoginView onLoginSuccess={setUser} />
      )}
    </main>
  );
}
