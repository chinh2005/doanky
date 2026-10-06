import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Gamepad2, UserPlus, AlertCircle, Gift } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl bg-[#0e1424] border border-cyan-500/30 shadow-2xl p-8 space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[2px] mx-auto shadow-neon-cyan">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="font-display font-black text-2xl text-white">
            ĐĂNG KÝ TÀI KHOẢN
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tặng ngay 100.000đ vào ví khi đăng ký</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Họ và tên của bạn:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Địa chỉ Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Mật khẩu:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Nhập lại mật khẩu:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-neon-cyan transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Đang Xử Lý..." : "Tạo Tài Khoản Ngay"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
