'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  // 1. Quản lý trạng thái
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Thông tin Profile
  const [profile, setProfile] = useState({
    displayName: user?.display_name || user?.username || "Pioneer",
    bio: user?.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user?.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
  });

  // 3. Hàm lưu thông tin Tên và Tiểu sử
  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username || "DANG21986",
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Đã lưu vào Database! 🫡");
        setMenuType('NONE');
      }
    } catch (e) {
      alert("❌ Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  // 4. Hàm xử lý Upload ảnh
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
        const field = drawerTarget === 'avatar' ? 'avatar_url' : 'cover_url';
        setProfile(prev => ({ ...prev, [drawerTarget]: data.url }));

        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user?.username || "DANG21986",
            [field]: data.url
          }),
        });
        alert("✅ Đã cập nhật ảnh! 🫡");
      }
    } catch (err) {
      alert("❌ Lỗi tải ảnh!");
    } finally {
      setMenuType('NONE');
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header Profile */}
      <div style={{ position: 'relative', height: '180px' }}>
        <div 
          onClick={() => { setDrawerTarget('cover'); setMenuType('DRAWER'); }}
          style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover`, cursor: 'pointer' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }}></div>
        </div>

        {/* Info & Avatar (Kích thước giảm theo yêu cầu) */}
        <div style={{ position: 'absolute', bottom: '10px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={() => { setDrawerTarget('avatar'); setMenuType('DRAWER'); }} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={profile.avatar} style={{ width: '55px', height: '55px', borderRadius: '12px', border: '2px solid #eab308', objectFit: 'cover' }} alt="avt" />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '11px', margin: 0 }}>@{user?.username || "pioneer"}</p>
          </div>
        </div>

        <button onClick={() => setMenuType('MAIN')} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', color: '#fff' }}>⚙️</button>
      </div>

      {/* Bio Section */}
      <div style={{ padding: '15px' }}>
        <p style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.4' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#888' }}>
          <span><strong>1.2K</strong> Bạn bè</span>
          <span><strong>45K</strong> Follower</span>
        </div>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* Overlay Menus */}
      {menuType !== 'NONE' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: menuType === 'DRAWER' ? 'flex-end' : 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#111', padding: '20px', borderRadius: menuType === 'DRAWER' ? '20px 20px 0 0' : '12px', border: '1px solid #222' }}>
            
            {menuType === 'DRAWER' ? (
              <>
                <button style={btnStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ thiết bị</button>
                <button style={{...btnStyle, background: 'none', color: '#ff4444'}} onClick={() => setMenuType('NONE')}>Hủy</button>
              </>
            ) : menuType === 'EDIT_PROFILE' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input style={inputStyle} value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} placeholder="Tên hiển thị" />
                <textarea style={{...inputStyle, height: '80px'}} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tiểu sử" />
                <button onClick={handleSaveInfo} style={btnStyle}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              </div>
            ) : (
              <button style={btnStyle} onClick={() => setMenuType('EDIT_PROFILE')}>👤 Chỉnh sửa thông tin</button>
            )}
            
            <button onClick={() => setMenuType('NONE')} style={{ width: '100%', background: 'none', border: 'none', color: '#555', marginTop: '10px' }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', background: '#000', border: '1px solid #333', padding: '10px', color: '#fff', borderRadius: '8px' };
const btnStyle = { width: '100%', background: '#eab308', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' as const, marginBottom: '8px' };
          
