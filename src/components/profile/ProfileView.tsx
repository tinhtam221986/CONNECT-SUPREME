'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    displayName: user?.display_name || user?.username || "Pioneer",
    bio: user?.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user?.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
  });

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
        setProfile(prev => ({ ...prev, [drawerTarget]: data.url }));
        
        // Lưu trực tiếp vào DB
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pi_id: user.username, [updateField]: data.url }),
        });
        alert("✅ Đã khóa ảnh vào hệ thống! 🫡");
      }
    } catch (e) { alert("❌ Lỗi tải ảnh!"); }
    finally { setMenuType('NONE'); setLoading(false); }
  };

  const handleSaveInfo = async () => {
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
      if (res.ok) { alert("✅ Đã lưu tên và tiểu sử! 🫡"); setMenuType('NONE'); }
    } catch (e) { alert("❌ Lỗi kết nối!"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingBottom: '120px' }}>
      {/* HEADER SECTION */}
      <div style={{ position: 'relative', height: '180px' }}>
        <div onClick={() => {setDrawerTarget('cover'); setMenuType('DRAWER');}} style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover` }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 10%, transparent 90%)' }}></div>
        </div>

        {/* AVATAR & TÊN (Đã giảm 2/3 kích thước) */}
        <div style={{ position: 'absolute', bottom: '10px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={() => {setDrawerTarget('avatar'); setMenuType('DRAWER');}} style={{ position: 'relative' }}>
            <img src={profile.avatar} style={{ width: '55px', height: '55px', borderRadius: '15px', border: '2px solid #eab308', objectFit: 'cover' }} alt="avatar" />
            <div style={{ position: 'absolute', bottom: '-3px', right: '-3px', background: '#eab308', borderRadius: '50%', padding: '3px', border: '1px solid #000', fontSize: '8px' }}>📷</div>
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '11px', margin: '2px 0' }}>@{user.username}</p>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px' }}>
          <button style={circleBtn}>🔔</button>
          <button onClick={() => setMenuType('MAIN')} style={circleBtn}>⚙️</button>
        </div>
      </div>

      {/* STATS & BIO */}
      <div style={{ padding: '15px' }}>
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', marginBottom: '12px', color: '#888' }}>
          <span><strong style={{color:'#fff'}}>1.2K</strong> Bạn bè</span>
          <span><strong style={{color:'#fff'}}>45K</strong> Follower</span>
        </div>
        <p style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5' }}>{profile.bio}</p>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* TABS GRID */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', background: '#000', position: 'sticky', top: 0, zIndex: 10 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: '13px', color: activeTab === tab ? '#eab308' : '#555', borderBottom: activeTab === tab ? '2px solid #eab308' : 'none' }}>{tab}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: '9/16', background: '#0a0a0a' }}></div>)}
      </div>

      {/* OVERLAY MENUS */}
      {menuType !== 'NONE' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: menuType === 'DRAWER' ? 'flex-end' : 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#111', padding: '20px', borderRadius: menuType === 'DRAWER' ? '20px 20px 0 0' : '15px', border: '1px solid #222' }}>
            {menuType === 'DRAWER' ? (
              <>
                <button style={menuBtn} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ máy</button>
                <button style={{...menuBtn, color: '#ff4444', border: 'none'}} onClick={() => setMenuType('NONE')}>Hủy</button>
              </>
            ) : menuType === 'EDIT_PROFILE' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input style={inputSty} value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} />
                <textarea style={{...inputSty, height: '80px'}} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                <button onClick={handleSaveInfo} style={saveBtn}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              </div>
            ) : (
              <button style={menuBtn} onClick={() => setMenuType('EDIT_PROFILE')}>👤 Chỉnh sửa thông tin</button>
            )}
            {menuType !== 'DRAWER' && <button onClick={() => setMenuType('NONE')} style={{marginTop: '15px', width: '100%', background: 'none', border: 'none', color: '#555'}}>Đóng</button>}
          </div>
        </div>
      )}
    </div>
  );
}

const circleBtn = { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', color: '#fff' };
const menuBtn = { width: '100%', textAlign: 'left' as const, background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '8px' };
const inputSty = { width: '100%', background: '#000', border: '1px solid #eab308', padding: '12px', color: '#fff', borderRadius: '10px' };
const saveBtn = { background: '#eab308', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold' as const };
                         
