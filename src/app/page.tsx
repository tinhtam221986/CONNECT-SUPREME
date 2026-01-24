'use client';
import { useEffect, useState } from 'react';

// Khai báo nhanh kiểu cho window.Pi để không lỗi TypeScript
declare global {
  interface Window {
    Pi: any;
  }
}

export default function Home() {
  const [status, setStatus] = useState("Đang tải CONNECT-PI-SUPREME...");

  useEffect(() => {
    // Chỉ chạy code Pi SDK khi ở phía Client
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        setStatus("Đang kết nối Pi Network...");
        window.Pi.init({ version: "2.0", sandbox: false }); // Chỉnh thành true nếu muốn test sandbox
      } catch (e) {
        console.error(e);
        setStatus("Lỗi khởi tạo Pi SDK. Hãy mở bằng Pi Browser.");
      }
    } else {
       setStatus("Vui lòng mở ứng dụng trong Pi Browser.");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">CONNECT-PI-SUPREME</h1>
      <div className="p-6 border border-gray-700 rounded bg-gray-900 text-center">
        <p>{status}</p>
        <p className="mt-4 text-sm text-gray-400">Version 1.0.0 - Production Build</p>
      </div>
    </main>
  );
}
 
