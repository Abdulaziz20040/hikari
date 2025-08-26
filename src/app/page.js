"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  Plus,
  Eye,
  EyeOff,
  Bell,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import TabBar from "../components/TabBar";
import "../app/globals.css"

const MobileHomePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const router = useRouter();

  const INCOME_API = "https://2921e26836d273ac.mokky.dev/kirim";
  const EXPENSE_API = "https://2921e26836d273ac.mokky.dev/chiqim";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(amount);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(INCOME_API),
        fetch(EXPENSE_API),
      ]);

      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();

      const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);

      setIncomeTotal(totalIncome);
      setExpenseTotal(totalExpense);

      const transactions = [
        ...incomeData.map((item) => ({
          id: `income-${item.id}`,
          type: "income",
          title: item.description || "Kirim",
          amount: item.amount,
          date: item.date || "",
        })),
        ...expenseData.map((item) => ({
          id: `expense-${item.id}`,
          type: "expense",
          title: item.description || "Chiqim",
          amount: item.amount,
          date: item.date || "",
        })),
      ];

      const sortedTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentTransactions(sortedTransactions);
    } catch (error) {
      console.error("Ma'lumot olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const balance = incomeTotal - expenseTotal;

  const quickActions = [
    { icon: Plus, label: "Qo'shish", color: "bg-emerald-500", path: "/add" },
    { icon: TrendingUp, label: "Kirim", color: "bg-blue-500", path: "/income" },
    { icon: TrendingDown, label: "Chiqim", color: "bg-red-500", path: "/expense" },
    { icon: BarChart3, label: "Hisobot", color: "bg-purple-500", path: "/report" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Scroll qismi */}
      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between p-4 sm:p-6 max-w-lg mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Hikari</h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  {currentTime.toLocaleDateString("uz-UZ")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700">
                <Search size={18} />
              </button>
              <button className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 relative">
                <Bell size={18} />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="p-4 sm:p-6 max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet size={22} className="text-blue-200" />
                <span className="text-sm sm:text-base text-blue-200 font-medium">
                  Umumiy balans
                </span>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 bg-white/20 rounded-xl"
              >
                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="mb-6">
              <h2
                className="font-bold text-white mb-2 break-words"
                style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)" }}
              >
                {loading
                  ? "Yuklanmoqda..."
                  : showBalance
                    ? formatCurrency(balance)
                    : "*** *** ***"}
              </h2>
              <p className="text-blue-200 text-xs sm:text-sm">
                Bu oyda +{loading ? "..." : formatCurrency(incomeTotal - expenseTotal)} o'sish
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Kirim", value: incomeTotal, icon: TrendingUp, color: "text-emerald-300" },
                { label: "Chiqim", value: expenseTotal, icon: TrendingDown, color: "text-red-300" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/20 rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                    <Icon size={18} className={color} />
                    <span className="text-xs sm:text-sm">{label}</span>
                  </div>
                  <p
                    className={`font-bold ${color} truncate`}
                    style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
                  >
                    {loading ? "..." : showBalance ? formatCurrency(value) : "***"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-6 mb-6 max-w-lg mx-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-200">
            Tezkor amallar
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(action.path)}
                  className="flex flex-col items-center space-y-2 p-3 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50"
                >
                  <div className={`p-2 sm:p-3 ${action.color} rounded-xl shadow-lg`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 sm:px-6 mb-8 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-200">
              So'nggi amallar
            </h3>
            <button className="text-blue-400 text-xs sm:text-sm font-medium hover:text-blue-300">
              Barchasini ko'rish
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400 text-center">Yuklanmoqda...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-gray-400 text-center">Ma'lumot topilmadi</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-gray-800/50 rounded-2xl p-3 sm:p-4 hover:bg-gray-800/70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-xl ${transaction.type === "income"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                          }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp size={18} />
                        ) : (
                          <TrendingDown size={18} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm sm:text-base">{transaction.title}</h4>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400">
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="font-semibold text-right"
                      style={{
                        fontSize: "clamp(0.8rem, 3.5vw, 1.2rem)",
                        color: transaction.type === "income" ? "#34d399" : "#f87171",
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TabBar fixed */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <TabBar />
      </div>
    </div>
  );
};

export default MobileHomePage;
