import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { formatVND, formatDate } from "../utils/formatters";
import {
  Wallet,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  History,
  AlertCircle,
} from "lucide-react";

const DepositPage = () => {
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState(200000);
  const [customAmount, setCustomAmount] = useState("");
  const [activeDeposit, setActiveDeposit] = useState(null);
  const [depositsHistory, setDepositsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const quickAmounts = [
    50000, 100000, 200000, 500000, 1000000, 2000000, 5000000,
  ];

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const data = await axiosClient.get("/deposits/my-deposits");
      setDepositsHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleCreateDeposit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const amountToDeposit = customAmount
      ? Number(customAmount)
      : selectedAmount;
    if (!amountToDeposit || amountToDeposit < 10000) {
      alert("Vui lòng nạp tối thiểu 10.000 đ");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    try {
      const data = await axiosClient.post("/deposits", {
        amount: amountToDeposit,
      });
      setActiveDeposit(data);
      fetchHistory();
    } catch (err) {
      alert(err.message || "Tạo yêu cầu nạp tiền thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeposit = async () => {
    if (!activeDeposit) return;
    setConfirming(true);
    try {
      const data = await axiosClient.post(
        `/deposits/${activeDeposit._id}/confirm`,
      );
      updateBalance(data.newBalance);
      setSuccessMsg(
        `Nạp thành công +${formatVND(activeDeposit.amount)} vào ví!`,
      );
      setActiveDeposit(null);
      fetchHistory();
    } catch (err) {
      alert(err.message || "Xác nhận nạp tiền thất bại");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0e1424] to-cyan-950/40 border border-amber-500/25 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>NẠP TIỀN TỰ ĐỘNG VIETQR 24/7</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Nạp Tiền Vào Ví Tài Khoản
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Cộng tiền tự động ngay lập tức sau khi quét mã QR hoặc chuyển khoản
            đúng cú pháp.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">
              Số dư khả dụng hiện tại:
            </div>
            <div className="text-xl font-black text-cyan-400 font-display">
              {formatVND(user?.balance || 0)}
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-6">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bước 1: Chọn số tiền cần nạp</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedAmount === amt && !customAmount
                      ? "bg-amber-500 text-black border-amber-400 shadow-md"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {formatVND(amt)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Hoặc nhập số tiền tuỳ chọn (VNĐ):
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Ví dụ: 350000"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleCreateDeposit}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <QrCode className="w-4 h-4" />
              <span>
                {loading ? "Đang Tạo Mã..." : "Tạo Mã Quét VietQR Thanh Toán"}
              </span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-[#0c111e] border border-slate-800/80 space-y-4 text-xs">
            <div className="font-bold text-white flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Quy Định & Hỗ Trợ Nạp Tiền</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  Nội dung chuyển khoản là duy nhất cho mỗi giao dịch. Vui lòng
                  ghi chính xác để hệ thống tự động cộng tiền.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  Số tiền nạp tối thiểu là 10.000 đ. Hoàn toàn không mất phí
                  chiết khấu giao dịch ngân hàng.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  Nếu sau 3 phút chưa thấy cộng tiền, hãy liên hệ ngay Hotline:
                  0988.889.999 để được hỗ trợ tức thì.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {activeDeposit ? (
            <div className="p-6 rounded-3xl bg-[#0e1424] border border-cyan-500/40 shadow-2xl space-y-5">
              <div className="text-center space-y-1">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Bước 2: Quét Mã QR & Chuyển Khoản
                </div>
                <div className="text-sm font-bold text-white">
                  Mở App Ngân Hàng Hoặc Ví MoMo/ZaloPay
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl w-fit mx-auto shadow-2xl">
                <img
                  src={activeDeposit.qrImageUrl}
                  alt="VietQR nạp tiền"
                  className="w-56 h-56 object-contain mx-auto"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-bold text-white">
                    {activeDeposit.bankCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-cyan-400">
                    <span>{activeDeposit.accountNumber}</span>
                    <button
                      onClick={() =>
                        handleCopy(activeDeposit.accountNumber, "stk")
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === "stk" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-bold text-white">
                    {activeDeposit.accountName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tiền nạp:</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {formatVND(activeDeposit.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nội dung CK:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <span>{activeDeposit.transferMemo}</span>
                    <button
                      onClick={() =>
                        handleCopy(activeDeposit.transferMemo, "memo")
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === "memo" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmDeposit}
                disabled={confirming}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>
                  {confirming
                    ? "Đang Kiểm Tra..."
                    : "Tôi Đã Chuyển Tiền (Xác Nhận Nạp)"}
                </span>
              </button>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0e1424]/60 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white">
                  Chưa có mã QR nào đang chờ
                </div>
                <div className="text-xs text-slate-400 max-w-xs mx-auto">
                  Hãy chọn số tiền bên cạnh và bấm "Tạo Mã Quét VietQR" để quét
                  mã thanh toán.
                </div>
              </div>
            </div>
          )}

          {depositsHistory.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Giao Dịch Nạp Tiền Gần Đây</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
                {depositsHistory.slice(0, 5).map((dep) => (
                  <div
                    key={dep._id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {formatVND(dep.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatDate(dep.createdAt)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dep.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {dep.status === "completed" ? "Thành công" : "Đang chờ"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
