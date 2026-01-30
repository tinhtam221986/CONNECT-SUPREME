'use client';
import { useState, useRef } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [menuType, setMenuType] = useState<'NONE' | 'MAIN' | 'EDIT_PROFILE' | 'DRAWER'>('NONE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [drawerTarget, setDrawerTarget] = useState<'avatar' | 'cover'>('avatar');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo state từ dữ liệu User của Database
  const [profile, setProfile] = useState({
    displayName: user.display_name || "Pioneer",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: user.cover_url || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
    reason: ""
  });

  // 📸 HÀM MỞ NGĂN KÉO ĐỔI ẢNH
  const openDrawer = (target: 'avatar' | 'cover') => {
    setDrawerTarget(target);
    setMenuType('DRAWER');
  };

  // 📂 HÀM XỬ LÝ TẢI ẢNH LÊN CLOUDFLARE R2 VÀ LƯU VÀO MONGODB
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Chuẩn bị dữ liệu gửi lên API Upload
      const formData = new FormData();
      formData.append("file", file);
      
      // 2. Gọi API để đẩy ảnh lên Cloudflare R2
      const uploadRes = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });
      
      const { url } = await uploadRes.json();

      if (url) {
        // 3. Cập nhật giao diện với link vĩnh viễn từ R2
        if (drawerTarget === 'avatar') {
          setProfile(prev => ({ ...prev, avatar: url }));
          // 4. Ghi đè link ảnh vào MongoDB ngay lập tức
          await handleSaveSettings({ avatar_url: url });
        } else {
          setProfile(prev => ({ ...prev, cover: url }));
          await handleSaveSettings({ cover_url: url });
        }
        
        alert("✅ Báo cáo Sếp: Ảnh đã được lưu vĩnh viễn vào hệ thống R2! 🫡");
      }
    } catch (e) {
      alert("❌ Lỗi: Không thể kết nối tới mạch máu dữ liệu R2!");
    } finally {
      setMenuType('NONE');
      setLoading(false);
    }
  };

  // 💾 HÀM LƯU THÔNG TIN CHUNG VÀO MONGODB
  const handleSaveSettings = async (extraData = {}) => {
    // Nếu gọi từ form chỉnh sửa thì hiện loading, nếu gọi ngầm khi đổi ảnh thì chạy lặng lẽ
    const isEditProfile = menuType === 'EDIT_PROFILE';
    if (isEditProfile) setLoading(true);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: user.username,
          display_name: profile.displayName,
          bio: profile.bio,
          ...extraData // Gộp thêm avatar_url hoặc cover_url nếu có
        }),
      });
      const result = await res.json();
      if (result.success && isEditProfile) {
        alert("✅ Báo cáo sếp: Thông tin đã được khóa vào hệ thống! 🫡");
        setMenuType('NONE');
      }
    } catch (e) { 
      alert("❌ Lỗi mạch máu dữ liệu!"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* 📸 PHẦN ĐẦU TRANG (HEADER) */}
      <div style={{ position: 'relative', height: '220px' }}>
        {/* Ảnh bìa */}
        <div 
          onClick={() => openDrawer('cover')}
          style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover`, cursor: 'pointer' }}
        >
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 10%, transparent 70%)' }}></div>
           <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '50%', fontSize: '14px' }}>🖋️</div>
        </div>

        {/* Nút chức năng */}
        <div style={{ position: 'absolute', bottom: '20px', right: '15px', display: 'flex', gap: '10px' }}>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>🔔</button>
          <button onClick={() => setMenuType('MAIN')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>⚙️</button>
        </div>

        {/* Ảnh đại diện và tên */}
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

      {/* 📝 TIỂU SỬ & THÔNG SỐ */}
      <div style={{ padding: '0 15px 15px 15px' }}>
        <p style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>{profile.bio}</p>
        <div style={{ display: 'flex', gap: '25px', fontSize: '13px', borderTop: '1px solid #111', paddingTop: '15px' }}>
          <span><strong>1.2K</strong> Bạn bè</span>
          <span><strong>45K</strong> Follower</span>
          <span><strong>89</strong> Đang theo dõi</span>
        </div>
      </div>

      {/* 📥 INPUT FILE ẨN (Để chọn ảnh từ máy) */}
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* 🗄️ NGĂN KÉO ĐỔI ẢNH (BOTTOM DRAWER) */}
      {menuType === 'DRAWER' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#111', borderRadius: '25px 25px 0 0', padding: '25px', borderTop: '2px solid #eab308' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#eab308' }}>
              Thay đổi {drawerTarget === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'} 👤
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={menuButtonStyle} onClick={() => fileInputRef.current?.click()}>🖼️ Chọn từ thư viện</button>
              <button style={{ ...menuButtonStyle, color: '#ff4444', textAlign: 'center', border: 'none' }} onClick={() => setMenuType('NONE')}>HỦY BỎ</button>
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ OVERLAY MENU CÀI ĐẶT & CHỈNH SỬA */}
      {['MAIN', 'EDIT_PROFILE'].includes(menuType) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 1000, padding: '40px 20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#eab308', margin: 0 }}>{menuType === 'MAIN' ? 'CÀI ĐẶT' : 'CHỈNH SỬA HỒ SƠ'}</h2>
            <button onClick={() => setMenuType('NONE')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>✕</button>
          </div>

          {/* Menu chính */}
          {menuType === 'MAIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setMenuType('EDIT_PROFILE')} style={menuButtonStyle}>👤 Chỉnh sửa thông tin cá nhân</button>
              <button style={menuButtonStyle}>💳 Quản lý Ví Pi (Mainnet)</button>
              <button style={menuButtonStyle}>🌐 Liên kết mạng xã hội</button>
            </div>
          )}

          {/* Form chỉnh sửa */}
          {menuType === 'EDIT_PROFILE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>TÊN HIỂN THỊ</label>
                <input style={inputStyle} value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>TIỂU SỬ</label>
                <textarea style={{ ...inputStyle, height: '100px' }} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => handleSaveSettings()} style={saveButtonStyle}>{loading ? 'ĐANG LƯU...' : 'XÁC NHẬN LƯU'}</button>
                <button onClick={() => setMenuType('MAIN')} style={cancelButtonStyle}>QUAY LẠI</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📑 TABS SECTION (Videos, Cửa hàng, v.v.) */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000', zIndex: 10 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '13px', fontWeight: 'bold', color: activeTab === tab ? '#eab308' : '#555', borderBottom: activeTab === tab ? '2px solid #eab308' : 'none' }}>{tab}</div>
        ))}
      </div>
      
      {/* 🖼️ GRID NỘI DUNG (TRỐNG) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ aspectRatio: '9/16', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '10px' }}>TRỐNG</div>
        ))}
      </div>
    </div>
  );
}

// CÀI ĐẶT STYLE (GIỮ NGUYÊN BẢN GỐC CỦA SẾP)
const menuButtonStyle = { width: '100%', textAlign: 'left' as const, background: '#111', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#eee', fontSize: '14px', cursor: 'pointer' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#eab308', marginBottom: '8px', fontWeight: 'bold' as const };
const inputStyle = { width: '100%', background: '#111', border: '1px solid #333', padding: '15px', color: '#fff', borderRadius: '12px', outline: 'none' };
const saveButtonStyle = { flex: 2, background: '#eab308', color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold' as const };
const cancelButtonStyle = { flex: 1, background: '#222', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px' };
                  
