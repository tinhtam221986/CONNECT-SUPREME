'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State quản lý thông tin Profile
  const [profile, setProfile] = useState({
    displayName: user.display_name || "Pioneer Mới",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user.image || "/default-avatar.png",
    cover: "/default-cover.jpg"
  });

  // HÀM LƯU THÔNG TIN VÀO MONGODB 🚀
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: user.username, 
          display_name: profile.displayName,
          bio: profile.bio,
          avatar_url: profile.avatar,
          cover_url: profile.cover
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Báo cáo sếp: Đã lưu thông tin thành công! 🫡");
        setIsEditing(false);
      } else {
        alert("❌ Lỗi từ hệ thống: " + result.error);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("❌ Lỗi kết nối server, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans">
      {/* 📸 ẢNH BÌA */}
      <div className="relative h-60 w-full group overflow-hidden bg-gray-900">
        <img src={profile.cover} className="w-full h-full object-cover opacity-70" />
        <div className="absolute top-4 right-4 flex gap-3">
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">🔔</button>
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">⚙️</button>
        </div>
      </div>

      {/* 👤 AVATAR & THÔNG TIN CHÍNH */}
      <div className="px-6 -mt-12 relative flex flex-col items-start">
        <div className="relative group">
          <img src={profile.avatar} className="w-28 h-28 rounded-3xl border-4 border-black object-cover shadow-2xl" />
          <div className="absolute bottom-2 right-2 bg-yellow-500 p-2 rounded-xl border-2 border-black cursor-pointer shadow-lg hover:scale-110 transition-transform">
            📸
          </div>
        </div>

        <div className="mt-4 w-full">
          {isEditing ? (
            <div className="flex flex-col gap-3 w-full bg-gray-900/50 p-4 rounded-2xl border border-yellow-500/30">
              <label className="text-yellow-500 text-[10px] font-bold uppercase">Tên hiển thị tùy chỉnh</label>
              <input 
                autoFocus
                className="bg-transparent border-b border-yellow-500 text-2xl font-black w-full outline-none pb-1"
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              />
              <label className="text-yellow-500 text-[10px] font-bold uppercase mt-2">Tiểu sử cá nhân</label>
              <input 
                className="bg-transparent border-b border-gray-700 text-sm w-full outline-none pb-1"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all flex-1"
                >
                  {loading ? "ĐANG LƯU..." : "XÁC NHẬN LƯU 🫡"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-800 text-white px-6 py-2 rounded-xl font-bold text-sm flex-1"
                >
                  HỦY
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start w-full">
              <div>
                <h2 className="text-3xl font-black tracking-tighter" onClick={() => setIsEditing(true)}>
                  {profile.displayName} <span className="text-xs opacity-40 ml-2">✏️</span>
                </h2>
                <p className="text-yellow-500 font-bold">@{user.username} <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/50 px-1 rounded ml-1">✅ Verified</span></p>
                <p className="text-gray-400 text-sm mt-2">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📊 CHỈ SỐ UY TÍN */}
      <div className="flex gap-8 px-6 mt-6 border-y border-gray-900 py-4">
        <div className="text-center"><p className="text-lg font-black">0</p><p className="text-[10px] text-gray-500 uppercase tracking-widest">Bạn bè</p></div>
        <div className="text-center"><p className="text-lg font-black">0</p><p className="text-[10px] text-gray-500 uppercase tracking-widest">Người theo dõi</p></div>
        <div className="text-center"><p className="text-lg font-black">0</p><p className="text-[10px] text-gray-500 uppercase tracking-widest">Đang theo dõi</p></div>
      </div>

      {/* 🔗 SOCIAL CONNECT */}
      <div className="px-6 mt-6 flex gap-3 overflow-x-auto no-scrollbar">
        {['Facebook', 'TikTok', 'YouTube', 'X'].map(social => (
          <button key={social} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold whitespace-nowrap">
            ＋ {social}
          </button>
        ))}
      </div>

      {/* 🏷️ TABS NỘI DUNG */}
      <div className="mt-8 grid grid-cols-3 border-t border-gray-900 sticky top-0 bg-black/90 backdrop-blur-md z-10">
        {['Video', 'Sản phẩm', 'Giỏ hàng'].map((tab, i) => (
          <button key={tab} className={`py-4 text-xs font-black uppercase tracking-widest ${i === 0 ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-0.5 mt-1">
        {[1,2,3].map(i => (
          <div key={i} className="aspect-[9/16] bg-gray-900 animate-pulse flex items-center justify-center text-[10px] text-gray-800">Trống</div>
        ))}
      </div>

      {/* ⚓ NAVIGATION DƯỚI CÙNG */}
      <nav className="fixed bottom-0 w-full bg-black/90 backdrop-blur-2xl border-t border-gray-900 flex justify-around items-center py-4 px-2 z-50">
        <button className="text-xl opacity-40">🏠</button>
        <button className="text-xl opacity-40">🎬</button>
        <button className="w-14 h-10 bg-yellow-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">＋</button>
        <button className="text-xl opacity-40">💬</button>
        <button className="text-xl border-b-2 border-yellow-500 pb-1">👤</button>
      </nav>
    </div>
  );
      }
