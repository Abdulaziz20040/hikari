"use client"
import React, { useState } from 'react';
import { TrendingUp, Plus, Calendar, Clock, Filter, ChevronDown } from 'lucide-react';

const IncomePage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [newIncome, setNewIncome] = useState({ amount: '', description: '', category: 'Maosh' });
    const [filters, setFilters] = useState({
        dateRange: 'Barchasi',
        timeRange: 'Barchasi',
        category: 'Barchasi',
        amountRange: 'Barchasi'
    });

    const [incomes, setIncomes] = useState([
        { id: 1, amount: 5000000, description: 'Oylik maosh', category: 'Maosh', date: '2024-08-23', time: '14:30' },
        { id: 2, amount: 1500000, description: 'Freelance loyiha', category: 'Freelance', date: '2024-08-23', time: '18:45' },
        { id: 3, amount: 800000, description: 'Qo\'shimcha ish', category: 'Qo\'shimcha', date: '2024-08-22', time: '12:20' },
        { id: 4, amount: 300000, description: 'Divident', category: 'Investitsiya', date: '2024-08-22', time: '10:15' },
        { id: 5, amount: 2000000, description: 'Premium bonus', category: 'Bonus', date: '2024-08-21', time: '16:00' },
        { id: 6, amount: 600000, description: 'Konsalting', category: 'Freelance', date: '2024-08-20', time: '09:30' },
        { id: 7, amount: 4500000, description: 'Asosiy ish haqi', category: 'Maosh', date: '2024-08-19', time: '15:00' },
        { id: 8, amount: 250000, description: 'Reklama daromadi', category: 'Qo\'shimcha', date: '2024-08-18', time: '20:15' }
    ]);

    const categories = ['Barchasi', 'Maosh', 'Freelance', 'Qo\'shimcha', 'Investitsiya', 'Bonus', 'Boshqa'];

    const dateRanges = [
        'Barchasi', 'Bugun', 'Kecha', 'Bu hafta', 'O\'tgan hafta', 'Bu oy', 'O\'tgan oy'
    ];

    const timeRanges = [
        'Barchasi', 'Ertalab (06:00-12:00)', 'Kunduzi (12:00-18:00)', 'Kechqurun (18:00-00:00)', 'Tunda (00:00-06:00)'
    ];

    const amountRanges = [
        'Barchasi', 'Kam (0-500K)', 'O\'rta (500K-2M)', 'Ko\'p (2M-5M)', 'Juda ko\'p (5M+)'
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getDateFilter = (income, range) => {
        const today = new Date();
        const incomeDate = new Date(income.date);

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
            case 'O\'tgan hafta':
                const startLastWeek = new Date(today);
                startLastWeek.setDate(today.getDate() - today.getDay() - 7);
                const endLastWeek = new Date(today);
                endLastWeek.setDate(today.getDate() - today.getDay() - 1);
                return incomeDate >= startLastWeek && incomeDate <= endLastWeek;
            case 'Bu oy':
                return incomeDate.getMonth() === today.getMonth() && incomeDate.getFullYear() === today.getFullYear();
            case 'O\'tgan oy':
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);
                return incomeDate.getMonth() === lastMonth.getMonth() && incomeDate.getFullYear() === lastMonth.getFullYear();
            default:
                return true;
        }
    };

    const getTimeFilter = (income, range) => {
        if (range === 'Barchasi') return true;

        const hour = parseInt(income.time.split(':')[0]);
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

    const getAmountFilter = (income, range) => {
        const amount = income.amount;
        switch (range) {
            case 'Kam (0-500K)':
                return amount <= 500000;
            case 'O\'rta (500K-2M)':
                return amount > 500000 && amount <= 2000000;
            case 'Ko\'p (2M-5M)':
                return amount > 2000000 && amount <= 5000000;
            case 'Juda ko\'p (5M+)':
                return amount > 5000000;
            default:
                return true;
        }
    };

    const filteredIncomes = incomes.filter(income => {
        return getDateFilter(income, filters.dateRange) &&
            getTimeFilter(income, filters.timeRange) &&
            (filters.category === 'Barchasi' || income.category === filters.category) &&
            getAmountFilter(income, filters.amountRange);
    });

    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

    const handleAddIncome = () => {
        if (newIncome.amount && newIncome.description) {
            const income = {
                id: Date.now(),
                amount: parseInt(newIncome.amount),
                description: newIncome.description,
                category: newIncome.category,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
            };
            setIncomes([income, ...incomes]);
            setNewIncome({ amount: '', description: '', category: 'Maosh' });
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

            {/* Total Income Card */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp size={28} className="text-emerald-200" />
                        <span className="text-emerald-200 font-medium">
                            {activeFiltersCount > 0 ? 'Filtrlangan kirim' : 'Jami kirim'}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">{formatCurrency(totalIncome)}</h2>
                    <p className="text-emerald-200">
                        {activeFiltersCount > 0 ?
                            `${filteredIncomes.length} ta filtrlangan tranzaksiya` :
                            `Bu oyda ${incomes.length} ta tranzaksiya`
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

            {/* Income List */}
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
                            <div key={income.id} className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/70 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                                            <TrendingUp size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{income.description}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">
                                                    {income.category}
                                                </span>
                                                <span>•</span>
                                                <span>{income.date}</span>
                                                <span>{income.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold text-emerald-400">
                                        +{formatCurrency(income.amount)}
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
                                                ? 'bg-emerald-500 text-white'
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

            {/* Add Income Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Miqdor</label>
                                <input
                                    type="number"
                                    placeholder="Kirim miqdorini kiriting"
                                    value={newIncome.amount}
                                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tavsif</label>
                                <input
                                    type="text"
                                    placeholder="Kirim haqida ma'lumot"
                                    value={newIncome.description}
                                    onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kategoriya</label>
                                <select
                                    value={newIncome.category}
                                    onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    {categories.slice(1).map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleAddIncome}
                                disabled={!newIncome.amount || !!newIncome.description}
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-xl font-semibold text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                            >
                                Kirim qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomePage;