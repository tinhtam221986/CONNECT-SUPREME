'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    displayName: user?.display_name || user?.username || "Pioneer",
    bio: user?.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user?.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');

  // Hàm lưu thông tin chung
  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });
      if ((await res.json()).success) {
        alert("✅ Dữ liệu đã được khóa vào hệ thống! 🫡");
        setMenuType('NONE');
      }
    } catch (e) { alert("❌ Lỗi kết nối!"); }
    finally { setLoading(false); }
  };

  // Hàm xử lý upload ảnh
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const { url } = await uploadRes.json();

      if (url) {
        const field = drawerTarget === 'avatar' ? 'avatar_url' : 'cover_url';
        setProfile(prev => ({ ...prev, [drawerTarget]: url }));
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username, [field]: url }),
        });
        alert("✅ Ảnh đã được cập nhật!");
      }
    } catch (e) { alert("❌ Lỗi tải ảnh!"); }
    finally { setMenuType('NONE'); setLoading(false); }
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', paddingBottom: '100px' }}>
      {/* Cover Image */}
      <div style={{ height: '180px', position: 'relative', background: `url(${profile.cover}) center/cover` }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }}></div>
        
        {/* Avatar & Name (Reduced size) */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={() => { setDrawerTarget('avatar'); setMenuType('DRAWER'); }} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={profile.avatar} style={{ width: '60px', height: '60px', borderRadius: '15px', border: '2px solid #eab308' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>{profile.displayName}</h2>
            <p style={{ color: '#eab308', fontSize: '12px', margin: 0 }}>@{user.username} <span style={{fontSize: '10px'}}>✅</span></p>
          </div>
        </div>

        {/* Settings Icon */}
        <button onClick={() => setMenuType('MAIN')} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '8px' }}>⚙️</button>
      </div>

      {/* Bio Section */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#ccc', fontSize: '14px' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
          <span><strong>1.2K</strong> Bạn bè</span>
          <span><strong>45K</strong> Follower</span>
        </div>
      </div>

      <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />

      {/* Overlay Menus */}
      {menuType !== 'NONE' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#111', width: '100%', maxWidth: '400px', borderRadius: '15px', padding: '20px', border: '1px solid #222' }}>
            {menuType === 'EDIT_PROFILE' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: '#eab308' }}>Chỉnh sửa hồ sơ</h3>
                <input style={inputStyle} value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} />
                <textarea style={{...inputStyle, height: '80px'}} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                <button onClick={handleSaveInfo} style={btnStyle}>{loading ? 'Đang lưu...' : 'Lưu ngay'}</button>
              </div>
            ) : (
              <button style={btnStyle} onClick={() => setMenuType('EDIT_PROFILE')}>👤 Chỉnh sửa thông tin</button>
            )}
            <button onClick={() => setMenuType('NONE')} style={{ marginTop: '15px', color: '#555', background: 'none', border: 'none', width: '100%' }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', background: '#000', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '8px' };
const btnStyle = { width: '100%', background: '#eab308', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' as const };
          
