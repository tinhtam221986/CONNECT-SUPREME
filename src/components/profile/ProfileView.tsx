'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      {/* 1. KHU VỰC HEADER (Ảnh bìa & Avatar) */}
      <div className="relative h-64 w-full">
        {/* Ảnh bìa */}
        <div className="w-full h-full bg-gradient-to-r from-purple-800 to-yellow-700 bg-cover bg-center shadow-inner" 
             style={{ backgroundImage: `url('/default-cover.jpg')` }}>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Nút Cài đặt & Thông báo */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">🔔
            <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1.5 rounded-full">3</span>
          </button>
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">⚙️</button>
        </div>

        {/* Thông tin Avatar & Tên */}
        <div className="absolute -bottom-16 left-6 flex items-end gap-4 w-full">
          <div className="relative group">
            <img src={user.image || "/avatar.png"} className="w-28 h-28 rounded-2xl border-4 border-black object-cover shadow-2xl" />
            <button className="absolute bottom-0 right-0 bg-yellow-600 p-1.5 rounded-lg border-2 border-black text-xs">📸</button>
          </div>
          <div className="mb-4 flex-1">
            <h2 className="text-2xl font-black tracking-tight leading-tight">Tên Hiển Thị Của Sếp</h2>
            <div className="flex items-center gap-1.5">
              <p className="text-yellow-500 font-bold text-sm">@{user.username}</p>
              <span className="text-[10px] bg-yellow-600/20 text-yellow-500 px-1 rounded border border-yellow-500/30">✅ Pioneer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHỈ SỐ & SOCIAL CONNECT */}
      <div className="mt-20 px-6 flex justify-between items-center">
        <div className="flex gap-6 text-center">
          <div><p className="font-bold">1.2K</p><p className="text-[10px] text-gray-500 uppercase">Bạn bè</p></div>
          <div><p className="font-bold">45K</p><p className="text-[10px] text-gray-500 uppercase">Followers</p></div>
          <div><p className="font-bold">89</p><p className="text-[10px] text-gray-500 uppercase">Following</p></div>
        </div>
        <div className="flex gap-2">
          {['fb', 'tt', 'yt'].map(s => (
            <button key={s} className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-xs grayscale hover:grayscale-0">🔗</button>
          ))}
        </div>
      </div>

      {/* 3. DANH MỤC TAB (Sticky Menu) */}
      <div className="mt-8 sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-gray-900 flex justify-around">
        {[
          { id: 'videos', label: 'Video', icon: '🎥' },
          { id: 'store', label: 'Sản phẩm', icon: '🛍️' },
          { id: 'cart', label: 'Giỏ hàng', icon: '🛒' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`py-4 flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === t.id ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
          </button>
        ))}
      </div>

      {/* 4. GRID CONTENT */}
      <div className="p-1 min-h-[400px]">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6].map(v => (
              <div key={v} className="aspect-[9/16] bg-gray-900 rounded-sm animate-pulse flex items-center justify-center text-[10px] text-gray-800 underline">Loading...</div>
            ))}
          </div>
        )}
        {/* Các Tab khác sẽ code chi tiết sau */}
      </div>

      {/* 5. BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-black/90 backdrop-blur-2xl border-t border-gray-900 flex justify-around items-center py-3 px-2 z-50">
        <button className="text-xl grayscale opacity-50">🏠</button>
        <button className="text-xl grayscale opacity-50">🎬</button>
        <button className="w-14 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">＋</button>
        <button className="text-xl grayscale opacity-50">💬</button>
        <button className="text-xl border-b-2 border-yellow-500 pb-1">👤</button>
      </nav>
    </div>
  );
}
