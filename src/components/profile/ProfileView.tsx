'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  
  const [profile, setProfile] = useState({
    displayName: user.display_name || "Pioneer",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📸 HÀM MỞ NGĂN KÉO ĐỔI ẢNH
  const openDrawer = (target: 'avatar' | 'cover') => {
    setDrawerTarget(target);
    setMenuType('DRAWER');
  };

  // 📂 HÀM XỬ LÝ CHỌN FILE
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    // Giả lập tạo URL ảnh (Sau này sếp sẽ kết nối Cloudinary hoặc Imbb ở đây)
    const imageUrl = URL.createObjectURL(file);
    
    if (drawerTarget === 'avatar') setProfile({ ...profile, avatar: imageUrl });
    else setProfile({ ...profile, cover: imageUrl });

    // Lưu ngay lập tức vào Database
    await saveToDatabase({ 
      [drawerTarget === 'avatar' ? 'avatar_url' : 'cover_url']: imageUrl 
    });
    
    setMenuType('NONE');
    setLoading(false);
  };

  const saveToDatabase = async (extraData = {}) => {
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pi_id: user.username, ...extraData }),
      });
    } catch (e) { console.error("Lỗi lưu ảnh!"); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* 📸 KHU VỰC ẢNH BÌA */}
      <div style={{ position: 'relative', height: '220px' }}>
        <div 
          onClick={() => openDrawer('cover')}
          style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover`, cursor: 'pointer' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }}></div>
          <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '50%' }}>🖋️</div>
        </div>

        {/* ⚙️ NÚT CÀI ĐẶT TỔNG */}
        <button onClick={() => setMenuType('MAIN')} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff', zIndex: 10 }}>⚙️</button>

        {/* 👤 KHU VỰC AVATAR */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div onClick={() => openDrawer('avatar')} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={profile.avatar} style={{ width: '80px', height: '80px', borderRadius: '25px', border: '3px solid #eab308', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#eab308', borderRadius: '50%', padding: '4px', border: '2px solid #000', fontSize: '10px' }}>📷</div>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '12px', margin: 0 }}>@{user.username} ✅ Pioneer</p>
          </div>
        </div>
      </div>

      {/* 📥 INPUT FILE ẨN */}
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* 🗄️ NGĂN KÉO (BOTTOM DRAWER) */}
      {menuType === 'DRAWER' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#111', borderRadius: '25px 25px 0 0', padding: '25px', borderTop: '2px solid #eab308' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#eab308' }}>
              {drawerTarget === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'} 👤
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button style={drawerBtnStyle} onClick={() => alert("Mở camera...")}>📸 Chụp ảnh trực tiếp</button>
              <button style={drawerBtnStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ thư viện</button>
              <button style={drawerBtnStyle} onClick={() => alert("Đang xem ảnh...")}>👁️ Xem ảnh hiện tại</button>
              <button style={{ ...drawerBtnStyle, color: '#ff4444', border: 'none' }} onClick={() => setMenuType('NONE')}>Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ MENU CHÍNH NHƯ CŨ (Giữ nguyên logic của sếp) */}
      {menuType === 'MAIN' && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, padding: '20px' }}>
            <button onClick={() => setMenuType('NONE')} style={{ float: 'right', background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>✕</button>
            <h2 style={{ color: '#eab308' }}>CÀI ĐẶT</h2>
            <button onClick={() => setMenuType('EDIT_PROFILE')} style={menuBtnStyle}>👤 Chỉnh sửa thông tin</button>
         </div>
      )}
    </div>
  );
}

const drawerBtnStyle = { width: '100%', background: '#222', border: '1px solid #333', padding: '15px', borderRadius: '15px', color: '#fff', fontSize: '14px', textAlign: 'left' as const };
const menuBtnStyle = { width: '100%', background: '#111', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#fff', marginTop: '10px', textAlign: 'left' as const };
        
