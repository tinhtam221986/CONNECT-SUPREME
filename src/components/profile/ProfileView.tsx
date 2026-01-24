'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isOwner = true; // Logic kiểm tra chủ sở hữu

  const [profile, setProfile] = useState({
    displayName: user.display_name || "Tịnh Tâm",
    bio: user.bio || "Chào mừng bạn đến với CONNECT-SUPREME!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    cover: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pi_id: user.username,
          display_name: profile.displayName,
          bio: profile.bio,
        }),
      });
      const result = await response.json();
      if (result.success) { 
        alert("✅ Đã lưu thành công! 🫡"); 
        setIsEditing(false); 
      }
    } catch (error) { 
      alert("❌ Lỗi kết nối."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      
      {/* 📸 KHU VỰC ẢNH BÌA & THÔNG TIN CHỒNG LÊN NHAU */}
      <div style={{ position: 'relative', height: '210px', width: '100%', overflow: 'hidden' }}>
        {/* Ảnh bìa */}
        <div style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
        </div>

        {/* Nút chức năng: Góc dưới bên phải ảnh bìa */}
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', gap: '8px', zIndex: 10 }}>
          {isOwner ? (
            <>
              <button style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px 10px', color: '#fff', fontSize: '14px' }}>🔔</button>
              <button style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px 10px', color: '#fff', fontSize: '14px' }}>⚙️</button>
            </>
          ) : (
            <>
              <button style={{ background: '#eab308', color: '#000', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 'bold', fontSize: '13px' }}>Theo dõi</button>
              <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 12px', fontSize: '13px' }}>Nhắn tin</button>
            </>
          )}
        </div>

        {/* Cụm Info nằm trọn trong ảnh bìa */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px', width: '70%' }}>
          <div style={{ position: 'relative' }}>
             {/* Đã sửa lỗi objectFit ở đây 🫡 */}
             <img src={profile.avatar} style={{ width: '65px', height: '65px', borderRadius: '16px', border: '2px solid rgba(234, 179, 8, 0.5)', objectFit: 'cover' }} />
             {isOwner && <div onClick={() => setIsEditing(true)} style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#eab308', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', cursor: 'pointer' }}>✏️</div>}
          </div>
          
          <div style={{ overflow: 'hidden' }}>
            {isEditing ? (
              <input 
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #eab308', color: '#fff', borderRadius: '4px', fontSize: '14px', width: '100%', outline: 'none' }}
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              />
            ) : (
              <h1 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{profile.displayName}</h1>
            )}
            <p style={{ color: '#eab308', fontSize: '11px', margin: '2px 0', opacity: 0.9 }}>@{user.username} <span style={{fontSize: '9px', background: 'rgba(234,179,8,0.2)', padding: '1px 4px', borderRadius: '4px'}}>Pioneer ✅</span></p>
          </div>
        </div>
      </div>

      {/* 📝 TIỂU SỬ & CHỈ SỐ (SIÊU GỌN) */}
      <div style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#888', fontSize: '11px', margin: 0, fontStyle: 'italic', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.bio}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
          <div style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>1.2K</span> <span style={{ color: '#555' }}>Bạn</span></div>
          <div style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>45K</span> <span style={{ color: '#555' }}>Follow</span></div>
        </div>
      </div>

      {/* 🏷️ TABS NỘI DUNG */}
      <div style={{ position: 'sticky', top: 0, display: 'flex', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 20 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map((tab, i) => (
          <div key={tab} style={{ flex: 1, textAlign: 'center', padding: '12px 0', fontSize: '12px', fontWeight: 'bold', color: i === 0 ? '#eab308' : '#555', borderBottom: i === 0 ? '2px solid #eab308' : 'none' }}>{tab}</div>
        ))}
      </div>

      {/* 🎞️ KHÔNG GIAN TRƯNG BÀY (VUỐT CUỘN) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '1px' }}>
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(item => (
          <div key={item} style={{ aspectRatio: '9/15', background: '#050505', border: '0.1px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#111' }}>TRỐNG</div>
        ))}
      </div>

      {/* ⚓ BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 20px 0', background: 'rgba(0,0,0,0.95)', borderTop: '1px solid #111', zIndex: 100 }}>
        <span style={{ fontSize: '20px', opacity: 0.4 }}>🏠</span>
        <span style={{ fontSize: '20px', opacity: 0.4 }}>🎬</span>
        <div style={{ background: 'linear-gradient(45deg, #ca8a04, #eab308)', width: '45px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '20px' }}>＋</div>
        <span style={{ fontSize: '20px', opacity: 0.4 }}>💬</span>
        <span style={{ fontSize: '20px', borderBottom: '2px solid #eab308' }}>👤</span>
      </div>

    </div>
  );
            }
                     
