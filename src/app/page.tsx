// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import LoginView from '@/components/auth/LoginView';
import ProfileView from '@/components/profile/ProfileView';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Đợi SDK khởi tạo
    const timer = setInterval(() => {
      if (window.Pi) {
        clearInterval(timer);
        setIsReady(true);
      }
    }, 500);
  }, []);

  if (!isReady) return <div className="bg-black min-h-screen" />;

  // Nếu chưa có user -> Hiện màn hình Login. Có rồi -> Hiện Profile.
  return user ? <ProfileView user={user} /> : <LoginView onLoginSuccess={setUser} />;
}
