'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo state từ dữ liệu user truyền vào
  const [profile, setProfile] = useState({
    displayName: user?.display_name || "Pioneer",
    bio: user?.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user?.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
  });

  const openDrawer = (target: 'avatar' | 'cover') => {
    setDrawerTarget(target);
    setMenuType('DRAWER');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await uploadRes.json();

      if (data.url) {
        const updateField = drawerTarget === 'avatar' ? 'avatar_url' : 'cover_url';
        
        // 1. Cập nhật giao diện ngay lập tức
        setProfile(prev => ({ ...prev, [drawerTarget]: data.url }));

        // 2. Lưu vào MongoDB (Dùng pi_id để khớp với server)
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pi_id: user.username, // Gửi username để server tìm bản ghi
            [updateField]: data.url
          }),
        });
        
        alert("✅ Báo cáo sếp: Ảnh đã được khóa vĩnh viễn! 🫡");
      }
    } catch (e) {
      alert("❌ Lỗi tải ảnh!");
    } finally {
      setMenuType('NONE');
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: user.username,
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });

      if (response.ok) {
        alert("✅ Dữ liệu đã được khóa vào hệ thống! 🫡");
        setMenuType('NONE');
      } else {
        throw new Error();
      }
    } catch (e) {
      alert("❌ Lỗi lưu thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ position: 'relative', height: '220px' }}>
        <div onClick={() => openDrawer('cover')} style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover`, cursor: 'pointer' }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 10%, transparent 70%)' }}></div>
           <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '50%' }}>🖋️</div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', left: '15px', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 10 }}>
          <div onClick={() => openDrawer('avatar')} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={profile.avatar} style={{ width: '85px', height: '85px', borderRadius: '25px', border: '3px solid #eab308', objectFit: 'cover' }} alt="avatar" />
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#eab308', borderRadius: '50%', padding: '4px', border: '2px solid #000' }}>📷</div>
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '13px', margin: '4px 0' }}>@{user.username} <span style={{background:'#eab30822', padding:'2px 6px', borderRadius:'5px'}}>Pioneer ✅</span></p>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', right: '15px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setMenuType('MAIN')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>⚙️</button>
        </div>
      </div>

      {/* BIO & STATS */}
      <div style={{ padding: '20px 15px' }}>
        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '25px', fontSize: '14px', color: '#888' }}>
          <span><strong style={{color:'#fff'}}>1.2K</strong> Bạn bè</span>
          <span><strong style={{color:'#fff'}}>45K</strong> Follower</span>
        </div>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* DRAWER NGĂN KÉO CHỌN ẢNH */}
      {menuType === 'DRAWER' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#181818', borderRadius: '25px 25px 0 0', padding: '30px 20px', borderTop: '2px solid #eab308' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '25px', color: '#eab308' }}>Thay đổi {drawerTarget === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'}</h3>
            <button style={menuButtonStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn ảnh từ thư viện</button>
            <button style={{ ...menuButtonStyle, color: '#ff4444', marginTop: '12px', border: 'none' }} onClick={() => setMenuType('NONE')}>HỦY BỎ</button>
          </div>
        </div>
      )}

      {/* MENU CÀI ĐẶT & CHỈNH SỬA */}
      {['MAIN', 'EDIT_PROFILE'].includes(menuType) && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000, padding: '40px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#eab308', margin: 0, fontSize: '24px' }}>{menuType === 'MAIN' ? 'CÀI ĐẶT' : 'CHỈNH SỬA HỒ SƠ'}</h2>
            <button onClick={() => setMenuType('NONE')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '28px' }}>✕</button>
          </div>

          {menuType === 'MAIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setMenuType('EDIT_PROFILE')} style={menuButtonStyle}>👤 Chỉnh sửa thông tin cá nhân</button>
              <button style={menuButtonStyle}>💳 Quản lý Ví Pi (Mainnet)</button>
              <button style={menuButtonStyle}>🌐 Liên kết mạng xã hội</button>
            </div>
          )}

          {menuType === 'EDIT_PROFILE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={labelStyle}>TÊN HIỂN THỊ MỚI</label>
                <input style={inputStyle} value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} placeholder="Nhập tên..." />
              </div>
              <div>
                <label style={labelStyle}>TIỂU SỬ</label>
                <textarea style={{ ...inputStyle, height: '120px', resize: 'none' }} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Viết gì đó về bạn..." />
              </div>
              <button onClick={handleSaveInfo} style={saveButtonStyle}>{loading ? 'ĐANG LƯU...' : 'XÁC NHẬN LƯU'}</button>
            </div>
          )}
        </div>
      )}

      {/* TABS GRID */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000', zIndex: 5 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '14px', color: activeTab === tab ? '#eab308' : '#555', borderBottom: activeTab === tab ? '2px solid #eab308' : 'none', fontWeight: activeTab === tab ? 'bold' : 'normal' }}>{tab}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '1px' }}>
        {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} style={{ aspectRatio: '9/16', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '10px' }}>TRỐNG</div>)}
      </div>
    </div>
  );
}

const menuButtonStyle = { width: '100%', textAlign: 'left' as const, background: '#111', border: '1px solid #222', padding: '18px', borderRadius: '15px', color: '#eee', fontSize: '15px' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#eab308', marginBottom: '10px', fontWeight: 'bold' as const };
const inputStyle = { width: '100%', background: '#111', border: '1px solid #333', padding: '18px', color: '#fff', borderRadius: '15px', fontSize: '16px' };
const saveButtonStyle = { background: '#eab308', color: '#000', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: 'bold' as const, fontSize: '16px', marginTop: '10px' };
                                                                     
