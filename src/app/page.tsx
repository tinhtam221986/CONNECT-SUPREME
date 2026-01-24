'use client';
import { useState, useEffect } from 'react';
// Import sử dụng đường dẫn tương đối
import LoginView from '../components/auth/LoginView';
import ProfileView from '../components/profile/ProfileView';

// KHAI BÁO QUAN TRỌNG: Để TypeScript không báo lỗi window.Pi
declare global {
  interface Window {
    Pi: any;
  }
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Kiểm tra SDK Pi Network mỗi 0.5 giây
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.Pi) {
        clearInterval(timer);
        setIsReady(true);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Màn hình chờ khi SDK đang tải
  if (!isReady) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          <p className="text-yellow-500 text-xs font-mono animate-pulse">CONNECTING PI SDK...</p>
        </div>
      </div>
    );
  }

  // Điều phối màn hình dựa trên trạng thái đăng nhập
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
