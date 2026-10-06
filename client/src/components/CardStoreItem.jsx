import React, { useState } from "react";
import TiltCard from "./TiltCard";
import { formatVND } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Zap, Check, ShieldCheck } from "lucide-react";

const CardStoreItem = ({ card }) => {
  const { addToCart } = useCart();
  const [selectedDenom, setSelectedDenom] = useState(
    card.denominations?.[3]?.value || 100000,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const finalUnitPrice = Math.round(
    selectedDenom * (1 - (card.discountRate || 0) / 100),
  );
  const totalPrice = finalUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      itemType: "card",
      cardBrand: card.brand,
      cardName: card.name,
      denomination: selectedDenom,
      price: finalUnitPrice,
      quantity: quantity,
      image: card.logo,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <TiltCard className="rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-neon-purple p-5 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 overflow-hidden flex items-center justify-center">
              <img
                src={card.logo}
                alt={card.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="font-bold text-white text-base">{card.name}</div>
              <div className="text-[11px] text-slate-400 capitalize">
                {card.type === "game"
                  ? "Thẻ Game Chính Hãng"
                  : "Thẻ Cào Điện Thoại"}
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />-{card.discountRate}%
          </span>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Chọn mệnh giá:</span>
            <span className="text-cyan-400 font-bold">
              {formatVND(selectedDenom)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {card.denominations?.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedDenom(item.value)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition border ${
                  selectedDenom === item.value
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md"
                    : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {item.value >= 1000000
                  ? `${item.value / 1000000}Tr`
                  : `${item.value / 1000}K`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Số lượng:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center font-bold text-sm"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center font-bold text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Thành tiền:</span>
          <div className="text-right">
            <span className="text-base font-black text-cyan-400 font-display">
              {formatVND(totalPrice)}
            </span>
            <div className="text-[10px] text-purple-300">
              Tiết kiệm {formatVND(selectedDenom * quantity - totalPrice)}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
            added
              ? "bg-emerald-500 text-black"
              : "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white hover:brightness-110 hover:shadow-neon-purple"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Đã Thêm Vào Giỏ
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Mua Thẻ Ngay
            </>
          )}
        </button>
      </div>
    </TiltCard>
  );
};

export default CardStoreItem;
