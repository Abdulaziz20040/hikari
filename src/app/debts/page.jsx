"use client";

import React, { useState, useEffect } from "react";
import {
    CreditCard,
    Plus,
    CheckCircle,
    X,
    Loader2,
    MoreVertical,
    Trash2
} from "lucide-react";
import "../../app/globals.css";

const DebtsPage = () => {
    const DEBTS_API = "https://2921e26836d273ac.mokky.dev/qarzlar";
    const PAID_API = "https://2921e26836d273ac.mokky.dev/tolanganQarz";

    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tab, setTab] = useState("qoldiq"); // "qoldiq" yoki "tolangan"
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [newDebt, setNewDebt] = useState({ name: "", amount: "" });

    const [selectedDebt, setSelectedDebt] = useState(null);
    const [payStep, setPayStep] = useState("select");
    const [payAmount, setPayAmount] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    // Debtsni olish
    const fetchDebts = async () => {
        setLoading(true);
        try {
            // Tabga qarab alohida API chaqirish
            const api = tab === "qoldiq" ? DEBTS_API : PAID_API;
            const res = await fetch(api);
            const data = await res.json();
            setDebts(data.reverse()); // PAID_API ma'lumotlarini ham setDebts ga qo'yish
        } catch (error) {
            console.error("Qarzlar olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };


    // Tab o'zgarganda qarzlarni qayta olish
    useEffect(() => {
        fetchDebts();
    }, [tab]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("uz-UZ", {
            style: "currency",
            currency: "UZS",
            minimumFractionDigits: 0
        }).format(amount);

    // Qarz qo'shish
    const handleAddDebt = async () => {
        if (!newDebt.name || !newDebt.amount) return;
        const debt = {
            name: newDebt.name,
            amount: parseInt(newDebt.amount),
            status: "qoldiq",
            date: new Date().toISOString().split("T")[0]
        };
        try {
            await fetch(DEBTS_API, {
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

    const handlePayDebt = async (isFull) => {
        if (!selectedDebt) return;

        let amountToPay = isFull || !payAmount ? selectedDebt.amount : parseInt(payAmount);
        if (!amountToPay || amountToPay <= 0) return;

        let updatedAmount = selectedDebt.amount - amountToPay;
        let status = updatedAmount <= 0 ? "to'langan" : "qoldiq";

        try {
            if (status === "to'langan") {
                // To'langan miqdorni saqlash uchun amountToPay ishlatiladi
                await fetch(PAID_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...selectedDebt, amount: amountToPay, status })
                });
                await fetch(`${DEBTS_API}/${selectedDebt.id}`, { method: "DELETE" });
            } else {
                await fetch(`${DEBTS_API}/${selectedDebt.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: updatedAmount, status })
                });
            }
            fetchDebts();
            resetPayModal();
        } catch (error) {
            console.error("Qarz to‘lashda xatolik:", error);
        }
    };


    const resetPayModal = () => {
        setSelectedDebt(null);
        setPayStep("select");
        setPayAmount("");
        setShowModal(false);
    };

    // Qarz o‘chirish
    const handleDeleteDebt = async (id) => {
        try {
            await fetch(`${DEBTS_API}/${id}`, { method: "DELETE" });
            setDebts(debts.filter((d) => d.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Qarz o‘chirishda xatolik:", error);
        }
    };

    // 1 haftadan oshgan qoldiq qarzlarni avtomatik o'chirish
    useEffect(() => {
        const interval = setInterval(async () => {
            const now = new Date();
            const outdatedDebts = debts.filter(d => {
                if (d.status !== "qoldiq") return false;
                const debtDate = new Date(d.date);
                const diffDays = (now - debtDate) / (1000 * 60 * 60 * 24);
                return diffDays > 7;
            });

            for (const debt of outdatedDebts) {
                await fetch(`${DEBTS_API}/${debt.id}`, { method: "DELETE" });
            }

            if (outdatedDebts.length > 0) fetchDebts();
        }, 60000); // har 1 daqiqa tekshiradi

        return () => clearInterval(interval);
    }, [debts]);

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20 relative">
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
                                setPayStep("select");
                            }}
                            className="bg-green-500 p-3 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-green-400/25"
                        >
                            <CheckCircle size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center space-x-4 border-t border-gray-800 bg-gray-900/90">
                    <button
                        className={`flex-1 py-3 ${tab === "qoldiq" ? "border-b-2 border-yellow-500 text-yellow-400" : "text-gray-400"}`}
                        onClick={() => setTab("qoldiq")}
                    >
                        To'lanmaganlar
                    </button>
                    <button
                        className={`flex-1 py-3 ${tab === "tolangan" ? "border-b-2 border-green-500 text-green-400" : "text-gray-400"}`}
                        onClick={() => setTab("tolangan")}
                    >
                        To'langanlar
                    </button>
                </div>
            </div>
            {/* Debts List */}
            <div className="px-6 mt-4 space-y-3">
                {debts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💳</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Qarz topilmadi</h3>
                        {tab === "tolangan" && <p className="text-gray-400">To‘langan qarzlar alohida saqlanadi</p>}
                        {tab === "qoldiq" && <p className="text-gray-400">Hozircha qarzlar ro‘yxati bo‘sh</p>}
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
                                        <span className={`px-2 py-1 text-xs rounded-xl ${debt.status === "to'langan"
                                            ? "bg-green-500/30 text-green-400"
                                            : "bg-yellow-500/30 text-yellow-400"
                                            }`}>
                                            {debt.status === "to'langan" ? "To'langan" : "Qoldiq"}
                                        </span>
                                    </div>
                                </div>

                                {/* Qoldiq qarzlarda faqat menu va miqdor */}
                                {tab === "qoldiq" && (
                                    <div className="flex items-center space-x-2">
                                        <div className="text-lg font-semibold text-yellow-400">{formatCurrency(debt.amount)}</div>
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === debt.id ? null : debt.id)}
                                            className="p-2 rounded-xl hover:bg-gray-700"
                                        >
                                            <MoreVertical size={20} className="text-gray-300" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown menu faqat qoldiq qarzlarda */}
                            {tab === "qoldiq" && openMenuId === debt.id && (
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
                    <div className="w-full bg-gray-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">{modalType === "add" ? "Qarz qo‘shish" : "Qarz to‘lash"}</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedDebt(null);
                                    setPayStep("select");
                                    setPayAmount("");
                                }}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} className="text-gray-300" />
                            </button>
                        </div>

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

                        {modalType === "pay" && (
                            <div className="space-y-4 relative">
                                {/* Qarzlar ro'yxati */}
                                {payStep === "select" && (
                                    <div className="space-y-2">
                                        {debts.filter(d => d.status === "qoldiq").map(debt => (
                                            <button
                                                key={debt.id}
                                                onClick={() => {
                                                    setSelectedDebt(debt);
                                                    setPayStep("buttons"); // tanlangan qarzga o'tish
                                                }}
                                                className="w-full p-3 bg-gray-800 rounded-xl text-white text-left"
                                            >
                                                {debt.name} - {formatCurrency(debt.amount)}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Tanlangan qarz va 2 ta button */}
                                {payStep === "buttons" && selectedDebt && (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-800 rounded-xl text-white text-left">
                                            {selectedDebt.name} - {formatCurrency(selectedDebt.amount)}
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handlePayDebt(true)}
                                                className="flex-1 bg-green-500 p-4 rounded-xl font-semibold text-white hover:bg-green-600 transition-all duration-300"
                                            >
                                                Butunlay to‘lash
                                            </button>
                                            <button
                                                onClick={() => setPayStep("input")}
                                                className="flex-1 bg-yellow-500 p-4 rounded-xl font-semibold text-white hover:bg-yellow-600 transition-all duration-300"
                                            >
                                                Tanlangan miqdor
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Tanlangan miqdorni kiritish */}
                                {payStep === "input" && selectedDebt && (
                                    <div className="space-y-2 mt-3">
                                        {/* Jami qarzni ko'rsatish */}
                                        <div className="text-gray-400 text-sm">
                                            Jami qarz: {formatCurrency(selectedDebt.amount)}
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Miqdorni kiriting"
                                            value={payAmount}
                                            onChange={(e) => setPayAmount(e.target.value)}
                                            className="w-full p-3 bg-gray-800 rounded-xl text-white"
                                            max={selectedDebt.amount}
                                        />
                                        <button
                                            onClick={() => handlePayDebt(false)}
                                            className="w-full bg-yellow-500 p-4 rounded-xl font-semibold text-white hover:bg-yellow-600 transition-all duration-300"
                                        >
                                            Saqlash
                                        </button>
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
