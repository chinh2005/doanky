import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await axiosClient.get("/auth/profile");
      setUser(data);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const data = await axiosClient.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  };

  const demoLogin = async (role = "user") => {
    const data = await axiosClient.post("/auth/demo-login", { role });
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    setUser((prev) => (prev ? { ...prev, balance: newBalance } : null));
  };

  const refreshProfile = async () => {
    try {
      const data = await axiosClient.get("/auth/profile");
      setUser(data);
    } catch (err) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateBalance,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
