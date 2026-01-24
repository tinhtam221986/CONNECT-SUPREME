'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    displayName: user.display_name || "Pioneer Mới",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
  });

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
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Báo cáo sếp: Đã thông mạch dữ liệu! 🫡");
        setIsEditing(false);
      } else {
        alert("❌ Vẫn còn lỗi: " + result.error);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      {/* HEADER ẢNH BÌA */}
      <div style={{ position: 'relative', height: '200px', background: `url(${profile.cover}) center/cover` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
      </div>

      {/* THÔNG TIN CÁ NHÂN */}
      <div style={{ padding: '0 20px', marginTop: '-50px', position: 'relative' }}>
        <img src={profile.avatar} style={{ width: '100px', height: '100px', borderRadius: '25px', border: '4px solid #000', backgroundColor: '#222' }} />
        
        <div style={{ marginTop: '15px' }}>
          {isEditing ? (
            <div style={{ background: '#111', padding: '15px', borderRadius: '15px', border: '1px solid #eab308' }}>
              <p style={{ color: '#eab308', fontSize: '10px', fontWeight: 'bold' }}>TÊN HIỂN THỊ</p>
              <input 
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #eab308', color: '#fff', width: '100%', fontSize: '20px', outline: 'none' }}
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              />
              <p style={{ color: '#eab308', fontSize: '10px', fontWeight: 'bold', marginTop: '15px' }}>TIỂU SỬ</p>
              <input 
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#ccc', width: '100%', outline: 'none' }}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '10px', background: '#eab308', color: '#000', borderRadius: '10px', fontWeight: 'bold', border: 'none' }}>
                  {loading ? 'ĐANG LƯU...' : 'LƯU LẠI 🫡'}
                </button>
                <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', background: '#333', color: '#fff', borderRadius: '10px', border: 'none' }}>HỦY</button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '28px', margin: 0 }}>{profile.displayName} <span onClick={() => setIsEditing(true)} style={{ fontSize: '16px', cursor: 'pointer' }}>✏️</span></h1>
              <p style={{ color: '#eab308', margin: '5px 0' }}>@{user.username} ✅ Pioneer</p>
              <p style={{ color: '#888', fontSize: '14px' }}>{profile.bio}</p>
            </>
          )}
        </div>
      </div>

      {/* NAVIGATION DƯỚI CÙNG */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', padding: '15px 0', background: 'rgba(0,0,0,0.9)', borderTop: '1px solid #222' }}>
        <span>🏠</span> <span>🎬</span> <span style={{ background: '#ca8a04', padding: '5px 15px', borderRadius: '10px' }}>＋</span> <span>💬</span> <span>👤</span>
      </div>
    </div>
  );
                   }
