import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AccountCard from "../components/AccountCard";
import {
  Search,
  Filter,
  RotateCcw,
  Gamepad2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

const AccountsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeGame = searchParams.get("game") || "Tất cả";
  const activeSearch = searchParams.get("search") || "";
  const activeSort = searchParams.get("sort") || "newest";
  const activePriceRange = searchParams.get("priceRange") || "all";

  const [searchInput, setSearchInput] = useState(activeSearch);

  const games = [
    "Tất cả",
    "Liên Quân",
    "PUBG",
    "Valorant",
    "Genshin Impact",
    "Free Fire",
    "FC Online",
    "Tốc Chiến",
  ];

  const priceRanges = [
    { label: "Tất cả mức giá", value: "all" },
    { label: "Dưới 500.000 đ", value: "under_500" },
    { label: "500k - 1.000.000 đ", value: "500_1000" },
    { label: "1Tr - 2.000.000 đ", value: "1000_2000" },
    { label: "Trên 2.000.000 đ", value: "over_2000" },
  ];

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeGame !== "Tất cả") params.append("game", activeGame);
      if (activeSearch) params.append("search", activeSearch);
      if (activeSort) params.append("sort", activeSort);

      if (activePriceRange === "under_500") {
        params.append("maxPrice", "500000");
      } else if (activePriceRange === "500_1000") {
        params.append("minPrice", "500000");
        params.append("maxPrice", "1000000");
      } else if (activePriceRange === "1000_2000") {
        params.append("minPrice", "1000000");
        params.append("maxPrice", "2000000");
      } else if (activePriceRange === "over_2000") {
        params.append("minPrice", "2000000");
      }

      const data = await axiosClient.get(`/accounts?${params.toString()}`);
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeGame, activeSearch, activeSort, activePriceRange]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "Tất cả" && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e1424] to-slate-900/90 border border-cyan-500/20 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              <span>HỆ THỐNG KHO ACC GAME CHÍNH HÃNG</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              Tìm Kiếm & Lọc Tài Khoản Game
            </h1>
          </div>

          <button
            onClick={resetFilters}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt Lại Bộ Lọc</span>
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên trang phục, tên game, cấp rank, mã số acc..."
            className="w-full pl-11 pr-32 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 shadow-inner"
          />
          <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-3.5 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
          >
            Tìm Acc
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {games.map((game) => (
            <button
              key={game}
              onClick={() => updateParam("game", game)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeGame === game
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-neon-cyan"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Khoảng giá thanh toán:
            </label>
            <select
              value={activePriceRange}
              onChange={(e) => updateParam("priceRange", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            >
              {priceRanges.map((pr) => (
                <option key={pr.value} value={pr.value}>
                  {pr.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Sắp xếp theo:
            </label>
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="newest">Mới cập nhật</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="skins_desc">Nhiều trang phục nhất</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Đang hiển thị:</span>
              <span className="font-bold text-cyan-400">
                {accounts.length} tài khoản
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="text-base font-bold text-white">
              Không tìm thấy tài khoản game phù hợp
            </div>
            <div className="text-xs text-slate-400 max-w-sm mx-auto">
              Vui lòng thử tìm với từ khoá khác hoặc đặt lại bộ lọc để xem toàn
              bộ danh mục tài khoản.
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition"
          >
            Xem Toàn Bộ Acc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
