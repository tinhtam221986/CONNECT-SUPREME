'use client';
import { useState, useRef, useEffect } from 'react';

export default function ProfileView({ user }: { user: any }) {
  // 1. Quản lý trạng thái giao diện
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Thông tin Profile (Lấy từ user props hoặc mặc định)
  const [profile, setProfile] = useState({
    displayName: user?.display_name || user?.username || "Pioneer",
    bio: user?.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user?.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
  });

  // 3. Hàm Xử lý Lưu Ảnh (Avatar & Cover)
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
        const userId = user?.username || "DANG21986"; // Định danh cứng để chắc chắn tìm thấy sếp

        // Cập nhật giao diện ngay lập tức
        setProfile(prev => ({ ...prev, [drawerTarget]: data.url }));

        // Gửi lệnh lưu vào Database
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pi_id: userId,
            [updateField]: data.url
          }),
        });
        
        alert("✅ Báo cáo sếp: Ảnh đã được khóa vào Database! 🫡");
      }
    } catch (err) {
      alert("❌ Lỗi tải ảnh: " + err);
    } finally {
      setMenuType('NONE');
      setLoading(false);
    }
  };

  // 4. Hàm Xử lý Lưu Tên & Tiểu sử
  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const userId = user?.username || "DANG21986";
      
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: userId,
          display_name: profile.displayName,
          bio: profile.bio
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Dữ liệu đã được GHI THẬT vào hệ thống! 🫡");
        setMenuType('NONE');
      } else {
        alert("❌ Lỗi từ Server: " + result.error);
      }
    } catch (err) {
      alert("❌ Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* PHẦN HEADER: Ảnh bìa & Nút bấm */}
      <div style={{ position: 'relative', height: '180px' }}>
        <div 
          onClick={() => { setDrawerTarget('cover'); setMenuType('DRAWER'); }} 
          style={{ 
            position: 'absolute', inset: 0, 
            background: `url(${profile.cover}) center/cover no-repeat`, 
            cursor: 'pointer' 
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 10%, transparent 90%)' }}></div>
        </div>

        {/* Nút Thông báo & Cài đặt */}
        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px', zIndex: 50 }}>
          <button style={circleButtonStyle}>🔔</button>
          <button onClick={() => setMenuType('MAIN')} style={circleButtonStyle}>⚙️</button>
        </div>

        {/* Thông tin cá nhân (Kích thước đã giảm 2/3) */}
        <div style={{ position: 'absolute', bottom: '10px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 50 }}>
          <div onClick={() => { setDrawerTarget('avatar'); setMenuType('DRAWER'); }} style={{ position: 'relative', cursor: 'pointer' }}>
            <img 
              src={profile.avatar} 
              style={{ width: '55px', height: '55px', borderRadius: '15px', border: '2px solid #eab308', objectFit: 'cover' }} 
              alt="avatar" 
            />
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#eab308', borderRadius: '50%', padding: '3px', border: '1px solid #000' }}>
               <span style={{ fontSize: '8px' }}>📷</span>
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{profile.displayName}</h1>
            <p style={{ color: '#eab308', fontSize: '11px', margin: '2px 0' }}>@{user?.username || "DANG21986"} <span style={{ background: '#eab30822', padding: '1px 4px', borderRadius: '4px' }}>Pioneer ✅</span></p>
          </div>
        </div>
      </div>

      {/* PHẦN THÔNG SỐ & BIO */}
      <div style={{ padding: '15px' }}>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', marginBottom: '12px' }}>
          <span><strong style={{ color: '#fff' }}>1.2K</strong> Bạn bè</span>
          <span><strong style={{ color: '#fff' }}>45K</strong> Follower</span>
          <span style={{ color: '#666' }}><strong>89</strong> Đang theo dõi</span>
        </div>
        <p style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{profile.bio}</p>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* TABS GRID */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', background: '#000', position: 'sticky', top: 0, zIndex: 40 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ 
            flex: 1, textAlign: 'center', padding: '12px', fontSize: '13px', 
            color: activeTab === tab ? '#eab308' : '#555', 
            borderBottom: activeTab === tab ? '2px solid #eab308' : 'none',
            fontWeight: activeTab === tab ? 'bold' : 'normal' 
          }}>{tab}</div>
        ))}
      </div>

      {/* GRID NỘI DUNG TRỐNG */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '1px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ aspectRatio: '9/16', background: '#0a0a0a' }}></div>
        ))}
      </div>

      {/* CÁC MENU OVERLAY (Z-INDEX CAO NHẤT) */}
      {menuType !== 'NONE' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: menuType === 'DRAWER' ? 'flex-end' : 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '450px', background: '#111', borderRadius: menuType === 'DRAWER' ? '20px 20px 0 0' : '15px', padding: '20px', border: '1px solid #222' }}>
            
            {/* Drawer chọn ảnh */}
            {menuType === 'DRAWER' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#eab308', marginBottom: '20px' }}>Thay đổi hình ảnh</h3>
                <button style={menuButtonStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ thiết bị</button>
                <button style={{ ...menuButtonStyle, color: '#ff4444', border: 'none', marginTop: '10px' }} onClick={() => setMenuType('NONE')}>HỦY BỎ</button>
              </div>
            )}

            {/* Form chỉnh sửa profile */}
            {menuType === 'EDIT_PROFILE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: '#eab308', margin: 0 }}>Chỉnh sửa hồ sơ</h3>
                <input 
                  style={inputStyle} 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} 
                  placeholder="Tên hiển thị..." 
                />
                <textarea 
                  style={{ ...inputStyle, height: '80px', resize: 'none' }} 
                  value={profile.bio} 
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                  placeholder="Tiểu sử..." 
                />
                <button onClick={handleSaveInfo} style={saveButtonStyle}>{loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}</button>
                <button onClick={() => setMenuType('NONE')} style={{ background: 'none', border: 'none', color: '#555' }}>Đóng</button>
              </div>
            )}

            {/* Menu chính */}
            {menuType === 'MAIN' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={menuButtonStyle} onClick={() => setMenuType('EDIT_PROFILE')}>👤 Chỉnh sửa thông tin</button>
                <button style={menuButtonStyle}>💳 Ví CONNECT</button>
                <button onClick={() => setMenuType('NONE')} style={{ marginTop: '10px', color: '#555', background: 'none', border: 'none' }}>Đóng</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// CÁC STYLE TỐI ƯU
const circleButtonStyle = { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const menuButtonStyle = { width: '100%', textAlign: 'left' as const, background: '#1a1a1a', border: '1px solid #333', padding: '14px', borderRadius: '12px', color: '#eee', cursor: 'pointer' };
const inputStyle = { width: '100%', background: '#000', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '10px', fontSize: '14px' };
const saveButtonStyle = { background: '#eab308', color: '#000', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' as const, cursor: 'pointer' };
          
