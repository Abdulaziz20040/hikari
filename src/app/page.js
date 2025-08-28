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
  CreditCard,
  ChevronDown,
  Smartphone
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TabBar from "../components/TabBar";
import "../app/globals.css";

const MobileHomePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [debtsData, setDebtsData] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [debtsTotal, setDebtsTotal] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedRange, setSelectedRange] = useState("Barchasi");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [activeCard, setActiveCard] = useState(null);

  const router = useRouter();

  const ranges = ["Barchasi", "1-hafta", "1-oy", "2-oy", "3-oy"];

  const cards = [
    { label: "Kirim", value: incomeTotal, icon: TrendingUp, color: "text-emerald-300" },
    { label: "Chiqim", value: expenseTotal, icon: TrendingDown, color: "text-red-300" },
    { label: "Qarzlar", value: debtsTotal, icon: CreditCard, color: "text-yellow-300" },
  ];

  const quickActions = [

    { icon: CreditCard, label: "Qarz", color: "bg-yellow-600", path: "/debts" },
    { icon: TrendingUp, label: "Kirim", color: "bg-blue-500", path: "/income" },
    { icon: TrendingDown, label: "Chiqim", color: "bg-red-500", path: "/expense" },
    { icon: BarChart3, label: "Hisobot", color: "bg-purple-500", path: "/reports" },
  ];

  const INCOME_API = "https://2921e26836d273ac.mokky.dev/kirim";
  const EXPENSE_API = "https://2921e26836d273ac.mokky.dev/chiqim";
  const DEBTS_API = "https://2921e26836d273ac.mokky.dev/qarzlar";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace(/,/g, " ");

  const handleCardClick = (index) => {
    setActiveCard(index);
    setTimeout(() => setActiveCard(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expenseRes, debtsRes] = await Promise.all([
        fetch(INCOME_API),
        fetch(EXPENSE_API),
        fetch(DEBTS_API)
      ]);

      const incomeJson = await incomeRes.json();
      const expenseJson = await expenseRes.json();
      const debtsJson = await debtsRes.json();

      setIncomeData(incomeJson);
      setExpenseData(expenseJson);
      setDebtsData(debtsJson);

      calculateTotals(incomeJson, expenseJson, debtsJson);
    } catch (error) {
      console.error("Ma'lumot olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("https://2921e26836d273ac.mokky.dev/notifications");
        const data = await res.json();
        const pendingCount = data.filter((n) => n.status === "pending").length;
        setNotifCount(pendingCount);
      } catch (err) {
        console.error("Notif fetch error:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const calculateTotals = (income, expense, debts) => {
    let filteredIncome = [...income];
    let filteredExpense = [...expense];
    let filteredDebts = [...debts];

    const now = new Date();
    let startDate = null;

    if (selectedRange !== "Barchasi") {
      startDate = new Date();
      if (selectedRange === "1-hafta") startDate.setDate(now.getDate() - 7);
      if (selectedRange === "1-oy") startDate.setMonth(now.getMonth() - 1);
      if (selectedRange === "2-oy") startDate.setMonth(now.getMonth() - 2);
      if (selectedRange === "3-oy") startDate.setMonth(now.getMonth() - 3);
    }

    if (startDate) {
      filteredIncome = filteredIncome.filter((item) => new Date(item.date) >= startDate);
      filteredExpense = filteredExpense.filter((item) => new Date(item.date) >= startDate);
      filteredDebts = filteredDebts.filter((item) => new Date(item.date) >= startDate);
    }

    const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = filteredExpense.reduce((sum, i) => sum + i.amount, 0);
    const totalDebts = filteredDebts.reduce((sum, d) => sum + d.amount, 0);

    setIncomeTotal(totalIncome);
    setExpenseTotal(totalExpense);
    setDebtsTotal(totalDebts);

    const transactions = [
      ...filteredIncome.map((item) => ({
        id: `income-${item.id}`,
        type: "income",
        title: item.description || "Kirim",
        amount: item.amount,
        date: item.date || "",
      })),
      ...filteredExpense.map((item) => ({
        id: `expense-${item.id}`,
        type: "expense",
        title: item.description || "Chiqim",
        amount: item.amount,
        date: item.date || "",
      })),
      ...filteredDebts.map((item) => ({
        id: `debt-${item.id}`,
        type: "debt",
        title: item.name || "Qarz",
        amount: item.amount,
        date: item.date || "",
      }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setRecentTransactions(transactions);
  };

  useEffect(() => {
    calculateTotals(incomeData, expenseData, debtsData);
  }, [selectedRange]);

  const balance = incomeTotal - expenseTotal;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Scrollable content */}
      <div className="flex-1  pb-28 overflow-y-auto">

        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
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
              <button
                onClick={() => router.push("/device")}
                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700">
                <Smartphone size={18} />
              </button>
              <button
                onClick={() => router.push("/notifications")}
                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 relative"
              >
                <Bell size={18} />
                {notifCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {notifCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className=" h-[300px]">
          {/* Balance Card */}
          <div className="p-4 sm:p-6 max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 relative">
                  <Wallet size={22} className="text-blue-200" />

                  {/* Custom Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-lg border border-blue-400/30 rounded-xl text-blue-200 text-sm sm:text-base font-medium hover:bg-white/20 transition"
                    >
                      <span>{selectedRange}</span>
                      <ChevronDown size={16} className="text-blue-200" />
                    </button>

                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-40 bg-gray-900/95 backdrop-blur-xl border border-blue-400/20 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {ranges.map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              setSelectedRange(range);
                              setDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition ${selectedRange === range
                              ? "bg-blue-600/30 text-blue-300"
                              : "text-gray-300 hover:bg-white/10 hover:text-blue-200"
                              }`}
                          >
                            {range}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 bg-white/20 rounded-xl"
                >
                  {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="mb-6">
                <motion.h2
                  key={balance}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold text-white mb-2 break-words"
                  style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)" }}
                >
                  {loading
                    ? "Yuklanmoqda..."
                    : showBalance
                      ? formatCurrency(balance)
                      : "*** *** ***"}
                </motion.h2>
                <p className="text-blue-200 text-xs sm:text-sm">
                  Davr foydasi: {loading ? "..." : formatCurrency(balance)}
                </p>
              </div>

              <div className="overflow-x-auto py-2 no-scrollbar">
                <div className="flex space-x-3 sm:space-x-4 relative">
                  {cards.map(({ label, value, icon: Icon, color }, index) => {
                    const isActive = activeCard === index;
                    const baseWidth = 120;
                    const expandedWidth = 170; // click bo‘lganda kengayadigan width
                    return (
                      <motion.div
                        key={label}
                        onClick={() => handleCardClick(index)}
                        whileHover={{ width: expandedWidth, transition: { duration: 0.8, ease: "easeInOut" } }}
                        animate={{
                          width: isActive ? expandedWidth : baseWidth,
                          transition: { duration: 0.8, ease: "easeInOut" },
                        }}
                        className="bg-white/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 cursor-pointer flex-shrink-0 relative overflow-hidden"
                        style={{
                          perspective: 1000,
                          transformOrigin: "left",
                          zIndex: isActive ? 10 : 1,
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                          <Icon size={18} className={color} />
                          <span className="text-xs sm:text-sm truncate" style={{ maxWidth: '80%' }}>
                            {label}
                          </span>
                        </div>
                        <p
                          className={`font-bold ${color} truncate`}
                          style={{
                            // fontSize: "clamp(1rem, 4vw, 1.5rem)",
                            maxWidth: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {loading ? "..." : showBalance ? formatCurrency(value) : "***"}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
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
                            : transaction.type === "expense"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                            }`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp size={18} />
                          ) : transaction.type === "expense" ? (
                            <TrendingDown size={18} />
                          ) : (
                            <CreditCard size={18} />
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
                          color: transaction.type === "income" ? "#34d399" :
                            transaction.type === "expense" ? "#f87171" : "#facc15",
                        }}
                      >
                        {transaction.type === "income" ? "+" :
                          transaction.type === "expense" ? "-" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
