'use client';
import { useState, useRef, useEffect } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo thông tin từ props user (Đảm bảo lấy đúng từ DB nếu có)
  const [profile, setProfile] = useState({
    displayName: user?.display_name || user?.username || "Pioneer",
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
        
        // 1. Cập nhật UI ngay
        setProfile(prev => ({ ...prev, [drawerTarget]: data.url }));

        // 2. Lưu vào DB - Gửi cả username và piUid để server chắc chắn tìm thấy
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pi_id: user.username,
            uid: user.piUid,
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
          uid: user.piUid,
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });

      if (response.ok) {
        alert("✅ Dữ liệu đã được khóa vào hệ thống! 🫡");
        setMenuType('NONE');
      }
    } catch (e) {
      alert("❌ Lỗi lưu thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* HEADER: Chứa Ảnh bìa & Nút thông báo */}
      <div style={{ position: 'relative', height: '220px' }}>
        <div 
          onClick={() => openDrawer('cover')} 
          style={{ 
            position: 'absolute', inset: 0, 
            background: `url(${profile.cover}) center/cover no-repeat`, 
            cursor: 'pointer' 
          }}
        >
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 15%, transparent 80%)' }}></div>
           {/* Nút sửa ảnh bìa */}
           <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%', zIndex: 10 }}>🖋️</div>
        </div>

        {/* Cụm Nút Thông báo & Cài đặt */}
        <div style={{ position: 'absolute', bottom: '20px', right: '15px', display: 'flex', gap: '12px', zIndex: 20 }}>
          <button style={iconButtonStyle}>🔔</button>
          <button onClick={() => setMenuType('MAIN')} style={iconButtonStyle}>⚙️</button>
        </div>

        {/* Ảnh đại diện & Tên */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 20 }}>
          <div onClick={() => openDrawer('avatar')} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={profile.avatar} style={{ width: '85px', height: '85px', borderRadius: '25px', border: '3px solid #eab308', objectFit: 'cover' }} alt="avatar" />
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#eab308', borderRadius: '50%', padding: '5px', border: '2px solid #000' }}>
               <span style={{fontSize:'10px'}}>📷</span>
            </div>
          </div>
          <div style={{textShadow: '0px 2px 4px rgba(0,0,0,0.8)'}}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '13px', margin: '4px 0' }}>@{user.username} <span style={{background:'#eab30822', padding:'2px 6px', borderRadius:'5px'}}>Pioneer ✅</span></p>
          </div>
        </div>
      </div>

      {/* THÔNG SỐ: Follower & Bio */}
      <div style={{ padding: '15px 20px' }}>
        <div style={{ display: 'flex', gap: '25px', fontSize: '14px', marginBottom: '15px' }}>
          <span><strong style={{color:'#fff'}}>1.2K</strong> Bạn bè</span>
          <span><strong style={{color:'#fff'}}>45K</strong> Follower</span>
          <span style={{color: '#888'}}><strong style={{color:'#fff'}}>89</strong> Đang theo dõi</span>
        </div>
        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{profile.bio}</p>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* TABS GRID */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000', zIndex: 30 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ 
            flex: 1, textAlign: 'center', padding: '15px', fontSize: '14px', 
            color: activeTab === tab ? '#eab308' : '#555', 
            borderBottom: activeTab === tab ? '2px solid #eab308' : 'none',
            fontWeight: activeTab === tab ? 'bold' : 'normal' 
          }}>{tab}</div>
        ))}
      </div>

      {/* NỘI DUNG GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '1px' }}>
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} style={{ aspectRatio: '9/16', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '11px' }}>
            TRỐNG
          </div>
        ))}
      </div>

      {/* OVERLAY: CÀI ĐẶT & CHỈNH SỬA (Z-INDEX CAO NHẤT) */}
      {['MAIN', 'EDIT_PROFILE', 'DRAWER'].includes(menuType) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: menuType === 'DRAWER' ? 'flex-end' : 'center', justifyContent: 'center' }}>
          
          {/* Ngăn kéo chọn ảnh */}
          {menuType === 'DRAWER' && (
            <div style={{ width: '100%', background: '#181818', borderRadius: '25px 25px 0 0', padding: '30px 20px', borderTop: '2px solid #eab308' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '25px', color: '#eab308' }}>Đổi {drawerTarget === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'}</h3>
              <button style={menuButtonStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ điện thoại</button>
              <button style={{ ...menuButtonStyle, color: '#ff4444', marginTop: '12px', border: 'none' }} onClick={() => setMenuType('NONE')}>HỦY BỎ</button>
            </div>
          )}

          {/* Form chỉnh sửa */}
          {(menuType === 'MAIN' || menuType === 'EDIT_PROFILE') && (
            <div style={{ width: '90%', background: '#111', borderRadius: '20px', padding: '25px', border: '1px solid #222' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h2 style={{ color: '#eab308', margin: 0 }}>{menuType === 'MAIN' ? 'CÀI ĐẶT' : 'HỒ SƠ'}</h2>
                  <button onClick={() => setMenuType('NONE')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>✕</button>
               </div>
               
               {menuType === 'MAIN' ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => setMenuType('EDIT_PROFILE')} style={menuButtonStyle}>👤 Sửa thông tin</button>
                    <button style={menuButtonStyle}>💳 Ví Pi</button>
                 </div>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input style={inputStyle} value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} placeholder="Tên hiển thị..." />
                    <textarea style={{ ...inputStyle, height: '100px' }} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Tiểu sử..." />
                    <button onClick={handleSaveInfo} style={saveButtonStyle}>{loading ? 'ĐANG LƯU...' : 'XÁC NHẬN LƯU'}</button>
                 </div>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// STYLES
const iconButtonStyle = { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' };
const menuButtonStyle = { width: '100%', textAlign: 'left' as const, background: '#1a1a1a', border: '1px solid #333', padding: '16px', borderRadius: '12px', color: '#eee' };
const inputStyle = { width: '100%', background: '#000', border: '1px solid #eab308', padding: '15px', color: '#fff', borderRadius: '12px' };
const saveButtonStyle = { background: '#eab308', color: '#000', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold' as const };
                        
