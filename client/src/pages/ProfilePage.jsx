import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { formatVND, formatDate } from "../utils/formatters";
import {
  User,
  Wallet,
  Gamepad2,
  CreditCard,
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const ProfilePage = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("accounts");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [copiedKey, setCopiedKey] = useState("");

  const [newName, setNewName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await axiosClient.get("/orders/my-orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMsg("");
    try {
      await axiosClient.put("/auth/profile", {
        name: newName,
        password: newPassword || undefined,
      });
      await refreshProfile();
      setUpdateMsg("Cập nhật hồ sơ thành công!");
      setNewPassword("");
    } catch (err) {
      alert(err.message || "Cập nhật thất bại");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!user) return null;

  const purchasedAccounts = [];
  const purchasedCards = [];

  orders.forEach((order) => {
    if (order.deliveredData && order.paymentStatus === "completed") {
      order.deliveredData.forEach((item) => {
        if (item.itemType === "account") {
          purchasedAccounts.push({
            ...item,
            orderCode: order.orderCode,
            date: order.createdAt,
          });
        } else if (item.itemType === "card") {
          purchasedCards.push({
            ...item,
            orderCode: order.orderCode,
            date: order.createdAt,
          });
        }
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0e1424] to-slate-900 border border-cyan-500/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-neon-cyan"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500 text-black uppercase shadow-md">
              VIP {user.vipLevel || 1}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                {user.name}
              </h1>
              {user.role === "admin" && (
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                  Quản Trị Viên
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400">{user.email}</div>
            <div className="text-[11px] text-cyan-400 font-semibold">
              Thành viên chính thức • Bảo mật tài khoản cấp cao
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <div className="text-[11px] text-slate-400">Số dư ví của bạn:</div>
            <div className="text-xl font-black text-cyan-400 font-display">
              {formatVND(user.balance)}
            </div>
          </div>

          <button
            onClick={() => navigate("/deposit")}
            className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4" /> Nạp Tiền
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 whitespace-nowrap ${
            activeTab === "accounts"
              ? "bg-cyan-500 text-black border-cyan-400 shadow-neon-cyan"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Acc Game Đã Mua ({purchasedAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 whitespace-nowrap ${
            activeTab === "cards"
              ? "bg-purple-600 text-white border-purple-400 shadow-neon-purple"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Thẻ Cào Đã Mua ({purchasedCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-slate-800 text-white border-slate-600"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Toàn Bộ Đơn Hàng ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 whitespace-nowrap ${
            activeTab === "settings"
              ? "bg-slate-800 text-white border-slate-600"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Cập Nhật Thông Tin</span>
        </button>
      </div>

      {activeTab === "accounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Danh sách tài khoản game đã được bàn giao cho bạn:</span>
            <span className="text-cyan-400 font-bold">
              Hãy đổi mật khẩu sau khi nhận
            </span>
          </div>

          {purchasedAccounts.length === 0 ? (
            <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-white font-bold">
                Bạn chưa mua tài khoản game nào
              </div>
              <button
                onClick={() => navigate("/accounts")}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold"
              >
                Khám Phá Kho Acc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedAccounts.map((acc, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-[#0e1424] border border-cyan-500/30 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm truncate max-w-[260px]">
                      {acc.title}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {acc.orderCode}
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tài khoản:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          {acc.accountUsername}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(acc.accountUsername, `pacc-${index}`)
                          }
                          className="text-cyan-400 hover:text-white"
                        >
                          {copiedKey === `pacc-${index}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                          {acc.accountPassword}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(acc.accountPassword, `ppass-${index}`)
                          }
                          className="text-cyan-400 hover:text-white"
                        >
                          {copiedKey === `ppass-${index}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {acc.accountNote && (
                      <div className="text-[10px] text-amber-300/80 pt-1 font-sans border-t border-slate-900">
                        Lưu ý: {acc.accountNote}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Thời gian bàn giao: {formatDate(acc.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "cards" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Danh sách mã thẻ cào bạn đã mua thành công:</span>
            <span className="text-purple-400 font-bold">
              Mã cào và số Serial chuẩn 100%
            </span>
          </div>

          {purchasedCards.length === 0 ? (
            <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-white font-bold">
                Bạn chưa mua mã thẻ cào nào
              </div>
              <button
                onClick={() => navigate("/cards")}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Mua Thẻ Ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedCards.map((c, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-[#0e1424] border border-purple-500/30 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {c.title}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {formatVND(c.denomination)}
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Số Serial:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          {c.serialNumber}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(c.serialNumber, `psr-${index}`)
                          }
                          className="text-purple-400 hover:text-white"
                        >
                          {copiedKey === `psr-${index}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mã Cào (PIN):</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">
                          {c.pinCode}
                        </span>
                        <button
                          onClick={() => handleCopy(c.pinCode, `ppin-${index}`)}
                          className="text-purple-400 hover:text-white"
                        >
                          {copiedKey === `ppin-${index}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Thời gian mua: {formatDate(c.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-4 rounded-2xl bg-[#0e1424] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">
                      {ord.orderCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {ord.paymentStatus === "completed"
                        ? "Thành công"
                        : "Đang chờ xử lý"}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    {ord.items?.map((i) => i.title).join(" | ")}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {formatDate(ord.createdAt)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-cyan-400 font-display">
                    {formatVND(ord.totalAmount)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Hình thức:{" "}
                    {ord.paymentMethod === "wallet" ? "Số dư ví" : "VietQR"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-md p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-5">
          <h2 className="font-bold text-white text-base">
            Cập Nhật Thông Tin Cá Nhân
          </h2>

          {updateMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              {updateMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">
                Họ và tên hiển thị:
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Mật khẩu mới (bỏ trống nếu không đổi):
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow-neon-cyan"
            >
              {updateLoading ? "Đang Lưu..." : "Lưu Thay Đổi"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
