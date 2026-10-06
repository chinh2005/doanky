import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axiosClient from "../api/axiosClient";
import {
  X,
  Wallet,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const PaymentModal = ({ isOpen, onClose }) => {
  const { user, updateBalance } = useAuth();
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedKey, setCopiedKey] = useState("");

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleCheckout = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axiosClient.post("/orders/checkout", {
        items: cartItems,
        paymentMethod,
      });

      if (paymentMethod === "wallet") {
        updateBalance(response.remainingBalance);
        setCreatedOrder(response.order);
        clearCart();
      } else {
        setCreatedOrder(response.order);
      }
    } catch (err) {
      setError(err.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmQR = async () => {
    if (!createdOrder) return;
    setLoading(true);
    setError("");
    try {
      const response = await axiosClient.post(
        `/orders/${createdOrder._id}/confirm-qr`,
      );
      setCreatedOrder(response.order);
      clearCart();
    } catch (err) {
      setError(err.message || "Xác nhận thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  const isWalletSufficient = user && user.balance >= totalAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1220] border border-cyan-500/30 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">
              {createdOrder?.paymentStatus === "completed"
                ? "Thanh Toán Thành Công"
                : "Xác Nhận & Thanh Toán"}
            </h3>
          </div>
          <button
            onClick={() => {
              if (createdOrder?.paymentStatus === "completed") {
                navigate("/profile");
              }
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!createdOrder ? (
            <>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Số lượng món hàng:</span>
                  <span className="font-bold text-white">
                    {cartItems.length} món
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-300">
                    Tổng tiền thanh toán:
                  </span>
                  <span className="font-black text-cyan-400 text-lg font-display">
                    {formatVND(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-300">
                  Phương thức thanh toán:
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                      paymentMethod === "wallet"
                        ? "bg-cyan-500/15 border-cyan-400 shadow-neon-cyan"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Wallet className="w-5 h-5 text-cyan-400" />
                      {paymentMethod === "wallet" && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Số dư ví Shop
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ví hiện có:{" "}
                        <span className="text-cyan-400 font-semibold">
                          {formatVND(user?.balance || 0)}
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vietqr")}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                      paymentMethod === "vietqr"
                        ? "bg-purple-500/15 border-purple-400 shadow-neon-purple"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-purple-400" />
                      {paymentMethod === "vietqr" && (
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Quét mã VietQR
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Chuyển khoản 24/7 tức thì
                      </div>
                    </div>
                  </button>
                </div>

                {paymentMethod === "wallet" && !isWalletSufficient && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
                    <span>
                      Số dư không đủ. Vui lòng nạp thêm tiền hoặc chọn VietQR.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate("/deposit");
                      }}
                      className="ml-2 underline font-bold whitespace-nowrap"
                    >
                      Nạp ngay
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : createdOrder.paymentStatus === "completed" ? (
            <div className="space-y-4">
              <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-bold text-emerald-300 text-base">
                  Giao dịch thành công mỹ mãn!
                </div>
                <div className="text-xs text-slate-300">
                  Mã đơn:{" "}
                  <span className="font-mono text-cyan-400 font-bold">
                    {createdOrder.orderCode}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Thông Tin Bàn Giao Tức Thì:
                </div>

                {createdOrder.deliveredData?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                        {item.itemType === "account" ? "Acc Game" : "Thẻ Cào"}
                      </span>
                    </div>

                    {item.itemType === "account" ? (
                      <div className="space-y-1.5 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Tài khoản:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">
                              {item.accountUsername}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(item.accountUsername, `acc-${idx}`)
                              }
                              className="text-cyan-400 hover:text-white"
                            >
                              {copiedKey === `acc-${idx}` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Mật khẩu:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">
                              {item.accountPassword}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(item.accountPassword, `pass-${idx}`)
                              }
                              className="text-cyan-400 hover:text-white"
                            >
                              {copiedKey === `pass-${idx}` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                        {item.accountNote && (
                          <div className="text-[10px] text-amber-300/80 pt-1 font-sans">
                            {item.accountNote}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Số Serial:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">
                              {item.serialNumber}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(item.serialNumber, `sr-${idx}`)
                              }
                              className="text-cyan-400 hover:text-white"
                            >
                              {copiedKey === `sr-${idx}` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Mã PIN (Mã Cào):
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">
                              {item.pinCode}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(item.pinCode, `pin-${idx}`)
                              }
                              className="text-cyan-400 hover:text-white"
                            >
                              {copiedKey === `pin-${idx}` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-purple-500/30 text-center space-y-3">
                <div className="text-xs text-slate-300 font-semibold">
                  Mở ứng dụng Ngân hàng và quét mã VietQR bên dưới:
                </div>

                <div className="inline-block p-2 rounded-xl bg-white shadow-2xl">
                  <img
                    src={createdOrder.qrCodeData?.qrImageUrl}
                    alt="VietQR Chuyển Khoản"
                    className="w-52 h-52 mx-auto object-contain"
                  />
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-xs text-left bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="font-bold text-white">
                      {createdOrder.qrCodeData?.bankCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Số tài khoản:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-cyan-400">
                      <span>{createdOrder.qrCodeData?.accountNumber}</span>
                      <button
                        onClick={() =>
                          handleCopy(
                            createdOrder.qrCodeData?.accountNumber,
                            "stk",
                          )
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === "stk" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Chủ tài khoản:</span>
                    <span className="font-bold text-white">
                      {createdOrder.qrCodeData?.accountName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Số tiền:</span>
                    <span className="font-bold text-rose-400">
                      {formatVND(createdOrder.qrCodeData?.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nội dung CK:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                      <span>{createdOrder.qrCodeData?.memo}</span>
                      <button
                        onClick={() =>
                          handleCopy(createdOrder.qrCodeData?.memo, "memo")
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === "memo" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800">
          {!createdOrder ? (
            <button
              onClick={handleCheckout}
              disabled={
                loading || (paymentMethod === "wallet" && !isWalletSufficient)
              }
              className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-neon-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Đang Xử Lý..."
              ) : (
                <>
                  <span>Thanh Toán Ngay ({formatVND(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : createdOrder.paymentStatus === "completed" ? (
            <button
              onClick={() => {
                onClose();
                navigate("/profile");
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-neon-cyan transition"
            >
              Xem Toàn Bộ Lịch Sử Đơn Hàng Tại Profile
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleConfirmQR}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-lg hover:shadow-emerald-500/30 transition flex items-center justify-center gap-2"
              >
                {loading ? "Đang Kiểm Tra..." : "Tôi Đã Chuyển Tiền (Xác Nhận)"}
              </button>
              <div className="text-[11px] text-center text-slate-400">
                Hệ thống tự động kích hoạt bàn giao sau khi bạn ấn xác nhận
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
