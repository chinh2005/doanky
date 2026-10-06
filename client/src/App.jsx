import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ParticleBg from "./components/ParticleBg";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

import HomePage from "./pages/HomePage";
import AccountsPage from "./pages/AccountsPage";
import AccountDetailPage from "./pages/AccountDetailPage";
import CardsPage from "./pages/CardsPage";
import DepositPage from "./pages/DepositPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="relative min-h-screen flex flex-col bg-[#07090e] text-slate-100 cyber-scanline">
            <ParticleBg />

            <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <CartDrawer />

            <main className="flex-1 relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/accounts/:id" element={<AccountDetailPage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/deposit" element={<DepositPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
