"use client";

import React, { useState } from "react";
import { TrendingDown, Plus, Calendar, Clock, Filter, ChevronDown } from "lucide-react";

const ExpensePage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [newExpense, setNewExpense] = useState({ amount: '', description: '', category: 'Oziq-ovqat' });
    const [filters, setFilters] = useState({
        dateRange: 'Barchasi',
        timeRange: 'Barchasi',
        category: 'Barchasi',
        amountRange: 'Barchasi'
    });

    const [expenses, setExpenses] = useState([
        { id: 1, amount: 450000, description: 'Supermarket xaridlari', category: 'Oziq-ovqat', date: '2024-08-25', time: '19:30' },
        { id: 2, amount: 35000, description: 'Taksi haqi', category: 'Transport', date: '2024-08-25', time: '14:20' },
        { id: 3, amount: 180000, description: 'Elektr energiya', category: 'Kommunal', date: '2024-08-24', time: '10:15' },
        { id: 4, amount: 850000, description: 'Krossovka sotib olish', category: 'Kiyim-kechak', date: '2024-08-23', time: '16:45' },
        { id: 5, amount: 125000, description: 'Dorixona', category: 'Tibbiyot', date: '2024-08-22', time: '11:30' },
        { id: 6, amount: 75000, description: 'Kino teatr', category: 'O\'yin-kulgi', date: '2024-08-21', time: '20:00' },
        { id: 7, amount: 200000, description: 'Kitoblar', category: 'Ta\'lim', date: '2024-08-20', time: '13:15' },
        { id: 8, amount: 90000, description: 'Kafe', category: 'Oziq-ovqat', date: '2024-08-19', time: '18:30' }
    ]);

    const categories = ['Barchasi', 'Oziq-ovqat', 'Transport', 'Kommunal', 'Kiyim-kechak', 'Tibbiyot', 'O\'yin-kulgi', 'Ta\'lim', 'Boshqa'];

    const dateRanges = [
        'Barchasi', 'Bugun', 'Kecha', 'Bu hafta', 'O\'tgan hafta', 'Bu oy', 'O\'tgan oy'
    ];

    const timeRanges = [
        'Barchasi', 'Ertalab (06:00-12:00)', 'Kunduzi (12:00-18:00)', 'Kechqurun (18:00-00:00)', 'Tunda (00:00-06:00)'
    ];

    const amountRanges = [
        'Barchasi', 'Kam (0-100K)', 'O\'rta (100K-500K)', 'Ko\'p (500K-1M)', 'Juda ko\'p (1M+)'
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getDateFilter = (expense, range) => {
        const today = new Date();
        const expenseDate = new Date(expense.date);

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

    const getTimeFilter = (expense, range) => {
        if (range === 'Barchasi') return true;

        const hour = parseInt(expense.time.split(':')[0]);
        switch (range) {
            case 'Ertalab (06:00-12:00)':
                return hour >= 6 && hour < 12;
            case 'Kunduzi (12:00-18:00)':
                return hour >= 12 && hour < 18;
            case 'Kechqurun (18:00-00:00)':
                return hour >= 18 && hour < 24;
            case 'Tunda (00:00-06:00)':
                return hour >= 0 && hour < 6;
            default:
                return true;
        }
    };

    const getAmountFilter = (expense, range) => {
        const amount = expense.amount;
        switch (range) {
            case 'Kam (0-100K)':
                return amount <= 100000;
            case 'O\'rta (100K-500K)':
                return amount > 100000 && amount <= 500000;
            case 'Ko\'p (500K-1M)':
                return amount > 500000 && amount <= 1000000;
            case 'Juda ko\'p (1M+)':
                return amount > 1000000;
            default:
                return true;
        }
    };

    const filteredExpenses = expenses.filter(expense => {
        return getDateFilter(expense, filters.dateRange) &&
            getTimeFilter(expense, filters.timeRange) &&
            (filters.category === 'Barchasi' || expense.category === filters.category) &&
            getAmountFilter(expense, filters.amountRange);
    });

    const totalExpense = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const handleAddExpense = () => {
        if (newExpense.amount && newExpense.description) {
            const expense = {
                id: Date.now(),
                amount: parseInt(newExpense.amount),
                description: newExpense.description,
                category: newExpense.category,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
            };
            setExpenses([expense, ...expenses]);
            setNewExpense({ amount: '', description: '', category: 'Oziq-ovqat' });
            setShowAddModal(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            dateRange: 'Barchasi',
            timeRange: 'Barchasi',
            category: 'Barchasi',
            amountRange: 'Barchasi'
        });
        setShowFilterModal(false);
    };

    const activeFiltersCount = Object.values(filters).filter(f => f !== 'Barchasi').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20">
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

            {/* Total Expense Card */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <TrendingDown size={28} className="text-red-200" />
                        <span className="text-red-200 font-medium">
                            {activeFiltersCount > 0 ? 'Filtrlangan chiqim' : 'Jami chiqim'}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">{formatCurrency(totalExpense)}</h2>
                    <p className="text-red-200">
                        {activeFiltersCount > 0 ?
                            `${filteredExpenses.length} ta filtrlangan tranzaksiya` :
                            `Bu oyda ${expenses.length} ta tranzaksiya`
                        }
                    </p>
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="px-6 mb-4">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(filters).map(([key, value]) => {
                            if (value === 'Barchasi') return null;
                            return (
                                <div key={key} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                                    <span>{value}</span>
                                    <button
                                        onClick={() => setFilters({ ...filters, [key]: 'Barchasi' })}
                                        className="hover:text-blue-300"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                        <button
                            onClick={resetFilters}
                            className="text-gray-400 hover:text-gray-300 text-sm underline"
                        >
                            Barchasini tozalash
                        </button>
                    </div>
                </div>
            )}

            {/* Expense List */}
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
                            <div key={expense.id} className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/70 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-red-500/20 rounded-xl">
                                            <TrendingDown size={20} className="text-red-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{expense.description}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">
                                                    {expense.category}
                                                </span>
                                                <span>•</span>
                                                <span>{expense.date}</span>
                                                <span>{expense.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold text-red-400">
                                        -{formatCurrency(expense.amount)}
                                    </div>
                                </div>
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
                            <h3 className="text-xl font-bold text-white">Filterlar</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <Plus size={20} className="text-gray-300 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                                    <Calendar size={16} />
                                    <span>Sana bo'yicha</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {dateRanges.map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setFilters({ ...filters, dateRange: range })}
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

                            {/* Time Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                                    <Clock size={16} />
                                    <span>Vaqt bo'yicha</span>
                                </label>
                                <div className="space-y-2">
                                    {timeRanges.map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setFilters({ ...filters, timeRange: range })}
                                            className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left ${filters.timeRange === range
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Kategoriya</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setFilters({ ...filters, category: category })}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${filters.category === category
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Miqdor bo'yicha</label>
                                <div className="space-y-2">
                                    {amountRanges.map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setFilters({ ...filters, amountRange: range })}
                                            className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left ${filters.amountRange === range
                                                ? 'bg-yellow-500 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
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
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Miqdor</label>
                                <input
                                    type="number"
                                    placeholder="Chiqim miqdorini kiriting"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tavsif</label>
                                <input
                                    type="text"
                                    placeholder="Chiqim haqida ma'lumot"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kategoriya</label>
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    {categories.slice(1).map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleAddExpense}
                                disabled={!newExpense.amount || !newExpense.description}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                            >
                                Chiqim qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensePage;