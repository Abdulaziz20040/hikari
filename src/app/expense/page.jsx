"use client";
import React, { useState, useEffect } from 'react';
import {
    TrendingDown,
    Plus,
    Calendar,
    Filter,
    MoreVertical,
    Trash2,
    Tag,
    ChevronDown,
    Loader2
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../app/globals.css";

const ExpensePage = () => {
    const API_URL = "https://2921e26836d273ac.mokky.dev/chiqim";

    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [newExpense, setNewExpense] = useState({
        amount: '',
        description: '',
        category: 'kundalik ehtyoj'
    });
    const [filters, setFilters] = useState({
        dateRange: 'Barchasi',
        customDate: null,
        category: 'Barchasi'
    });
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Dropdown uchun
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const dateRanges = ['Barchasi', 'Bugun', 'Kecha', 'Bu hafta', 'O\'tgan hafta', 'Bu oy', 'O\'tgan oy'];

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

    // ✅ API'dan chiqimlarni olish
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setExpenses(data.reverse());
        } catch (error) {
            console.error("Ma'lumot olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // ✅ Chiqimni o‘chirish
    const handleDeleteExpense = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setExpenses(expenses.filter(exp => exp.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Chiqimni o‘chirishda xatolik:", error);
        }
    };

    // ✅ Filtrlash
    const getDateFilter = (expense, range, customDate) => {
        const today = new Date();
        const expenseDate = new Date(expense.date);

        if (customDate) {
            const custom = new Date(customDate);
            return expenseDate.toDateString() === custom.toDateString();
        }

        switch (range) {
            case 'Bugun':
                return expenseDate.toDateString() === today.toDateString();
            case 'Kecha':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                return expenseDate.toDateString() === yesterday.toDateString();
            case 'Bu hafta':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                return expenseDate >= startOfWeek;
            case 'O\'tgan hafta':
                const startLastWeek = new Date(today);
                startLastWeek.setDate(today.getDate() - today.getDay() - 7);
                const endLastWeek = new Date(today);
                endLastWeek.setDate(today.getDate() - today.getDay() - 1);
                return expenseDate >= startLastWeek && expenseDate <= endLastWeek;
            case 'Bu oy':
                return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
            case 'O\'tgan oy':
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);
                return expenseDate.getMonth() === lastMonth.getMonth() && expenseDate.getFullYear() === lastMonth.getFullYear();
            default:
                return true;
        }
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchDate = getDateFilter(expense, filters.dateRange, filters.customDate);
        const matchCategory = filters.category === 'Barchasi' || expense.category === filters.category;
        return matchDate && matchCategory;
    });

    const totalExpense = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // ✅ Yangi chiqim qo‘shish
    const handleAddExpense = async () => {
        if (newExpense.amount && newExpense.description && newExpense.category) {
            const expense = {
                amount: parseInt(newExpense.amount),
                description: newExpense.description,
                category: newExpense.category,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
            };

            try {
                await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(expense)
                });
                fetchExpenses();
                setNewExpense({ amount: '', description: '', category: 'kundalik ehtyoj' });
                setShowAddModal(false);
            } catch (error) {
                console.error("Chiqim qo'shishda xatolik:", error);
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

    const activeFiltersCount = (filters.dateRange !== 'Barchasi' || filters.customDate || filters.category !== 'Barchasi') ? 1 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20">
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
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <TrendingDown size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold">Chiqimlar</h1>
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
                            className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                        >
                            <Plus size={20} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Expense */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 shadow-2xl">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        {loading ? "Yuklanmoqda..." : formatCurrency(totalExpense)}
                    </h2>
                    <p className="text-red-200">
                        {activeFiltersCount > 0 ?
                            `${filteredExpenses.length} ta filtrlangan tranzaksiya` :
                            `Jami ${expenses.length} ta tranzaksiya`}
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="px-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Chiqimlar ro'yxati</h3>
                    <span className="text-sm text-gray-400">{filteredExpenses.length} ta</span>
                </div>

                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Natija topilmadi</h3>
                        <p className="text-gray-400">Tanlangan filtrlar bo'yicha chiqimlar topilmadi</p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-xl transition-colors"
                        >
                            Filtrlarni tozalash
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredExpenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="relative bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/70 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-red-500/20 rounded-xl">
                                            <TrendingDown size={20} className="text-red-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{expense.description}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <span>{expense.date}</span>
                                                <span>{expense.time}</span>
                                                <span className="capitalize text-[12px] text-red-400 absolute top-0 left-4">{expense.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-lg font-semibold text-red-400">
                                            -{formatCurrency(expense.amount)}
                                        </div>
                                        {/* Menu Trigger */}
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === expense.id ? null : expense.id)}
                                            className="p-2 rounded-xl hover:bg-gray-700"
                                        >
                                            <MoreVertical size={20} className="text-gray-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {openMenuId === expense.id && (
                                    <div className="absolute right-4 top-14 bg-gray-900 border border-gray-700 rounded-xl shadow-lg w-40 z-50">
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-red-500 hover:bg-gray-800 rounded-t-xl"
                                        >
                                            <Trash2 size={16} />
                                            <span>O‘chirish</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Modal */}
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
                                            key={cat.value}
                                            onClick={() => setFilters({ ...filters, category: cat.value })}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${filters.category === cat.value
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {cat.label}
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

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Chiqim qo'shish</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <Plus size={20} className="text-gray-300 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="number"
                                placeholder="Miqdor"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="w-full p-3 bg-gray-800 rounded-xl text-white"
                            />
                            <input
                                type="text"
                                placeholder="Tavsif"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                className="w-full p-3 bg-gray-800 rounded-xl text-white"
                            />

                            {/* Category dropdown */}
                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kategoriya</label>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-medium shadow-md hover:border-emerald-400 transition duration-300"
                                >
                                    {newExpense.category ? (
                                        <span>{categories.find((cat) => cat.value === newExpense.category)?.label}</span>
                                    ) : (
                                        <span className="text-gray-400">Tanlang</span>
                                    )}
                                    <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isOpen && (
                                    <div className="absolute bottom-full mb-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden animate-fade-in-up z-50">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat.value}
                                                onClick={() => {
                                                    setNewExpense({ ...newExpense, category: cat.value });
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

                            <button
                                onClick={handleAddExpense}
                                disabled={!newExpense.amount || !newExpense.description || !newExpense.category}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                            >
                                Qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                </div>
            )}
        </div>
    );
};

export default ExpensePage;
