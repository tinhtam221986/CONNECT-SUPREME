'use client';
import { useState, useEffect } from 'react';
// Sử dụng đường dẫn tương đối để tránh lỗi Module not found
import LoginView from '../components/auth/LoginView';
import ProfileView from '../components/profile/ProfileView';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Kiểm tra SDK Pi Network
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.Pi) {
        clearInterval(timer);
        setIsReady(true);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Màn hình chờ khi SDK chưa sẵn sàng
  if (!isReady) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Điều phối màn hình: Nếu có user thì vào Profile, chưa có thì ở Login
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
