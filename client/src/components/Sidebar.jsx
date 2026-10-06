import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Flame,
  CreditCard,
  Wallet,
  User,
  ShieldCheck,
  Award,
  X,
  ExternalLink,
  PhoneCall,
  Sparkles,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const games = [
    { name: "Liên Quân Mobile", query: "Liên Quân", color: "text-amber-400" },
    { name: "PUBG (PC & Mobile)", query: "PUBG", color: "text-yellow-400" },
    { name: "Valorant", query: "Valorant", color: "text-rose-400" },
    { name: "Genshin Impact", query: "Genshin Impact", color: "text-cyan-400" },
    { name: "Free Fire", query: "Free Fire", color: "text-orange-400" },
    { name: "FC Online", query: "FC Online", color: "text-emerald-400" },
    { name: "LMHT Tốc Chiến", query: "Tốc Chiến", color: "text-blue-400" },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 bg-[#090d16] border-r border-cyan-500/20 z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
              <span className="font-display font-bold text-lg text-white">
                DANH MỤC 3D
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Khám Phá Chính
            </div>

            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Trang Chủ</span>
            </NavLink>

            <NavLink
              to="/accounts"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Kho Acc Game (All)</span>
            </NavLink>

            <NavLink
              to="/cards"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Mua Thẻ Game & Thẻ ĐT</span>
            </NavLink>

            <NavLink
              to="/deposit"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-amber-400 hover:bg-amber-500/10"
                }`
              }
            >
              <Wallet className="w-4 h-4" />
              <span>Nạp Tiền Qua VietQR</span>
            </NavLink>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Các Game Nổi Tiếng
            </div>

            <div className="space-y-1">
              {games.map((g) => (
                <NavLink
                  key={g.name}
                  to={`/accounts?game=${encodeURIComponent(g.query)}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${g.color} bg-current`}
                    />
                    <span>{g.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                </NavLink>
              ))}
            </div>
          </div>

          {user && (
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Khu Vực Cá Nhân
              </div>

              <NavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Hồ Sơ & Lịch Sử Mua</span>
              </NavLink>

              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Bảng Quản Trị Admin</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/20 text-xs">
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
              <PhoneCall className="w-4 h-4" />
              <span>Hỗ Trợ 24/7</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Hotline:{" "}
              <span className="text-white font-bold">0988.889.999</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Hệ thống xử lý tự động 100%
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
