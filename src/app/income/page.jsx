"use client";
import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Plus, Calendar, Filter, MoreVertical, Trash2, Loader2, Tag,
    ChevronDown
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../app/globals.css";

const IncomePage = () => {
    const API_URL = "https://2921e26836d273ac.mokky.dev/kirim";

    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // ✅ Dropdown uchun state




    const [newIncome, setNewIncome] = useState({
        amount: '',
        description: '',
        category: 'kundalik ehtyoj'
    });

    const [filters, setFilters] = useState({
        dateRange: 'Barchasi',
        customDate: null,
        category: 'Barchasi'
    });

    const [incomes, setIncomes] = useState([]);

    const dateRanges = ['Barchasi', 'Bugun', 'Kecha', 'Bu hafta', "O'tgan hafta", 'Bu oy', "O'tgan oy"];
    const categories = [
        { value: "kundalik ehtyoj", label: "Kundalik ehtiyoj" },
        { value: "kompaniya", label: "Kompaniya" },
        { value: "uzum market", label: "Uzum Market" },
        { value: "ehson", label: "Ehson" },
        { value: "soliq", label: "Soliq" }
    ];


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // ✅ API'dan ma'lumot olish
    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setIncomes(data.reverse());
        } catch (error) {
            console.error("Ma'lumot olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    // ✅ Delete funksiyasi
    const handleDeleteIncome = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setIncomes(prev => prev.filter(item => item.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("O'chirishda xatolik:", error);
        }
    };

    // ✅ Filtrlash logikasi
    const getDateFilter = (income, range, customDate) => {
        const today = new Date();
        const incomeDate = new Date(income.date);

        if (customDate) {
            return incomeDate.toDateString() === new Date(customDate).toDateString();
        }

        switch (range) {
            case 'Bugun':
                return incomeDate.toDateString() === today.toDateString();
            case 'Kecha':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                return incomeDate.toDateString() === yesterday.toDateString();
            case 'Bu hafta':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                return incomeDate >= startOfWeek;
            case "O'tgan hafta":
                const startLastWeek = new Date(today);
                startLastWeek.setDate(today.getDate() - today.getDay() - 7);
                const endLastWeek = new Date(today);
                endLastWeek.setDate(today.getDate() - today.getDay() - 1);
                return incomeDate >= startLastWeek && incomeDate <= endLastWeek;
            case 'Bu oy':
                return incomeDate.getMonth() === today.getMonth() && incomeDate.getFullYear() === today.getFullYear();
            case "O'tgan oy":
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);
                return incomeDate.getMonth() === lastMonth.getMonth() && incomeDate.getFullYear() === lastMonth.getFullYear();
            default:
                return true;
        }
    };

    const filteredIncomes = incomes.filter(income => {
        const matchDate = getDateFilter(income, filters.dateRange, filters.customDate);
        const matchCategory = filters.category === 'Barchasi' || income.category === filters.category;
        return matchDate && matchCategory;
    });

    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

    // ✅ Miqdorni validatsiya qilish
    const handleAmountChange = (e) => {
        let value = e.target.value.replace(/[^\d.]/g, "");
        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts[1];
        }
        setNewIncome({ ...newIncome, amount: value });
    };

    // ✅ Yangi kirim qo‘shish
    const handleAddIncome = async () => {
        if (newIncome.amount && newIncome.description) {
            const income = {
                amount: parseFloat(newIncome.amount),
                description: newIncome.description,
                category: newIncome.category,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
            };

            try {
                await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(income)
                });
                fetchIncomes();
                setNewIncome({ amount: '', description: '', category: 'kompaniya' });
                setShowAddModal(false);
            } catch (error) {
                console.error("Kirim qo'shishda xatolik:", error);
            }
        }
    };

    const resetFilters = () => {
        setFilters({
            dateRange: 'Barchasi',
            customDate: null,
            category: 'Barchasi'
        });
        setShowFilterModal(false);
    };

    const activeFiltersCount =
        (filters.dateRange !== 'Barchasi' || filters.customDate || filters.category !== 'Barchasi') ? 1 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20 overflow-y-auto no-scrollbar">
            {/* ✅ Loading */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                </div>
            )}

            {/* Header */}
            <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold">Kirimlar</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="relative bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            <Filter size={20} className="text-gray-300" />
                            {activeFiltersCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white">{activeFiltersCount}</span>
                                </div>
                            )}
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                        >
                            <Plus size={20} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Income */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 shadow-2xl">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        {loading ? "Yuklanmoqda..." : formatCurrency(totalIncome)}
                    </h2>
                    <p className="text-emerald-200">
                        {activeFiltersCount > 0 ?
                            `${filteredIncomes.length} ta filtrlangan tranzaksiya` :
                            `Jami ${incomes.length} ta tranzaksiya`}
                    </p>
                </div>
            </div>

            {/* ✅ Kirimlar ro'yxati */}
            <div className="px-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Kirimlar ro'yxati</h3>
                    <span className="text-sm text-gray-400">{filteredIncomes.length} ta</span>
                </div>

                {filteredIncomes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Natija topilmadi</h3>
                        <p className="text-gray-400">Tanlangan filtrlar bo'yicha kirimlar topilmadi</p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-xl transition-colors"
                        >
                            Filtrlarni tozalash
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredIncomes.map((income) => (
                            <div
                                key={income.id}
                                className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/70 transition-colors relative"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 mt-1">
                                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                                            <TrendingUp size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{income.description}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <span>{income.date}</span>
                                                <span>•</span>
                                                <span>{income.time}</span>
                                                <span>•</span>
                                                <span className="capitalize text-[12px] text-emerald-400 absolute top-0 left-4">{income.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-lg font-semibold text-emerald-400">
                                            +{formatCurrency(income.amount)}
                                        </div>
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === income.id ? null : income.id)}
                                            className="p-2 hover:bg-gray-700 rounded-xl"
                                        >
                                            <MoreVertical size={20} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* ✅ Delete menyusi */}
                                {openMenuId === income.id && (
                                    <div className="absolute right-4 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-lg w-32 z-50">
                                        <button
                                            onClick={() => handleDeleteIncome(income.id)}
                                            className="flex items-center space-x-2 w-full text-red-500 hover:bg-gray-800 px-4 py-2 rounded-xl"
                                        >
                                            <Trash2 size={18} />
                                            <span>O'chirish</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Filtr</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <Plus size={20} className="text-gray-300 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Sana bo'yicha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                                    <Calendar size={16} />
                                    <span>Sana bo'yicha</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {dateRanges.map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setFilters({ ...filters, dateRange: range, customDate: null })}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${filters.dateRange === range
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kategoriya bo'yicha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                                    <Tag size={16} />
                                    <span>Kategoriya</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setFilters({ ...filters, category: 'Barchasi' })}
                                        className={`p-3 rounded-xl text-sm font-medium transition-all ${filters.category === 'Barchasi'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                    >
                                        Barchasi
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilters({ ...filters, category: cat })}
                                            className={`p-3 rounded-xl text-sm font-medium capitalize transition-all ${filters.category === cat
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Maxsus sana</label>
                                <DatePicker
                                    selected={filters.customDate}
                                    onChange={(date) => setFilters({ ...filters, customDate: date, dateRange: 'Barchasi' })}
                                    dateFormat="yyyy-MM-dd"
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                                    calendarClassName="bg-gray-900 text-white"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={resetFilters}
                                className="flex-1 bg-gray-700 p-4 rounded-xl font-semibold text-white hover:bg-gray-600 transition-colors"
                            >
                                Tozalash
                            </button>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="flex-1 bg-blue-500 p-4 rounded-xl font-semibold text-white hover:bg-blue-600 transition-colors"
                            >
                                Qo'llash
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Add Income Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Kirim qo'shish</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <Plus size={20} className="text-gray-300 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Miqdor */}
                            <input
                                type="text"
                                value={newIncome.amount}
                                onChange={handleAmountChange}
                                placeholder="Miqdor"
                                className="w-full p-3 bg-gray-800 rounded-xl text-white"
                            />

                            {/* Tavsif */}
                            <input
                                type="text"
                                placeholder="Tavsif"
                                value={newIncome.description}
                                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />

                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kategoriya
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-medium shadow-md hover:border-emerald-400 transition duration-300"
                                >
                                    {newIncome.category ? (
                                        <span>
                                            {categories.find((cat) => cat.value === newIncome.category)?.label}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Tanlang</span>
                                    )}
                                    <ChevronDown
                                        className={`w-5 h-5 text-emerald-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="absolute bottom-full mb-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden animate-fade-in-up z-50">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat.value}
                                                onClick={() => {
                                                    setNewIncome({ ...newIncome, category: cat.value });
                                                    setIsOpen(false);
                                                }}
                                                className="px-4 py-3 hover:bg-emerald-500/20 cursor-pointer text-white transition"
                                            >
                                                {cat.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>


                            {/* Qo‘shish tugmasi */}
                            <button
                                onClick={handleAddIncome}
                                disabled={!newIncome.amount || !newIncome.description || !newIncome.category}
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-xl font-semibold text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                            >
                                Qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomePage;
