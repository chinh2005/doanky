import React from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  ShieldCheck,
  Zap,
  Headphones,
  Heart,
  Code,
  Sparkles,
  CheckCircle2,
  Globe,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-20 border-t border-cyan-500/20 bg-[#06080e] overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[2px] shadow-neon-cyan">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-black text-xl tracking-wider text-white">
                CYBER<span className="text-cyan-400">GAME</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống bán tài khoản game hàng đầu Việt Nam. Tự động hoá bàn
              giao tài khoản và mã thẻ cào chỉ trong 3 giây. Bảo hành vĩnh viễn,
              uy tín tuyệt đối.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-4 h-4" /> Bảo hành 100%
              </div>
              <div className="flex items-center gap-1.5 text-pink-400">
                <Zap className="w-4 h-4" /> Nhận ngay 3s
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Game Thịnh Hành
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  to="/accounts?game=Liên Quân"
                  className="hover:text-cyan-400 transition"
                >
                  Acc Liên Quân Mobile Cao Thủ
                </Link>
              </li>
              <li>
                <Link
                  to="/accounts?game=Valorant"
                  className="hover:text-cyan-400 transition"
                >
                  Acc Valorant Radiant & Skin Hiếm
                </Link>
              </li>
              <li>
                <Link
                  to="/accounts?game=PUBG"
                  className="hover:text-cyan-400 transition"
                >
                  Acc PUBG PC M416 Băng lv7
                </Link>
              </li>
              <li>
                <Link
                  to="/accounts?game=Genshin Impact"
                  className="hover:text-cyan-400 transition"
                >
                  Acc Genshin AR 60 Cực Phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/accounts?game=Free Fire"
                  className="hover:text-cyan-400 transition"
                >
                  Acc Free Fire Quỷ Dạ Xoa
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Thẻ Cào Chiết Khấu Cao
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/cards" className="hover:text-purple-400 transition">
                  Thẻ Garena (Chiết khấu tới 6%)
                </Link>
              </li>
              <li>
                <Link to="/cards" className="hover:text-purple-400 transition">
                  Thẻ Zing VNG (Zing Xu)
                </Link>
              </li>
              <li>
                <Link to="/cards" className="hover:text-purple-400 transition">
                  Thẻ Viettel, Vinaphone, Mobifone
                </Link>
              </li>
              <li>
                <Link to="/cards" className="hover:text-purple-400 transition">
                  Thẻ Gate FPT & Vcoin VTC
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Hỗ Trợ Khách Hàng
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Headphones className="w-4 h-4" />
                <span>Tổng Đài Chăm Sóc 24/7</span>
              </div>
              <div className="text-white font-black text-base tracking-wide">
                1900 8899 - 0988.889.999
              </div>
              <div className="text-[11px] text-slate-400">
                Thời gian làm việc: 08:00 - 24:00 (Cả ngày Lễ và CN)
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} CYBERGAME.VN - Nền tảng thương
              mại game trực tuyến. All rights reserved.
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-pink-950/60 border border-cyan-500/30 shadow-neon-cyan">
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300">
              Thiết kế & Phát triển bởi:
            </span>
            <span className="text-xs font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent tracking-wide">
              Chinh Dev
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
