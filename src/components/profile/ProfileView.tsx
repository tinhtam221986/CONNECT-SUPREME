'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    displayName: user.display_name || "Tịnh Tâm",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
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
      if (result.success) { alert("✅ Đã lưu thành công! 🫡"); setIsEditing(false); }
    } catch (error) { alert("❌ Lỗi kết nối."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '90px', overflowY: 'auto' }}>
      
      {/* 📸 PHẦN ĐẦU: COVER + AVATAR + INFO (GỌN NHẸ) */}
      <div style={{ position: 'relative', height: '240px' }}>
        {/* Ảnh bìa */}
        <div style={{ height: '180px', background: `url(${profile.cover}) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}></div>
          
          {/* Nút Cài đặt & Chuông (Góc trên) */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px' }}>
             <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', color: '#fff' }}>🔔</button>
             <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', color: '#fff' }}>⚙️</button>
          </div>
        </div>

        {/* Cụm Avatar & Tên (Nằm lồng vào ảnh bìa như sếp yêu cầu) */}
        <div style={{ position: 'absolute', bottom: '10px', left: '20px', display: 'flex', alignItems: 'flex-end', gap: '15px', width: '90%' }}>
          <img src={profile.avatar} style={{ width: '75px', height: '75px', borderRadius: '18px', border: '3px solid #000', backgroundColor: '#111' }} />
          
          <div style={{ paddingBottom: '5px', flex: 1 }}>
            {isEditing ? (
              <input 
                style={{ background: '#111', border: '1px solid #eab308', color: '#fff', borderRadius: '5px', padding: '2px 5px', width: '80%' }}
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              />
            ) : (
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>
                {profile.displayName} <span onClick={() => setIsEditing(true)} style={{ fontSize: '12px', cursor: 'pointer', opacity: 0.6 }}>✏️</span>
              </h1>
            )}
            <p style={{ color: '#eab308', fontSize: '12px', margin: '2px 0', fontWeight: '300' }}>@{user.username} ✅ Pioneer</p>
          </div>
        </div>
      </div>

      {/* 📝 TIỂU SỬ NHỎ GỌN */}
      <div style={{ padding: '0 20px', marginBottom: '15px' }}>
        <p style={{ color: '#aaa', fontSize: '12px', lineHeight: '1.4', margin: 0 }}>{profile.bio}</p>
        {isEditing && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
            <button onClick={handleSave} style={{ background: '#eab308', border: 'none', padding: '5px 15px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold' }}>{loading ? '...' : 'LƯU'}</button>
            <button onClick={() => setIsEditing(false)} style={{ background: '#222', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px', fontSize: '11px' }}>HỦY</button>
          </div>
        )}
      </div>

      {/* 📊 CHỈ SỐ RÚT GỌN (DÀN HÀNG NGANG) */}
      <div style={{ display: 'flex', gap: '20px', padding: '0 20px', marginBottom: '20px', fontSize: '11px', opacity: 0.8 }}>
        <span><strong>1.2K</strong> Bạn bè</span>
        <span><strong>45K</strong> Follower</span>
        <span><strong>89</strong> Đang theo dõi</span>
      </div>

      {/* 🏷️ TABS CHUYỂN ĐỔI (Dính phía trên khi cuộn) */}
      <div style={{ position: 'sticky', top: 0, display: 'flex', background: '#000', borderBottom: '1px solid #111', zIndex: 10 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map((tab, i) => (
          <div key={tab} style={{ flex: 1, textAlign: 'center', padding: '12px 0', fontSize: '12px', fontWeight: 'bold', borderBottom: i === 0 ? '2px solid #eab308' : 'none', color: i === 0 ? '#eab308' : '#555' }}>
            {tab}
          </div>
        ))}
      </div>

      {/* 🎞️ KHÔNG GIAN TRƯNG BÀY (VUỐT CUỘN THOẢI MÁI) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '1px' }}>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(item => (
          <div key={item} style={{ aspectRatio: '9/14', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#222', border: '0.1px solid #111' }}>
            TRỐNG
          </div>
        ))}
      </div>

      {/* ⚓ NAVIGATION BAR CHUẨN (CỐ ĐỊNH) */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 25px 0', background: 'rgba(0,0,0,0.95)', borderTop: '1px solid #111', zIndex: 100 }}>
        <span style={{ fontSize: '20px', opacity: 0.5 }}>🏠</span>
        <span style={{ fontSize: '20px', opacity: 0.5 }}>🎬</span>
        <div style={{ background: 'linear-gradient(45deg, #ca8a04, #eab308)', width: '45px', height: '35px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', fontSize: '20px' }}>＋</div>
        <span style={{ fontSize: '20px', opacity: 0.5 }}>💬</span>
        <span style={{ fontSize: '20px', borderBottom: '2px solid #eab308' }}>👤</span>
      </div>

    </div>
  );
        }
                                  
