"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, Circle, AlertTriangle, Bell, X } from "lucide-react";

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('Barchasi');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [newTask, setNewTask] = useState({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        priority: 'O\'rta'
    });

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Website dizayni yaratish',
            startDate: '2024-08-20',
            endDate: '2024-08-30',
            description: 'Kompaniya uchun yangi website dizayni yaratish va prototiplash',
            priority: 'Yuqori',
            status: 'Kutilayotgan',
            completed: false,
            createdAt: '2024-08-20'
        },
        {
            id: 2,
            title: 'Ma\'lumotlar bazasini yangilash',
            startDate: '2024-08-25',
            endDate: '2024-08-27',
            description: 'Foydalanuvchilar ma\'lumotlari bazasini yangilash va optimallashtirish',
            priority: 'Yuqori',
            status: 'Bajarilgan',
            completed: true,
            createdAt: '2024-08-25'
        },
        {
            id: 3,
            title: 'Marketing kampaniya rejasi',
            startDate: '2024-08-28',
            endDate: '2024-09-05',
            description: 'Yangi mahsulot uchun marketing strategiyasi ishlab chiqish',
            priority: 'O\'rta',
            status: 'Kutilayotgan',
            completed: false,
            createdAt: '2024-08-28'
        }
    ]);

    const tabs = ['Barchasi', 'Kutilayotganlar', 'Bajarilganlar', 'Kelajak rejalar'];

    const isTaskOverdue = (endDate, completed) => {
        if (completed) return false;
        const today = new Date();
        const dueDate = new Date(endDate);
        return dueDate < today;
    };

    const filteredTasks = tasks.filter(task => {
        let tabMatch = true;
        if (activeTab === 'Kutilayotganlar') {
            tabMatch = !task.completed && (task.status !== 'Kelajak');
        } else if (activeTab === 'Bajarilganlar') {
            tabMatch = task.completed;
        } else if (activeTab === 'Kelajak rejalar') {
            tabMatch = task.status === 'Kelajak';
        }
        const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return tabMatch && searchMatch;
    });

    const getTabCount = (tabName) => {
        return tasks.filter(task => {
            if (tabName === 'Barchasi') return true;
            if (tabName === 'Kutilayotganlar') return !task.completed && task.status !== 'Kelajak';
            if (tabName === 'Bajarilganlar') return task.completed;
            if (tabName === 'Kelajak rejalar') return task.status === 'Kelajak';
            return true;
        }).length;
    };

    const handleAddTask = () => {
        if (newTask.title && newTask.startDate && newTask.endDate) {
            const startDate = new Date(newTask.startDate);
            const today = new Date();

            let status = 'Kutilayotgan';
            if (startDate > today) {
                status = 'Kelajak';
            }

            const task = {
                id: Date.now(),
                title: newTask.title,
                startDate: newTask.startDate,
                endDate: newTask.endDate,
                description: newTask.description,
                priority: newTask.priority,
                status: status,
                completed: false,
                createdAt: new Date().toISOString().split('T')[0]
            };

            setTasks([task, ...tasks]);
            setNewTask({ title: '', startDate: '', endDate: '', description: '', priority: 'O\'rta' });
            setShowAddModal(false);
        }
    };

    const handleTaskToggle = (taskId) => {
        setSelectedTaskId(taskId);
        setShowConfirmModal(true);
    };

    const confirmTaskToggle = () => {
        setTasks(tasks.map(task => {
            if (task.id === selectedTaskId) {
                return {
                    ...task,
                    completed: !task.completed,
                    status: !task.completed ? 'Bajarilgan' : 'Kutilayotgan'
                };
            }
            return task;
        }));
        setShowConfirmModal(false);
        setSelectedTaskId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800 px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold">📋 Vazifalar</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="mt-3 relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Vazifa qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Tabs */}
                <div className="mt-3 overflow-x-auto hide-scrollbar">
                    <div className="flex space-x-2 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${activeTab === tab
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 text-gray-300'
                                    }`}
                            >
                                {tab} ({getTabCount(tab)})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tasks */}
            <div className="p-4 space-y-3">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-4 rounded-xl bg-gray-800 flex flex-col space-y-2 ${isTaskOverdue(task.endDate, task.completed) ? 'border border-red-500' : ''
                            }`}
                    >
                        <div className="flex justify-between">
                            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                {task.title}
                            </h3>
                            <button
                                onClick={() => handleTaskToggle(task.id)}
                                className="text-gray-400 hover:text-blue-400"
                            >
                                {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">{task.description}</p>
                        <div className="text-xs text-gray-500">
                            ⏳ {task.startDate} → {task.endDate}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center">
                    <div className="bg-gray-900 rounded-t-2xl w-full p-6">
                        <h3 className="text-lg font-bold mb-4">Yangi vazifa</h3>
                        <input
                            type="text"
                            placeholder="Vazifa nomi"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="w-full mb-3 p-3 bg-gray-800 rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <input
                                type="date"
                                value={newTask.startDate}
                                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                className="p-3 bg-gray-800 rounded-lg"
                            />
                            <input
                                type="date"
                                value={newTask.endDate}
                                onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                                className="p-3 bg-gray-800 rounded-lg"
                            />
                        </div>
                        <textarea
                            placeholder="Tavsif"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="w-full mb-3 p-3 bg-gray-800 rounded-lg"
                        />
                        <button
                            onClick={handleAddTask}
                            className="w-full bg-blue-500 py-3 rounded-lg font-bold"
                        >
                            Qo'shish
                        </button>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="w-full mt-2 bg-gray-700 py-3 rounded-lg"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-xl">
                        <p className="text-center mb-4">Holatni o'zgartirasizmi?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-700 py-2 rounded-lg"
                            >
                                Yo'q
                            </button>
                            <button
                                onClick={confirmTaskToggle}
                                className="flex-1 bg-blue-500 py-2 rounded-lg"
                            >
                                Ha
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hide Scrollbar */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ReportsPage;
