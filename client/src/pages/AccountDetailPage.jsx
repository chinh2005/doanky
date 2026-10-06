import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { formatVND } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PaymentModal from "../components/PaymentModal";
import AccountCard from "../components/AccountCard";
import {
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Award,
  Flame,
  AlertCircle,
} from "lucide-react";

const AccountDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [account, setAccount] = useState(null);
  const [similarAccounts, setSimilarAccounts] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get(`/accounts/${id}`);
        setAccount(data);
        setSelectedImg(data.images?.[0] || "");

        const similar = await axiosClient.get(
          `/accounts?game=${encodeURIComponent(data.game)}&status=available`,
        );
        setSimilarAccounts(
          similar.filter((a) => a._id !== data._id).slice(0, 3),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-slate-400 text-sm">
          Đang tải thông tin tài khoản...
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <div className="text-lg font-bold text-white">
          Không tìm thấy tài khoản game
        </div>
        <Link
          to="/accounts"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isSold = account.status === "sold";
  const discountPercent = Math.round(
    ((account.originalPrice - account.price) / account.originalPrice) * 100,
  );

  const handleBuyNow = () => {
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
    if (!user) {
      navigate("/login");
      return;
    }
    setIsPaymentOpen(true);
  };

  const handleAddToCartOnly = () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div>
        <Link
          to="/accounts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại kho acc {account.game}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={selectedImg || account.images?.[0]}
              alt={account.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-cyan-500 text-black shadow-md">
                {account.game}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/70 backdrop-blur-md text-cyan-300 font-mono border border-cyan-500/30">
                #{account.code}
              </span>
            </div>

            {isSold && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <span className="px-6 py-2 rounded-2xl border-2 border-rose-500 bg-rose-950/80 text-rose-300 text-base font-black tracking-widest uppercase rotate-[-6deg]">
                  TÀI KHOẢN ĐÃ ĐƯỢC BÁN
                </span>
              </div>
            )}
          </div>

          {account.images && account.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {account.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImg === img
                      ? "border-cyan-400 scale-105"
                      : "border-slate-800 opacity-60"
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-6 rounded-3xl bg-[#0d1220] border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Mô Tả & Thông Tin Chi Tiết
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {account.description ||
                "Tài khoản chuẩn chính chủ, bảo hành an toàn tuyệt đối."}
            </p>

            {account.highlightSkins && account.highlightSkins.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Trang phục / Vật phẩm nổi bật:
                </div>
                <div className="flex flex-wrap gap-2">
                  {account.highlightSkins.map((skin, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                    >
                      ★ {skin}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-cyan-500/30 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-white leading-snug">
                {account.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Tình trạng:</span>
                <span
                  className={`font-bold ${isSold ? "text-rose-400" : "text-emerald-400"}`}
                >
                  {isSold ? "Đã bán" : "Còn hàng sẵn sàng giao"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Bậc Rank</div>
                <div className="font-black text-amber-400 text-sm mt-0.5">
                  {account.rank}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Số Trang Phục</div>
                <div className="font-black text-cyan-400 text-sm mt-0.5">
                  {account.skinCount} Skin
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-slate-400 text-[11px]">
                  Số Tướng / Agents
                </div>
                <div className="font-black text-purple-400 text-sm mt-0.5">
                  {account.heroCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Loại Đăng Nhập</div>
                <div className="font-bold text-white text-xs mt-0.5 truncate">
                  {account.loginType}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                {account.originalPrice > account.price && (
                  <div className="text-xs text-slate-400 line-through">
                    {formatVND(account.originalPrice)}
                  </div>
                )}
                <div className="text-2xl font-black text-cyan-400 font-display">
                  {formatVND(account.price)}
                </div>
              </div>
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black">
                  Tiết kiệm {discountPercent}%
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleBuyNow}
                disabled={isSold}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-neon-cyan flex items-center justify-center gap-2 ${
                  isSold
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isSold ? "Tài Khoản Đã Bán" : "Mua Ngay Nhận Acc Liền (3s)"}
                </span>
              </button>

              <button
                onClick={handleAddToCartOnly}
                disabled={isSold}
                className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-500/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Cam Kết Bảo Hành Vàng</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Trắng
                  thông tin, đổi pass & mail ngay.
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Bàn giao
                  ngay tại trang Profile sau khi thanh toán.
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hoàn
                  tiền 100% nếu có bất kỳ lỗi thông tin nào.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {similarAccounts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">
              Tài Khoản {account.game} Cùng Loại
            </h2>
            <Link
              to={`/accounts?game=${encodeURIComponent(account.game)}`}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarAccounts.map((simAcc) => (
              <AccountCard key={simAcc._id} account={simAcc} />
            ))}
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  );
};

export default AccountDetailPage;
