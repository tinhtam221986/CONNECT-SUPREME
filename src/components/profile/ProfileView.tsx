'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        // Cập nhật giao diện
        setProfile(prev => ({ ...prev, [drawerTarget]: data.url }));

        // Lưu vào MongoDB
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pi_id: user.username,
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
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: user.username,
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });
      alert("✅ Đã cập nhật thông tin! 🫡");
      setMenuType('NONE');
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

        <div style={{ position: 'absolute', bottom: '20px', right: '15px', display: 'flex', gap: '10px' }}>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>🔔</button>
          <button onClick={() => setMenuType('MAIN')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>⚙️</button>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', left: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div onClick={() => openDrawer('avatar')} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={profile.avatar} style={{ width: '75px', height: '75px', borderRadius: '22px', border: '3px solid #eab308', objectFit: 'cover' }} alt="avatar" />
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#eab308', borderRadius: '50%', padding: '4px', border: '2px solid #000', fontSize: '10px' }}>📷</div>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '12px', margin: '4px 0' }}>@{user.username} <span style={{background:'#eab30822', padding:'2px 6px', borderRadius:'5px'}}>Pioneer ✅</span></p>
          </div>
        </div>
      </div>

      {/* BIO & STATS */}
      <div style={{ padding: '15px' }}>
        <p style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '25px', fontSize: '13px', borderTop: '1px solid #111', paddingTop: '15px' }}>
          <span><strong>1.2K</strong> Bạn bè</span>
          <span><strong>45K</strong> Follower</span>
          <span><strong>89</strong> Đang theo dõi</span>
        </div>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* DRAWER NGĂN KÉO */}
      {menuType === 'DRAWER' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#111', borderRadius: '25px 25px 0 0', padding: '25px', borderTop: '2px solid #eab308' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#eab308' }}>Đổi {drawerTarget === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'}</h3>
            <button style={menuButtonStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ thư viện</button>
            <button style={{ ...menuButtonStyle, color: '#ff4444', marginTop: '10px' }} onClick={() => setMenuType('NONE')}>HỦY</button>
          </div>
        </div>
      )}

      {/* OVERLAY MENUS */}
      {['MAIN', 'EDIT_PROFILE'].includes(menuType) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 1000, padding: '40px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h2 style={{ color: '#eab308', margin: 0 }}>{menuType === 'MAIN' ? 'CÀI ĐẶT' : 'CHỈNH SỬA'}</h2>
            <button onClick={() => setMenuType('NONE')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>✕</button>
          </div>

          {menuType === 'MAIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setMenuType('EDIT_PROFILE')} style={menuButtonStyle}>👤 Chỉnh sửa thông tin</button>
              <button style={menuButtonStyle}>💳 Ví Pi (Mainnet)</button>
            </div>
          )}

          {menuType === 'EDIT_PROFILE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div><label style={labelStyle}>TÊN HIỂN THỊ</label><input style={inputStyle} value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} /></div>
              <div><label style={labelStyle}>TIỂU SỬ</label><textarea style={{ ...inputStyle, height: '100px' }} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} /></div>
              <button onClick={handleSaveInfo} style={saveButtonStyle}>{loading ? 'ĐANG LƯU...' : 'XÁC NHẬN LƯU'}</button>
            </div>
          )}
        </div>
      )}

      {/* TABS GRID */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000' }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '13px', color: activeTab === tab ? '#eab308' : '#555', borderBottom: activeTab === tab ? '2px solid #eab308' : 'none' }}>{tab}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: '9/16', background: '#080808' }}></div>)}
      </div>
    </div>
  );
}

const menuButtonStyle = { width: '100%', textAlign: 'left' as const, background: '#111', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#eee' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#eab308', marginBottom: '8px' };
const inputStyle = { width: '100%', background: '#111', border: '1px solid #333', padding: '15px', color: '#fff', borderRadius: '12px' };
const saveButtonStyle = { background: '#eab308', color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold' as const };
                     
