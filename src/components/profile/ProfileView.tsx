'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');

  const [profile, setProfile] = useState({
    displayName: user.display_name || "Pioneer",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
    reason: "" // Lý do đổi tên
  });

  // HÀM LƯU DỮ LIỆU & ĐÓNG MENU 🧠
  const handleSaveSettings = async () => {
    if (!profile.displayName.trim()) return alert("Tên không được để trống!");
    
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
        alert("✅ Báo cáo sếp: Dữ liệu đã được khóa vào hệ thống! 🫡");
        setMenuType('NONE'); // Đóng menu ngay khi thành công
      }
    } catch (e) { 
      alert("❌ Lỗi mạch máu dữ liệu!"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* 📸 HEADER SECTION */}
      <div style={{ position: 'relative', height: '220px' }}>
        <div style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover` }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 10%, transparent 70%)' }}></div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', right: '15px', display: 'flex', gap: '10px' }}>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>🔔</button>
          <button onClick={() => setMenuType('MAIN')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>⚙️</button>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', left: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={profile.avatar} style={{ width: '75px', height: '75px', borderRadius: '22px', border: '3px solid #eab308', objectFit: 'cover' }} alt="avatar" />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '12px', margin: '4px 0' }}>@{user.username} <span style={{background:'#eab30822', padding:'2px 6px', borderRadius:'5px'}}>Pioneer ✅</span></p>
          </div>
        </div>
      </div>

      {/* 📝 BIO & STATS */}
      <div style={{ padding: '0 15px 15px 15px' }}>
        <p style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '25px', fontSize: '13px', borderTop: '1px solid #111', paddingTop: '15px' }}>
          <span><strong>1.2K</strong> Bạn bè</span>
          <span><strong>45K</strong> Follower</span>
          <span><strong>89</strong> Đang theo dõi</span>
        </div>
      </div>

      {/* ⚙️ OVERLAY MENU HỆ THỐNG */}
      {menuType !== 'NONE' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 1000, padding: '40px 20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#eab308', margin: 0 }}>{menuType === 'MAIN' ? 'CÀI ĐẶT HỆ THỐNG' : 'CHỈNH SỬA HỒ SƠ'}</h2>
            <button onClick={() => setMenuType('NONE')} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px' }}>✕</button>
          </div>

          {/* MENU CHÍNH (MAIN SETTINGS) */}
          {menuType === 'MAIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setMenuType('EDIT_PROFILE')} style={menuButtonStyle}>👤 Chỉnh sửa thông tin cá nhân</button>
              <button style={menuButtonStyle}>💳 Quản lý Ví Pi (Mainnet)</button>
              <button style={menuButtonStyle}>🌐 Liên kết mạng xã hội</button>
              <button style={menuButtonStyle}>🔒 Bảo mật & Riêng tư</button>
              <button style={{ ...menuButtonStyle, color: '#ff4444', marginTop: '20px' }}>🚪 Đăng xuất</button>
            </div>
          )}

          {/* TRANG CHỈNH SỬA (EDIT PROFILE) */}
          {menuType === 'EDIT_PROFILE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>TÊN HIỂN THỊ MỚI</label>
                <input style={inputStyle} value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>LÝ DO THAY ĐỔI (BẮT BUỘC)</label>
                <input style={inputStyle} placeholder="Nhập lý do để xét duyệt..." value={profile.reason} onChange={(e) => setProfile({...profile, reason: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>TIỂU SỬ</label>
                <textarea style={{ ...inputStyle, height: '100px' }} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleSaveSettings} style={saveButtonStyle}>{loading ? 'ĐANG LƯU...' : 'XÁC NHẬN LƯU'}</button>
                <button onClick={() => setMenuType('MAIN')} style={cancelButtonStyle}>QUAY LẠI</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABS GRID (Videos, Cửa hàng, v.v.) */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000', zIndex: 10 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '13px', fontWeight: 'bold', color: activeTab === tab ? '#eab308' : '#555', borderBottom: activeTab === tab ? '2px solid #eab308' : 'none' }}>{tab}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', minHeight: '400px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ aspectRatio: '9/16', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '10px' }}>TRỐNG</div>
        ))}
      </div>
    </div>
  );
}

// STYLES OBJECTS
const menuButtonStyle = { width: '100%', textAlign: 'left' as const, background: '#111', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#eee', fontSize: '14px', cursor: 'pointer' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#eab308', marginBottom: '8px', fontWeight: 'bold' as const };
const inputStyle = { width: '100%', background: '#111', border: '1px solid #333', padding: '15px', color: '#fff', borderRadius: '12px', outline: 'none' };
const saveButtonStyle = { flex: 2, background: '#eab308', color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold' as const };
const cancelButtonStyle = { flex: 1, background: '#222', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px' };
        
