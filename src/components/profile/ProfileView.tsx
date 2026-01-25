'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');

  const [profile, setProfile] = useState({
    displayName: user.display_name || "Pioneer",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
  });

  // HÀM LƯU DỮ LIỆU CHÍNH 🦾
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: user.username,
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Báo cáo sếp: Hồ sơ đã được cập nhật vĩnh viễn! 🫡");
        setShowSettings(false);
      }
    } catch (e) { alert("❌ Lỗi kết nối mạch máu!"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* 📸 HEADER & CHỨC NĂNG THAY ẢNH NHANH */}
      <div style={{ position: 'relative', height: '210px' }}>
        <div style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover` }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 5%, transparent 60%)' }}></div>
        </div>

        {/* Nút Thay ảnh bìa nhanh 📸 */}
        <div onClick={() => alert("Mở thư viện ảnh bìa...")} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}>📸 Chỉnh sửa bìa</div>

        <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', gap: '8px' }}>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', padding: '10px' }}>🔔</button>
          <button onClick={() => setShowSettings(true)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', padding: '10px' }}>⚙️</button>
        </div>

        <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
             <img src={profile.avatar} style={{ width: '65px', height: '65px', borderRadius: '18px', border: '2px solid #eab308' }} />
             <div onClick={() => alert("Mở thư viện ảnh đại diện...")} style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#eab308', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', cursor: 'pointer' }}>📸</div>
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '11px', margin: 0 }}>@{user.username} ✅ Pioneer</p>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CHI TIẾT */}
      <div style={{ padding: '15px', borderBottom: '1px solid #111' }}>
        <p style={{ color: '#888', fontSize: '12px', margin: '0 0 10px 0' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
          <span><strong>1.2K</strong> Bạn bè</span>
          <span><strong>45K</strong> Follower</span>
        </div>
      </div>

      {/* ⚙️ PANEL CÀI ĐẶT CÁ NHÂN (POPUP) */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, padding: '30px 20px' }}>
          <h2 style={{ color: '#eab308' }}>Cài đặt hồ sơ ⚙️</h2>
          <p style={{ fontSize: '12px', color: '#555' }}>Lưu ý: Thay đổi tên cần có lý do chính đáng và xét duyệt.</p>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#888' }}>TÊN HIỂN THỊ MỚI</label>
            <input 
              style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '8px', marginTop: '5px' }}
              value={profile.displayName}
              onChange={(e) => setProfile({...profile, displayName: e.target.value})}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#888' }}>TIỂU SỬ</label>
            <textarea 
              style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '8px', marginTop: '5px', height: '80px' }}
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
            />
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button onClick={handleSaveSettings} style={{ flex: 1, background: '#eab308', color: '#000', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold' }}>
              {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN THAY ĐỔI'}
            </button>
            <button onClick={() => setShowSettings(false)} style={{ flex: 1, background: '#222', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px' }}>HỦY</button>
          </div>
        </div>
      )}

      {/* TABS & GRID (Giữ nguyên như cũ) */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111' }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '12px', color: activeTab === tab ? '#eab308' : '#555', borderBottom: activeTab === tab ? '2px solid #eab308' : 'none' }}>{tab}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: '9/15', background: '#050505' }}></div>)}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', padding: '15px 0 25px 0', background: 'rgba(0,0,0,0.95)', borderTop: '1px solid #111' }}>
        <span>🏠</span><span>🎬</span><div style={{ background: '#eab308', width: '45px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>＋</div><span>💬</span><span>👤</span>
      </div>
    </div>
  );
            }
              
