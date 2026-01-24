// src/components/profile/ProfileView.tsx
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [tab, setTab] = useState('videos');

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header: Ảnh bìa & Avatar */}
      <div className="relative h-56 w-full bg-gradient-to-br from-purple-900 via-yellow-900 to-black">
        <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-xs">Chỉnh sửa ảnh bìa</button>
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <img src={user.image || "/avatar.png"} className="w-24 h-24 rounded-3xl border-4 border-black object-cover shadow-2xl" />
          <div className="mb-2">
            <h2 className="text-2xl font-black">@{user.username}</h2>
            <p className="text-xs text-gray-400 italic">ID: {user.uid?.substring(0,8)}... (Xác minh ✅)</p>
          </div>
        </div>
      </div>

      {/* Social Links Section (Hình thức nhúng Link) */}
      <div className="mt-14 px-6 flex gap-3 overflow-x-auto py-2 no-scrollbar">
        {['Facebook', 'YouTube', 'TikTok', 'Gmail'].map(social => (
          <button key={social} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-xs font-bold hover:border-yellow-500">
            + {social}
          </button>
        ))}
      </div>

      {/* Tabs Menu (Sắp xếp thông minh) */}
      <div className="mt-4 flex border-b border-gray-900">
        {['videos', 'store', 'liked', 'cart'].map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest ${tab === t ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
          >
            {t === 'videos' ? '🎥' : t === 'store' ? '🛍️' : t === 'liked' ? '❤️' : '🛒'} {t}
          </button>
        ))}
      </div>

      {/* Nội dung thay đổi theo Tab */}
      <div className="p-1">
        {tab === 'videos' && (
          <div className="grid grid-cols-3 gap-0.5 animate-pulse">
            <div className="aspect-[3/4] bg-gray-900 flex items-center justify-center text-[10px] text-gray-700">Chưa có video</div>
          </div>
        )}
        {tab === 'store' && (
          <div className="p-10 text-center text-gray-600 italic">Tính năng gian hàng Pi đang khởi tạo...</div>
        )}
      </div>

      {/* Bottom Navigation (Cố định dưới cùng) */}
      <nav className="fixed bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-900 flex justify-around py-4">
        <button className="text-2xl">🏠</button>
        <button className="text-2xl">🎬</button>
        <button className="text-4xl text-yellow-500 -mt-2">⊕</button>
        <button className="text-2xl">💬</button>
        <button className="text-2xl opacity-100">👤</button>
      </nav>
    </div>
  );
}
