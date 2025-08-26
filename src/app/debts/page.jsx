"use client";

import React, { useState, useEffect } from "react";
import {
    CreditCard,
    Plus,
    CheckCircle,
    X,
    MoreVertical,
    Trash2,
    Loader2
} from "lucide-react";
import "../../app/globals.css";

const DebtsPage = () => {
    const API_URL = "https://2921e26836d273ac.mokky.dev/qarzlar";

    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add"); // "add" yoki "pay"
    const [newDebt, setNewDebt] = useState({ name: "", amount: "" });

    const [payMenuOpen, setPayMenuOpen] = useState(false); // Dropdown menu
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [payAmount, setPayAmount] = useState("");

    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchDebts = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setDebts(data.reverse());
        } catch (error) {
            console.error("Qarzlar olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("uz-UZ", {
            style: "currency",
            currency: "UZS",
            minimumFractionDigits: 0
        }).format(amount);

    // Qarz qo‘shish
    const handleAddDebt = async () => {
        if (!newDebt.name || !newDebt.amount) return;
        const debt = {
            name: newDebt.name,
            amount: parseInt(newDebt.amount),
            status: "qoldiq",
            date: new Date().toISOString().split("T")[0]
        };
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(debt)
            });
            fetchDebts();
            setNewDebt({ name: "", amount: "" });
            setShowModal(false);
        } catch (error) {
            console.error("Qarz qo‘shishda xatolik:", error);
        }
    };

    // Qarz to‘lash (butunlay yoki qisman)
    const handlePayDebt = async (isFull) => {
        if (!selectedDebt) return;

        let amountToPay = isFull ? selectedDebt.amount : parseInt(payAmount);
        if (!amountToPay || amountToPay <= 0) return;

        let updatedAmount = selectedDebt.amount - amountToPay;
        let status = updatedAmount <= 0 ? "to'langan" : "qoldiq";

        try {
            await fetch(`${API_URL}/${selectedDebt.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: updatedAmount, status })
            });
            fetchDebts();
            setSelectedDebt(null);
            setPayAmount("");
            setPayMenuOpen(false);
            setShowModal(false);
        } catch (error) {
            console.error("Qarz to‘lashda xatolik:", error);
        }
    };

    // Qarz o‘chirish
    const handleDeleteDebt = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setDebts(debts.filter((d) => d.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Qarz o‘chirishda xatolik:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Loading */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                </div>
            )}

            {/* Header */}
            <div className="sticky top-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 z-40">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                            <CreditCard size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold">Qarzlar</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => {
                                setModalType("add");
                                setShowModal(true);
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25"
                        >
                            <Plus size={20} />
                        </button>
                        <button
                            onClick={() => {
                                setModalType("pay");
                                setShowModal(true);
                            }}
                            className="bg-green-500 p-3 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-green-400/25"
                        >
                            <CheckCircle size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Debts List */}
            <div className="px-6 mt-4 space-y-3">
                {debts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💳</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Qarz topilmadi</h3>
                        <p className="text-gray-400">Hozircha qarzlar ro‘yxati bo‘sh</p>
                    </div>
                ) : (
                    debts.map((debt) => (
                        <div
                            key={debt.id}
                            className={`relative bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/70 transition-colors`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-white">{debt.name}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                                        <span>{debt.date}</span>
                                        <span className={`px-2 py-1 text-xs rounded-xl ${debt.status === "to'langan" ? "bg-green-500/30 text-green-400" : "bg-yellow-500/30 text-yellow-400"}`}>
                                            {debt.status === "to'langan" ? "To'langan" : "Qoldiq"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-lg font-semibold text-yellow-400">{formatCurrency(debt.amount)}</div>
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === debt.id ? null : debt.id)}
                                        className="p-2 rounded-xl hover:bg-gray-700"
                                    >
                                        <MoreVertical size={20} className="text-gray-300" />
                                    </button>
                                </div>
                            </div>

                            {/* Dropdown menu yuqoriga */}
                            {openMenuId === debt.id && (
                                <div className="absolute right-4 bottom-full mb-2 bg-gray-900 border border-gray-700 rounded-xl shadow-lg w-40 z-50">
                                    <button
                                        onClick={() => handleDeleteDebt(debt.id)}
                                        className="flex items-center space-x-2 w-full px-4 py-2 text-red-500 hover:bg-gray-800 rounded-t-xl"
                                    >
                                        <Trash2 size={16} />
                                        <span>O‘chirish</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">{modalType === "add" ? "Qarz qo‘shish" : "Qarz to‘lash"}</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} className="text-gray-300" />
                            </button>
                        </div>

                        {/* Qarz qo‘shish */}
                        {modalType === "add" && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Kimga qarz"
                                    value={newDebt.name}
                                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                                    className="w-full p-3 bg-gray-800 rounded-xl text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Miqdor"
                                    value={newDebt.amount}
                                    onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                                    className="w-full p-3 bg-gray-800 rounded-xl text-white"
                                />
                                <button
                                    onClick={handleAddDebt}
                                    disabled={!newDebt.name || !newDebt.amount}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl font-semibold text-white hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                                >
                                    Qarz qo‘shish
                                </button>
                            </div>
                        )}

                        {/* Qarz to‘lash */}
                        {modalType === "pay" && (
                            <div className="space-y-4">
                                {/* Dropdown button */}
                                <button
                                    onClick={() => setPayMenuOpen(!payMenuOpen)}
                                    className="w-full p-3 bg-gray-800 rounded-xl text-white flex justify-between items-center"
                                >
                                    {selectedDebt ? `${selectedDebt.name} - ${formatCurrency(selectedDebt.amount)}` : "Qarz tanlang"}
                                    <span>▾</span>
                                </button>

                                {/* Dropdown menu yuqoriga */}
                                {payMenuOpen && (
                                    <div className="absolute w-full bg-gray-800 border border-gray-700 rounded-xl bottom-full mb-2 max-h-60 overflow-y-auto z-50">
                                        {debts.filter(d => d.status === "qoldiq").map((debt) => (
                                            <div key={debt.id} className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDebt(debt);
                                                    setPayMenuOpen(false);
                                                    setPayAmount("");
                                                }}>
                                                {debt.name} - {formatCurrency(debt.amount)}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedDebt && (
                                    <div className="space-y-2 mt-3">
                                        <input
                                            type="number"
                                            placeholder="Qancha to‘lash (bo‘sh qoldirsangiz butunlay to‘lanadi)"
                                            value={payAmount}
                                            onChange={(e) => setPayAmount(e.target.value)}
                                            className="w-full p-3 bg-gray-800 rounded-xl text-white"
                                            max={selectedDebt.amount}
                                        />
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handlePayDebt(true)}
                                                className="flex-1 bg-green-500 p-4 rounded-xl font-semibold text-white hover:bg-green-600 transition-all duration-300"
                                            >
                                                Butunlay to‘lash
                                            </button>
                                            <button
                                                onClick={() => handlePayDebt(false)}
                                                className="flex-1 bg-yellow-500 p-4 rounded-xl font-semibold text-white hover:bg-yellow-600 transition-all duration-300"
                                            >
                                                Tanlangan miqdor
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtsPage;
