// src/components/auth/LoginView.tsx
import { useState } from 'react';

export default function LoginView({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!agreed) return alert("Vui lòng đồng ý với điều khoản dịch vụ!");
    setLoading(true);
    try {
      const scopes = ['username', 'payments', 'wallet_address'];
      const auth = await window.Pi.authenticate(scopes, (p: any) => console.log(p));
      onLoginSuccess(auth.user);
    } catch (e) {
      alert("Lỗi kết nối Pi Network. Hãy thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
      <h1 className="text-4xl font-black text-yellow-500 mb-8 tracking-tighter">CONNECT-SUPREME</h1>
      
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Điều khoản dịch vụ</h2>
        <div className="h-40 overflow-y-auto text-xs text-gray-400 mb-4 p-3 bg-black rounded-lg border border-gray-800 leading-relaxed">
          <p className="mb-2">1. Tuân thủ nghiêm ngặt quy định của Pi Network về giao dịch Enclosed Mainnet.</p>
          <p className="mb-2">2. Không trao đổi Pi lấy tiền mặt hoặc các loại tiền điện tử khác trái phép.</p>
          <p className="mb-2">3. Người dùng tự chịu trách nhiệm về nội dung video và hàng hóa đăng tải.</p>
          <p className="mb-2">4. Thông tin liên kết (FB, YT) phải là chính chủ và lành mạnh.</p>
          <p>... (Nội dung đầy đủ sẽ cập nhật sau)</p>
        </div>

        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 accent-yellow-500"
          />
          <span className="text-sm text-gray-300">Tôi đồng ý với các điều khoản trên</span>
        </label>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
            agreed ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          {loading ? "ĐANG KẾT NỐI..." : "ĐĂNG NHẬP VỚI PI"}
        </button>
      </div>
    </div>
  );
}
