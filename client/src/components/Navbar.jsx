import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatVND } from "../utils/formatters";
import {
  Gamepad2,
  ShoppingCart,
  Wallet,
  User,
  ShieldCheck,
  LogOut,
  LogIn,
  PlusCircle,
  Menu,
  X,
  Zap,
  ChevronDown,
} from "lucide-react";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, demoLogin } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleDemoClick = async (role) => {
    try {
      await demoLogin(role);
      setShowDemoMenu(false);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#07090e]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition border border-transparent hover:border-cyan-500/30"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[2px] shadow-neon-cyan transform group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-display font-black text-xl tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent group-hover:glow-cyan-text transition">
                CYBER<span className="text-white">GAME</span>
              </div>
              <div className="text-[10px] tracking-widest text-cyan-400/80 font-bold uppercase">
                Shop Acc & Thẻ 3D
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1 font-semibold text-sm">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 transition"
          >
            Trang Chủ
          </Link>
          <Link
            to="/accounts"
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 transition flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-cyan-400" /> Kho Acc Game
          </Link>
          <Link
            to="/cards"
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-purple-400 hover:bg-slate-800/40 transition"
          >
            Thẻ Game & ĐT
          </Link>
          <Link
            to="/deposit"
            className="px-4 py-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 transition flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4" /> Nạp Tiền VietQR
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1 hover:border-purple-400 transition"
            >
              <span>TK Demo</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0e1424] border border-purple-500/30 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Đăng nhập 1-chạm
                </div>
                <button
                  onClick={() => handleDemoClick("user")}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition flex items-center justify-between"
                >
                  <span>Khách Hàng (5Tr trong ví)</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                </button>
                <button
                  onClick={() => handleDemoClick("admin")}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-purple-500/10 hover:text-purple-300 transition flex items-center justify-between"
                >
                  <span>Quản Trị Viên (Admin)</span>
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-neon-cyan transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-neon-pink animate-pulse">
                {totalCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-400/40"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-200 max-w-[90px] truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] font-semibold text-cyan-400">
                    {formatVND(user.balance)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#0f1626] border border-cyan-500/30 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-slate-200 truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {user.email}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Số dư:</span>
                      <span className="text-cyan-400 font-bold">
                        {formatVND(user.balance)}
                      </span>
                    </div>
                  </div>

                  <div className="p-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition"
                    >
                      <User className="w-4 h-4 text-cyan-400" /> Hồ Sơ & Đơn
                      Hàng
                    </Link>

                    <Link
                      to="/deposit"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-400" /> Nạp Tiền
                      Vào Ví
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-400" /> Quản
                        Trị Admin
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition mt-1 border-t border-slate-800/60"
                    >
                      <LogOut className="w-4 h-4" /> Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 transition"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block px-3.5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white shadow-neon-cyan transition"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
