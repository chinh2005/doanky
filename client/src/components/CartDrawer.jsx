import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatVND } from "../utils/formatters";
import PaymentModal from "./PaymentModal";
import {
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gamepad2,
  CreditCard,
} from "lucide-react";

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleStartPayment = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate("/login");
      return;
    }
    setIsPaymentOpen(true);
  };

  return (
    <>
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
      />

      <aside className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0e1a] border-l border-cyan-500/20 z-50 p-6 flex flex-col justify-between shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-lg text-white">
              Giỏ Hàng Của Bạn
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-200">
                  Giỏ hàng của bạn đang trống
                </div>
                <div className="text-xs text-slate-400">
                  Hãy chọn cho mình một tài khoản game ưng ý hoặc thẻ cào nạp
                  game nhé!
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/accounts");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition"
              >
                Khám Phá Ngay
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition flex items-start gap-3 relative group"
              >
                <div className="w-14 h-14 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                  <img
                    src={item.image || "/img/anh_acc_default.png"}
                    alt={item.title || item.cardName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/img/anh_acc_default.png";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {item.itemType === "account" ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">
                        {item.game}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">
                        Thẻ {item.cardBrand}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-white truncate">
                    {item.title || item.cardName}
                  </div>

                  {item.itemType === "card" ? (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="text-slate-400 hover:text-white font-bold text-xs px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="text-slate-400 hover:text-white font-bold text-xs px-1"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-bold text-cyan-400">
                        {formatVND(item.price * item.quantity)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-cyan-400 pt-1">
                      {formatVND(item.price)}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tạm tính ({cartItems.length} món):</span>
              <button
                onClick={clearCart}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Xoá tất cả
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Tổng cộng:</span>
              <span className="text-xl font-black text-cyan-400 font-display">
                {formatVND(totalAmount)}
              </span>
            </div>

            <button
              onClick={handleStartPayment}
              className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-neon-cyan transition flex items-center justify-center gap-2"
            >
              <span>
                {user ? "Tiến Hành Thanh Toán" : "Đăng Nhập Để Thanh Toán"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </>
  );
};

export default CartDrawer;
