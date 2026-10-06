import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { formatVND, formatDate } from "../utils/formatters";
import {
  ShieldCheck,
  Gamepad2,
  CreditCard,
  ShoppingBag,
  Wallet,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Users,
  Search,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [activeTab, setActiveTab] = useState("accounts");
  const [loading, setLoading] = useState(true);

  const [isAddAccModalOpen, setIsAddAccModalOpen] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [editPriceInput, setEditPriceInput] = useState("");
  const [searchAccText, setSearchAccText] = useState("");

  const [newAccForm, setNewAccForm] = useState({
    game: "Liên Quân",
    title: "",
    code: "",
    price: "",
    originalPrice: "",
    rank: "Cao Thủ",
    skinCount: "",
    heroCount: "",
    loginType: "Garena trắng thông tin",
    images: "",
    description: "",
    badge: "HOT",
    highlightSkins: "",
    username: "",
    password: "",
    note: "Đổi mật khẩu và email ngay sau khi nhận.",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsData, accData, cardData, orderData, depositData] =
        await Promise.all([
          axiosClient.get("/admin/stats"),
          axiosClient.get("/admin/accounts"),
          axiosClient.get("/admin/cards"),
          axiosClient.get("/admin/orders"),
          axiosClient.get("/admin/deposits"),
        ]);
      setStats(statsData);
      setAccounts(accData);
      setCards(cardData);
      setOrders(orderData);
      setDeposits(depositData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const imgArray = newAccForm.images
        ? newAccForm.images.split(",").map((s) => s.trim())
        : ["/img/anh_acc_default.png"];
      const skinArray = newAccForm.highlightSkins
        ? newAccForm.highlightSkins.split(",").map((s) => s.trim())
        : [];

      await axiosClient.post("/admin/accounts", {
        game: newAccForm.game,
        title: newAccForm.title,
        code: newAccForm.code || undefined,
        price: Number(newAccForm.price),
        originalPrice:
          Number(newAccForm.originalPrice) || Number(newAccForm.price),
        rank: newAccForm.rank,
        skinCount: Number(newAccForm.skinCount) || 0,
        heroCount: Number(newAccForm.heroCount) || 0,
        loginType: newAccForm.loginType,
        images: imgArray,
        description: newAccForm.description,
        badge: newAccForm.badge,
        highlightSkins: skinArray,
        accountDetails: {
          username: newAccForm.username,
          password: newAccForm.password,
          note: newAccForm.note,
        },
      });

      setIsAddAccModalOpen(false);
      setNewAccForm({
        game: "Liên Quân",
        title: "",
        code: "",
        price: "",
        originalPrice: "",
        rank: "Cao Thủ",
        skinCount: "",
        heroCount: "",
        loginType: "Garena trắng thông tin",
        images: "",
        description: "",
        badge: "HOT",
        highlightSkins: "",
        username: "",
        password: "",
        note: "Đổi mật khẩu và email ngay sau khi nhận.",
      });
      fetchAllData();
    } catch (err) {
      alert(err.message || "Thêm tài khoản thất bại");
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tài khoản này không?"))
      return;
    try {
      await axiosClient.delete(`/admin/accounts/${id}`);
      setAccounts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message || "Xoá thất bại");
    }
  };

  const handleUpdatePrice = async (accId) => {
    const newPrice = Number(editPriceInput);
    if (!newPrice || newPrice <= 0) return;
    try {
      const updated = await axiosClient.put(`/admin/accounts/${accId}`, {
        price: newPrice,
      });
      setAccounts((prev) => prev.map((a) => (a._id === accId ? updated : a)));
      setEditAcc(null);
      setEditPriceInput("");
    } catch (err) {
      alert(err.message || "Cập nhật giá thất bại");
    }
  };

  const handleToggleStatus = async (acc) => {
    const nextStatus = acc.status === "available" ? "sold" : "available";
    try {
      const updated = await axiosClient.put(`/admin/accounts/${acc._id}`, {
        status: nextStatus,
      });
      setAccounts((prev) => prev.map((a) => (a._id === acc._id ? updated : a)));
    } catch (err) {
      alert(err.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleUpdateCardDiscount = async (cardId, currentRate) => {
    const newRate = prompt("Nhập tỷ lệ chiết khấu mới (%)", currentRate);
    if (newRate === null || isNaN(Number(newRate))) return;
    try {
      const updated = await axiosClient.put(`/admin/cards/${cardId}`, {
        discountRate: Number(newRate),
      });
      setCards((prev) => prev.map((c) => (c._id === cardId ? updated : c)));
    } catch (err) {
      alert(err.message || "Cập nhật thất bại");
    }
  };

  const handleApproveDeposit = async (depId) => {
    try {
      await axiosClient.put(`/admin/deposits/${depId}/approve`);
      fetchAllData();
    } catch (err) {
      alert(err.message || "Duyệt thất bại");
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    if (!searchAccText.trim()) return true;
    const q = searchAccText.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.code?.toLowerCase().includes(q) ||
      a.game?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0e1424] to-cyan-950/60 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>TRUNG TÂM ĐIỀU HÀNH SHOP GAME</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Bảng Quản Trị Hệ Thống (Admin)
          </h1>
          <div className="text-xs text-slate-400">
            Xin chào,{" "}
            <span className="text-cyan-400 font-bold">{user?.name}</span>. Bạn
            có toàn quyền quản lý kho tài khoản, thẻ và doanh thu.
          </div>
        </div>

        <button
          onClick={() => setIsAddAccModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs uppercase tracking-wider shadow-neon-cyan transition flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tài Khoản Game Mới</span>
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e1424] border border-cyan-500/30 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tổng Doanh Thu</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 font-display">
              {formatVND(stats.totalRevenue)}
            </div>
            <div className="text-[11px] text-slate-400">
              {stats.totalOrders} đơn hàng hoàn tất
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1424] border border-purple-500/30 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Kho Acc Game</span>
              <Gamepad2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400 font-display">
              {stats.totalAccounts} Acc
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">
                {stats.availableAccounts} còn hàng
              </span>{" "}
              • {stats.soldAccounts} đã bán
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1424] border border-pink-500/30 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Người Dùng</span>
              <Users className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-pink-400 font-display">
              {stats.totalUsers} Thành viên
            </div>
            <div className="text-[11px] text-slate-400">Đăng ký mua sắm</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1424] border border-amber-500/30 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Nạp Tiền Đang Chờ</span>
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-display">
              {stats.pendingDeposits} Yêu cầu
            </div>
            <div className="text-[11px] text-slate-400">Cần phê duyệt</div>
          </div>
        </div>
      )}

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
          <span>Quản Lý Acc Game ({accounts.length})</span>
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
          <span>Quản Lý Thẻ & Chiết Khấu ({cards.length})</span>
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
          <span>Đơn Hàng Hệ Thống ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("deposits")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 whitespace-nowrap ${
            activeTab === "deposits"
              ? "bg-amber-500 text-black border-amber-400"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Yêu Cầu Nạp Tiền ({deposits.length})</span>
        </button>
      </div>

      {activeTab === "accounts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchAccText}
                onChange={(e) => setSearchAccText(e.target.value)}
                placeholder="Tìm mã acc, tên acc, game..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <div className="text-xs text-slate-400">
              Hiển thị:{" "}
              <span className="text-white font-bold">
                {filteredAccounts.length}
              </span>{" "}
              tài khoản
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0e1424]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Mã & Ảnh</th>
                  <th className="p-3.5">Tựa Game & Tiêu Đề</th>
                  <th className="p-3.5">Rank & Skin</th>
                  <th className="p-3.5">Giá Bán (VNĐ)</th>
                  <th className="p-3.5">Trạng Thái</th>
                  <th className="p-3.5">Tài Khoản Bàn Giao</th>
                  <th className="p-3.5 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAccounts.map((acc) => (
                  <tr
                    key={acc._id}
                    className="hover:bg-slate-900/60 transition"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={acc.images?.[0]}
                          alt={acc.title}
                          className="w-12 h-8 rounded-lg object-cover border border-slate-700"
                        />
                        <span className="font-mono font-bold text-cyan-400">
                          #{acc.code}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-white truncate">
                        {acc.title}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-semibold">
                        {acc.game}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-amber-400">
                        {acc.rank}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {acc.skinCount} trang phục
                      </div>
                    </td>

                    <td className="p-3.5">
                      {editAcc?._id === acc._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editPriceInput}
                            onChange={(e) => setEditPriceInput(e.target.value)}
                            className="w-24 px-2 py-1 rounded bg-slate-950 border border-cyan-400 text-white text-xs"
                            placeholder="Giá mới"
                          />
                          <button
                            onClick={() => handleUpdatePrice(acc._id)}
                            className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-400"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditAcc(null)}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-black text-cyan-400 font-display">
                            {formatVND(acc.price)}
                          </span>
                          <button
                            onClick={() => {
                              setEditAcc(acc);
                              setEditPriceInput(acc.price);
                            }}
                            className="p-1 text-slate-400 hover:text-cyan-400 transition"
                            title="Điều chỉnh giá"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleStatus(acc)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          acc.status === "available"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40"
                        }`}
                        title="Click để đổi trạng thái"
                      >
                        {acc.status === "available" ? "Còn hàng" : "Đã bán"}
                      </button>
                    </td>

                    <td className="p-3.5 font-mono text-[11px]">
                      <div>
                        User:{" "}
                        <span className="text-white font-bold">
                          {acc.accountDetails?.username}
                        </span>
                      </div>
                      <div>
                        Pass:{" "}
                        <span className="text-emerald-400 font-bold">
                          {acc.accountDetails?.password}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteAccount(acc._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                        title="Xoá tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card._id}
              className="p-5 rounded-2xl bg-[#0e1424] border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={card.logo}
                    alt={card.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="font-bold text-white text-sm">
                      {card.name}
                    </div>
                    <div className="text-[11px] text-slate-400 uppercase">
                      {card.type}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
                  -{card.discountRate}%
                </span>
              </div>

              <div className="text-xs text-slate-300">{card.description}</div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Trạng thái: Hoạt động
                </span>
                <button
                  onClick={() =>
                    handleUpdateCardDiscount(card._id, card.discountRate)
                  }
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Đổi Chiết Khấu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0e1424]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Mã Đơn</th>
                <th className="p-3.5">Khách Hàng</th>
                <th className="p-3.5">Món Hàng</th>
                <th className="p-3.5">Tổng Tiền</th>
                <th className="p-3.5">Kênh TT</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3.5 font-mono font-bold text-cyan-400">
                    {ord.orderCode}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">
                      {ord.user?.name || "Khách vãng lai"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ord.user?.email}
                    </div>
                  </td>
                  <td className="p-3.5 max-w-xs truncate">
                    {ord.items?.map((i) => i.title).join(", ")}
                  </td>
                  <td className="p-3.5 font-black text-cyan-400 font-display">
                    {formatVND(ord.totalAmount)}
                  </td>
                  <td className="p-3.5 capitalize">{ord.paymentMethod}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {ord.paymentStatus === "completed"
                        ? "Hoàn tất"
                        : "Chờ TT"}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {formatDate(ord.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "deposits" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0e1424]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Mã Giao Dịch</th>
                <th className="p-3.5">Người Nạp</th>
                <th className="p-3.5">Số Tiền</th>
                <th className="p-3.5">Nội Dung Chuyển</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Thời Gian</th>
                <th className="p-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deposits.map((dep) => (
                <tr key={dep._id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3.5 font-mono font-bold text-amber-400">
                    {dep.depositCode}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{dep.user?.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {dep.user?.email}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400 font-display">
                    +{formatVND(dep.amount)}
                  </td>
                  <td className="p-3.5 font-mono text-cyan-300">
                    {dep.transferMemo}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dep.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {dep.status === "completed" ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {formatDate(dep.createdAt)}
                  </td>
                  <td className="p-3.5 text-right">
                    {dep.status === "pending" && (
                      <button
                        onClick={() => handleApproveDeposit(dep._id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition"
                      >
                        Duyệt Nạp
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAddAccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0e1424] border border-cyan-500/40 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Thêm Tài Khoản Game Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddAccModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateAccount}
              className="overflow-y-auto py-4 space-y-4 flex-1 pr-1 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Game:</label>
                  <select
                    value={newAccForm.game}
                    onChange={(e) =>
                      setNewAccForm({ ...newAccForm, game: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Liên Quân">Liên Quân Mobile</option>
                    <option value="PUBG">PUBG (PC & Mobile)</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Genshin Impact">Genshin Impact</option>
                    <option value="Free Fire">Free Fire</option>
                    <option value="FC Online">FC Online</option>
                    <option value="Tốc Chiến">Tốc Chiến</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Mã Acc (Tự tạo nếu trống):
                  </label>
                  <input
                    type="text"
                    value={newAccForm.code}
                    onChange={(e) =>
                      setNewAccForm({ ...newAccForm, code: e.target.value })
                    }
                    placeholder="VD: LQ-9999"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Tiêu đề tài khoản:
                </label>
                <input
                  type="text"
                  value={newAccForm.title}
                  onChange={(e) =>
                    setNewAccForm({ ...newAccForm, title: e.target.value })
                  }
                  placeholder="VD: Acc Liên Quân Nakroth Thứ Nguyên Vệ Thần..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Giá bán khuyến mãi (VNĐ):
                  </label>
                  <input
                    type="number"
                    value={newAccForm.price}
                    onChange={(e) =>
                      setNewAccForm({ ...newAccForm, price: e.target.value })
                    }
                    placeholder="VD: 850000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Giá gốc (VNĐ):
                  </label>
                  <input
                    type="number"
                    value={newAccForm.originalPrice}
                    onChange={(e) =>
                      setNewAccForm({
                        ...newAccForm,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="VD: 1500000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cấp Rank:</label>
                  <input
                    type="text"
                    value={newAccForm.rank}
                    onChange={(e) =>
                      setNewAccForm({ ...newAccForm, rank: e.target.value })
                    }
                    placeholder="Cao Thủ 30 Sao"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Số Skin:</label>
                  <input
                    type="number"
                    value={newAccForm.skinCount}
                    onChange={(e) =>
                      setNewAccForm({
                        ...newAccForm,
                        skinCount: e.target.value,
                      })
                    }
                    placeholder="250"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Badge:</label>
                  <input
                    type="text"
                    value={newAccForm.badge}
                    onChange={(e) =>
                      setNewAccForm({ ...newAccForm, badge: e.target.value })
                    }
                    placeholder="HOT DEAL / VIP"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Link Ảnh (cách nhau bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  value={newAccForm.images}
                  onChange={(e) =>
                    setNewAccForm({ ...newAccForm, images: e.target.value })
                  }
                  placeholder="/img/anh_acc1.png, /img/anh_acc1_phu.png"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-3">
                <div className="font-bold text-cyan-400 uppercase text-[11px]">
                  Thông Tin Bàn Giao (Tự động gửi cho khách sau khi thanh toán):
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Tên đăng nhập:
                    </label>
                    <input
                      type="text"
                      value={newAccForm.username}
                      onChange={(e) =>
                        setNewAccForm({
                          ...newAccForm,
                          username: e.target.value,
                        })
                      }
                      placeholder="Username bàn giao"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Mật khẩu:
                    </label>
                    <input
                      type="text"
                      value={newAccForm.password}
                      onChange={(e) =>
                        setNewAccForm({
                          ...newAccForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="Password bàn giao"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Ghi chú bàn giao:
                  </label>
                  <input
                    type="text"
                    value={newAccForm.note}
                    onChange={(e) =>
                      setNewAccForm({ ...newAccForm, note: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Mô tả chi tiết:
                </label>
                <textarea
                  value={newAccForm.description}
                  onChange={(e) =>
                    setNewAccForm({
                      ...newAccForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider shadow-neon-cyan transition"
                >
                  Xác Nhận Thêm Tài Khoản Lên Sàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
