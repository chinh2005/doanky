import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Gamepad2,
  LogIn,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setError("");
    setLoading(true);
    try {
      await demoLogin(role);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message || "Lỗi đăng nhập demo");
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
            ĐĂNG NHẬP
          </h1>
          <p className="text-xs text-slate-400">
            Hệ thống giao dịch tài khoản game an toàn số 1
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-500/30 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Đăng nhập nhanh (Tài khoản Demo):</span>
          </div>

          <button
            type="button"
            onClick={() => handleDemo("user")}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Khách Hàng (5Tr trong ví)</span>
            </div>
            <span className="text-[10px] bg-cyan-500 text-black px-1.5 py-0.5 rounded font-black">
              1-CLICK
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo("admin")}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Quản Trị Viên (Admin Toàn Quyền)</span>
            </div>
            <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-black">
              1-CLICK
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Địa chỉ Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@demo.com"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-neon-cyan transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Đang Xử Lý..." : "Đăng Nhập Ngay"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-bold hover:underline"
          >
            Đăng ký ngay (+100.000đ)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
