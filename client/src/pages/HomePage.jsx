import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AccountCard from "../components/AccountCard";
import CardStoreItem from "../components/CardStoreItem";
import TiltCard from "../components/TiltCard";
import { formatVND } from "../utils/formatters";
import {
  Flame,
  Zap,
  ShieldCheck,
  CreditCard,
  Search,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Award,
  CheckCircle2,
  Users,
  Clock,
} from "lucide-react";

const HomePage = () => {
  const [featuredAccounts, setFeaturedAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGameFilter, setSelectedGameFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accData, cardData] = await Promise.all([
          axiosClient.get("/accounts?status=available"),
          axiosClient.get("/cards"),
        ]);
        setFeaturedAccounts(accData.slice(0, 6));
        setCards(cardData.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/accounts?search=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const gamePills = [
    "Tất cả",
    "Liên Quân",
    "PUBG",
    "Valorant",
    "Genshin Impact",
    "Free Fire",
    "FC Online",
    "Tốc Chiến",
  ];

  return (
    <div className="space-y-20 pb-16">
      <section className="relative pt-8 md:pt-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-neon-cyan animate-float-slow">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>HỆ THỐNG THƯƠNG MẠI GAME 3D TỰ ĐỘNG 100%</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                SỞ HỮU ACC GAME <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent glow-cyan-text">
                  ĐẲNG CẤP & CHIẾT KHẤU
                </span>{" "}
                <br />
                THẺ CÀO CỰC RẺ
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Hơn 10.000+ tài khoản game nổi tiếng{" "}
                <span className="text-cyan-400 font-bold">
                  Liên Quân, PUBG, Valorant, Genshin Impact
                </span>{" "}
                trắng thông tin, bảo hành trọn đời. Nạp thẻ game & điện thoại
                chiết khấu tới 7%.
              </p>

              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0"
              >
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Tìm kiếm acc: Rank, Skin hiếm, Tướng, Mã số..."
                    className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-[#0e1424] border border-cyan-500/30 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 shadow-xl"
                  />
                  <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none" />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition shadow-neon-cyan flex items-center gap-1"
                  >
                    <span>Tìm Kiếm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Bảo Hành Vĩnh Viễn</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Zap className="w-4 h-4 text-pink-400" />
                  <span>Bàn Giao Trong 3 Giây</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>VietQR Chuẩn Tự Động</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />

              <TiltCard className="relative rounded-3xl bg-gradient-to-b from-[#141b2d] to-[#0a0e1a] border border-cyan-500/40 p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-black tracking-wider uppercase text-slate-200">
                      Tài Khoản Đang Đấu Giá Hot
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 font-mono">
                    #VAL-TOP1
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700/80">
                  <img
                    src="/img/anh_hero.png"
                    alt="Acc Valorant Radiant"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/img/anh_acc_default.png";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 text-xs font-black flex items-center gap-1 border border-amber-500/30">
                    <Award className="w-3.5 h-3.5" />
                    <span>Rank Radiant</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-cyan-500 text-black text-xs font-black shadow-neon-cyan">
                    Dao Kuronami & Vandal Prime
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Trang Phục</div>
                    <div className="font-bold text-cyan-400 text-sm">
                      48 Skin
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Tướng Đủ</div>
                    <div className="font-bold text-purple-400 text-sm">
                      24 Agents
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400">
                      Tỉ Lệ Thắng
                    </div>
                    <div className="font-bold text-emerald-400 text-sm">
                      74.2%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xs text-slate-400">
                      Giá khuyến mãi đặc biệt:
                    </div>
                    <div className="text-2xl font-black text-cyan-400 font-display">
                      1.450.000 đ
                    </div>
                  </div>
                  <Link
                    to="/accounts"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-black uppercase tracking-wider transition shadow-neon-cyan flex items-center gap-1.5"
                  >
                    <span>Xem Kho Acc</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c111e] border border-slate-800/80 flex items-center gap-4 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-display">
                48.500+
              </div>
              <div className="text-xs text-slate-400">Khách Hàng Tin Tưởng</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c111e] border border-slate-800/80 flex items-center gap-4 hover:border-purple-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-display">
                12.800+
              </div>
              <div className="text-xs text-slate-400">
                Acc Bàn Giao Thành Công
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c111e] border border-slate-800/80 flex items-center gap-4 hover:border-pink-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-display">
                &lt; 3 Giây
              </div>
              <div className="text-xs text-slate-400">Thời Gian Nhận Acc</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c111e] border border-slate-800/80 flex items-center gap-4 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-display">
                100%
              </div>
              <div className="text-xs text-slate-400">Bảo Hành Trọn Đời</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>SIÊU PHẨM ACC GAME</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              Kho Tài Khoản Game Nổi Bật
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {gamePills.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGameFilter(g);
                  if (g === "Tất cả") {
                    navigate("/accounts");
                  } else {
                    navigate(`/accounts?game=${encodeURIComponent(g)}`);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  selectedGameFilter === g
                    ? "bg-cyan-500 text-black border-cyan-400 shadow-neon-cyan"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAccounts.map((account) => (
              <AccountCard key={account._id} account={account} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/accounts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-bold tracking-wider uppercase transition shadow-lg hover:shadow-neon-cyan"
          >
            <span>Xem Tất Cả Hơn 1.500+ Acc Game Khác</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>CHIẾT KHẤU TỐT NHẤT THỊ TRƯỜNG</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              Thẻ Game & Thẻ Điện Thoại Giá Rẻ
            </h2>
          </div>

          <Link
            to="/cards"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
          >
            <span>Xem danh mục toàn bộ thẻ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <CardStoreItem key={card._id} card={card} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-pink-950/40 border border-cyan-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-2xl space-y-4 relative z-10">
            <h3 className="font-display font-black text-2xl sm:text-4xl text-white">
              NẠP TIỀN VÍ VIETQR <br />
              <span className="text-cyan-400 glow-cyan-text">
                NHẬN NGAY KHUYẾN MÃI +10%
              </span>
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Hệ thống quét mã VietQR tự động cộng tiền trong 2 giây. Hỗ trợ tất
              cả ngân hàng tại Việt Nam (MBBank, Vietcombank, Techcombank,
              VPBank, ACB...) hoàn toàn không mất phí gạch thẻ.
            </p>
            <div className="pt-2">
              <Link
                to="/deposit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-400 text-black font-black text-xs uppercase tracking-wider hover:bg-cyan-300 transition shadow-neon-cyan"
              >
                <span>Nạp Tiền Vào Ví Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
