import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import CardStoreItem from "../components/CardStoreItem";
import {
  CreditCard,
  Search,
  Gamepad2,
  Smartphone,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.append("type", activeTab);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const data = await axiosClient.get(`/cards?${params.toString()}`);
      setCards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0e1424] to-cyan-950/40 border border-purple-500/25 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>KHO THẺ CÀO CHÍNH HÃNG CHIẾT KHẤU CAO</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              Mua Thẻ Game & Thẻ Cào Điện Thoại
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Chiết khấu lên đến 7%
            </span>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên thẻ: Garena, Zing, Viettel, Mobifone, Vinaphone, Vcoin, Gate..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-400 shadow-inner"
          />
          <Search className="w-5 h-5 text-purple-400 absolute left-4 top-3.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-purple-600 text-white border-purple-400 shadow-neon-purple"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Tất Cả Các Loại Thẻ
          </button>

          <button
            onClick={() => setActiveTab("game")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
              activeTab === "game"
                ? "bg-purple-600 text-white border-purple-400 shadow-neon-purple"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" /> Thẻ Game (Garena, Zing, Gate,
            Vcoin)
          </button>

          <button
            onClick={() => setActiveTab("phone")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
              activeTab === "phone"
                ? "bg-purple-600 text-white border-purple-400 shadow-neon-purple"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Thẻ ĐT (Viettel, Vina, Mobi)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <CreditCard className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-white font-bold">
            Không tìm thấy loại thẻ phù hợp
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
          >
            Xem Tất Cả Thẻ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <CardStoreItem key={card._id} card={card} />
          ))}
        </div>
      )}

      <div className="rounded-3xl bg-[#0c111e] border border-slate-800 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm mb-1">
              Mã Thẻ Bàn Giao Tức Thì
            </div>
            <div className="text-slate-400 leading-relaxed">
              Ngay sau khi thanh toán thành công, bạn sẽ nhận được Số Serial và
              Mã Thẻ (PIN) trực tiếp trên màn hình và lưu trong Profile.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm mb-1">
              Bảo Hành Nạp 100%
            </div>
            <div className="text-slate-400 leading-relaxed">
              Cam kết thẻ chuẩn từ các nhà mạng viễn thông và nhà phát hành game
              hàng đầu Việt Nam, hỗ trợ nạp lỗi 1 đổi 1.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm mb-1">
              Thanh Toán Linh Hoạt
            </div>
            <div className="text-slate-400 leading-relaxed">
              Dễ dàng thanh toán qua số dư ví hoặc quét VietQR ngân hàng không
              mất phí giao dịch.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
