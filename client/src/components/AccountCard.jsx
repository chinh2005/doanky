import React from "react";
import { Link } from "react-router-dom";
import TiltCard from "./TiltCard";
import { formatVND } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Eye, Sparkles, Shield, Flame } from "lucide-react";

const AccountCard = ({ account }) => {
  const { addToCart } = useCart();
  const isSold = account.status === "sold";
  const discountPercent = Math.round(
    ((account.originalPrice - account.price) / account.originalPrice) * 100,
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSold) return;
    addToCart({
      itemType: "account",
      accountId: account._id,
      title: account.title,
      price: account.price,
      game: account.game,
      code: account.code,
      image: account.images?.[0],
    });
  };

  const getGameColor = (game) => {
    switch (game) {
      case "Liên Quân":
        return "from-amber-500 to-yellow-600";
      case "Valorant":
        return "from-rose-500 to-pink-600";
      case "PUBG":
        return "from-amber-600 to-orange-700";
      case "Genshin Impact":
        return "from-cyan-500 to-blue-600";
      case "Free Fire":
        return "from-orange-500 to-red-600";
      case "FC Online":
        return "from-emerald-500 to-teal-600";
      default:
        return "from-purple-500 to-indigo-600";
    }
  };

  return (
    <TiltCard className="h-full rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-neon-cyan flex flex-col group">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-900">
        <img
          src={account.images?.[0] || "/img/anh_acc_default.png"}
          alt={account.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/img/anh_acc_default.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-black/30" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider text-white bg-gradient-to-r ${getGameColor(account.game)} shadow-md`}
          >
            {account.game}
          </span>
          {account.badge && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-md border border-amber-500/40 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {account.badge}
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-cyan-300 border border-cyan-500/30 font-mono">
            #{account.code}
          </span>
        </div>

        {isSold && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-xl border border-rose-500 bg-rose-950/80 text-rose-300 text-xs font-black tracking-widest uppercase rotate-[-8deg] shadow-lg">
              ĐÃ BÁN
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link
            to={`/accounts/${account._id}`}
            className="block text-sm font-bold text-slate-100 line-clamp-2 group-hover:text-cyan-400 transition"
          >
            {account.title}
          </Link>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Rank:</span>
              <span className="font-bold text-amber-400 truncate max-w-[85px]">
                {account.rank}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Trang phục:</span>
              <span className="font-bold text-cyan-400">
                {account.skinCount} Skin
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              {account.originalPrice > account.price && (
                <div className="text-[11px] text-slate-400 line-through">
                  {formatVND(account.originalPrice)}
                </div>
              )}
              <div className="text-lg font-black text-cyan-400 font-display tracking-tight">
                {formatVND(account.price)}
              </div>
            </div>

            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/accounts/${account._id}`}
              className="px-3 py-2 rounded-xl text-xs font-bold text-center bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Chi Tiết
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isSold}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isSold
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-md hover:shadow-neon-cyan"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default AccountCard;
