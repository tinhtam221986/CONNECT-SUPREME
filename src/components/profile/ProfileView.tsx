'use client';
import { useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');

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
        alert("✅ Đã lưu thành công vào Database! 🫡");
        setIsEditing(false); 
      }
    } catch (error) { 
      alert("❌ Lỗi mạch dữ liệu."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* 📸 HEADER: ẢNH BÌA + INFO */}
      <div style={{ position: 'relative', height: '210px', width: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `url(${profile.cover}) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
        </div>

        {/* Nút Phụ */}
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <button style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px 12px', color: '#fff' }}>🔔</button>
          <button style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px 12px', color: '#fff' }}>⚙️</button>
        </div>

        {/* Cụm Avatar & Tên */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
             <img src={profile.avatar} style={{ width: '65px', height: '65px', borderRadius: '18px', border: '2px solid #eab308', objectFit: 'cover' }} alt="avatar" />
             <div onClick={() => setIsEditing(true)} style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#eab308', borderRadius: '50%', width: '22px', height: '22px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', cursor: 'pointer', border: '2px solid #000' }}>✏️</div>
          </div>
          
          <div>
            {isEditing ? (
              <input 
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #eab308', color: '#fff', borderRadius: '4px', fontSize: '14px', width: '120px', outline: 'none', padding: '2px 5px' }}
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              />
            ) : (
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{profile.displayName}</h1>
            )}
            <p style={{ color: '#eab308', fontSize: '11px', margin: '2px 0' }}>@{user.username} <span style={{fontSize: '9px', background: 'rgba(234,179,8,0.2)', padding: '1px 4px', borderRadius: '4px'}}>Pioneer ✅</span></p>
          </div>
        </div>
      </div>

      {/* 📝 TIỂU SỬ */}
      <div style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
        <div style={{ flex: 1 }}>
          {isEditing ? (
             <input 
               style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#888', fontSize: '11px', width: '90%', outline: 'none' }}
               value={profile.bio}
               onChange={(e) => setProfile({...profile, bio: e.target.value})}
             />
          ) : (
            <p style={{ color: '#888', fontSize: '11px', margin: 0, fontStyle: 'italic' }}>{profile.bio}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '15px', fontSize: '11px' }}>
          <span><strong>1.2K</strong> Bạn</span>
          <span><strong>45K</strong> Follow</span>
        </div>
      </div>

      {/* NÚT LƯU */}
      {isEditing && (
        <div style={{ padding: '10px 15px', display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ flex: 2, background: '#eab308', color: '#000', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>{loading ? 'ĐANG LƯU...' : 'XÁC NHẬN LƯU'}</button>
          <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#222', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '12px' }}>HỦY</button>
        </div>
      )}

      {/* 🏷️ TABS */}
      <div style={{ position: 'sticky', top: 0, display: 'flex', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 20 }}>
        {['Videos', 'Cửa hàng', 'Bộ sưu tập'].map((tab) => (
          <div 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              flex: 1, textAlign: 'center', padding: '15px 0', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
              color: activeTab === tab ? '#eab308' : '#555',
              borderBottom: activeTab === tab ? '2px solid #eab308' : 'none' 
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '1px', minHeight: '60vh' }}>
        {[1,2,3,4,5,6].map(item => (
          <div key={item} style={{ aspectRatio: '9/15', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#111' }}>
            {activeTab === 'Videos' ? '🎬 TRỐNG' : activeTab === 'Cửa hàng' ? '🛍️ TRỐNG' : '📂 TRỐNG'}
          </div>
        ))}
      </div>

      {/* NAV */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 25px 0', background: 'rgba(0,0,0,0.95)', borderTop: '1px solid #111', zIndex: 100 }}>
        <span style={{ fontSize: '20px', opacity: 0.4 }}>🏠</span>
        <span style={{ fontSize: '20px', opacity: 0.4 }}>🎬</span>
        <div style={{ background: 'linear-gradient(45deg, #ca8a04, #eab308)', width: '50px', height: '35px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '22px' }}>＋</div>
        <span style={{ fontSize: '20px', opacity: 0.4 }}>💬</span>
        <span style={{ fontSize: '20px', borderBottom: '2px solid #eab308' }}>👤</span>
      </div>

    </div>
  );
      }
        
