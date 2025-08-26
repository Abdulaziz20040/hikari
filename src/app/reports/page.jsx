"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, Circle, AlertTriangle, Bell, X } from "lucide-react"
import "../../app/globals.css"

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState("Barchasi")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [newTask, setNewTask] = useState({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        priority: "O'rta",
    })
    const [filters, setFilters] = useState({
        priority: "Barchasi",
        dateRange: "Barchasi",
        status: "Barchasi",
    })

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Website dizayni yaratish",
            startDate: "2024-08-20",
            endDate: "2024-08-30",
            description: "Kompaniya uchun yangi website dizayni yaratish va prototiplash",
            priority: "Yuqori",
            status: "Kutilayotgan",
            completed: false,
            createdAt: "2024-08-20",
        },
        {
            id: 2,
            title: "Ma'lumotlar bazasini yangilash",
            startDate: "2024-08-25",
            endDate: "2024-08-27",
            description: "Foydalanuvchilar ma'lumotlari bazasini yangilash va optimallashtirish",
            priority: "Yuqori",
            status: "Bajarilgan",
            completed: true,
            createdAt: "2024-08-25",
        },
        {
            id: 3,
            title: "Marketing kampaniya rejasi",
            startDate: "2024-08-28",
            endDate: "2024-09-05",
            description: "Yangi mahsulot uchun marketing strategiyasi ishlab chiqish",
            priority: "O'rta",
            status: "Kutilayotgan",
            completed: false,
            createdAt: "2024-08-28",
        },
        {
            id: 4,
            title: "Mobil ilova testlash",
            startDate: "2024-09-01",
            endDate: "2024-09-10",
            description: "iOS va Android ilovalarni test qilish va xatoliklarni tuzatish",
            priority: "Past",
            status: "Kelajak",
            completed: false,
            createdAt: "2024-08-26",
        },
        {
            id: 5,
            title: "Hisobot tayyorlash",
            startDate: "2024-08-24",
            endDate: "2024-08-26",
            description: "Oylik moliyaviy hisobot tayyorlash va tahlil qilish",
            priority: "Yuqori",
            status: "Muddati o'tgan",
            completed: false,
            createdAt: "2024-08-24",
        },
    ])

    const tabs = ["Barchasi", "Kutilayotganlar", "Bajarilganlar", "Kelajak rejalar"]
    const priorities = ["Barchasi", "Yuqori", "O'rta", "Past"]
    const dateRanges = ["Barchasi", "Bu hafta", "Bu oy", "Keyingi hafta", "Keyingi oy"]

    // Check for overdue tasks and update status
    useEffect(() => {
        const updateTaskStatuses = () => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            setTasks((prevTasks) =>
                prevTasks.map((task) => {
                    const endDate = new Date(task.endDate)
                    endDate.setHours(0, 0, 0, 0)

                    if (!task.completed && endDate < today && task.status !== "Muddati o'tgan") {
                        return { ...task, status: "Muddati o'tgan" }
                    }
                    return task
                }),
            )
        }

        updateTaskStatuses()
        const interval = setInterval(updateTaskStatuses, 60000)
        return () => clearInterval(interval)
    }, [])

    // Get task status for filtering
    const getTaskStatusForTab = (task) => {
        if (task.completed) return "Bajarilganlar"
        if (task.status === "Muddati o'tgan") return "Kutilayotganlar"
        if (task.status === "Kelajak") return "Kelajak rejalar"
        return "Kutilayotganlar"
    }

    // Check if task is due soon (within 2 days)
    const isTaskDueSoon = (endDate) => {
        const today = new Date()
        const dueDate = new Date(endDate)
        const diffTime = dueDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 2 && diffDays >= 0
    }

    // Check if task is overdue
    const isTaskOverdue = (endDate, completed) => {
        if (completed) return false
        const today = new Date()
        const dueDate = new Date(endDate)
        return dueDate < today
    }

    // Filter tasks based on active tab and filters
    const filteredTasks = tasks.filter((task) => {
        // Tab filtering
        let tabMatch = true
        if (activeTab === "Kutilayotganlar") {
            tabMatch = !task.completed && task.status !== "Kelajak"
        } else if (activeTab === "Bajarilganlar") {
            tabMatch = task.completed
        } else if (activeTab === "Kelajak rejalar") {
            tabMatch = task.status === "Kelajak"
        }

        // Search filtering
        const searchMatch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Additional filters
        const priorityMatch = filters.priority === "Barchasi" || task.priority === filters.priority

        return tabMatch && searchMatch && priorityMatch
    })

    // Count tasks for each tab
    const getTabCount = (tabName) => {
        return tasks.filter((task) => {
            if (tabName === "Barchasi") return true
            if (tabName === "Kutilayotganlar") return !task.completed && task.status !== "Kelajak"
            if (tabName === "Bajarilganlar") return task.completed
            if (tabName === "Kelajak rejalar") return task.status === "Kelajak"
            return true
        }).length
    }

    // Add new task
    const handleAddTask = () => {
        if (newTask.title && newTask.startDate && newTask.endDate) {
            const startDate = new Date(newTask.startDate)
            const today = new Date()
            let status = "Kutilayotgan"

            if (startDate > today) {
                status = "Kelajak"
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
                createdAt: new Date().toISOString().split("T")[0],
            }

            setTasks([task, ...tasks])
            setNewTask({
                title: "",
                startDate: "",
                endDate: "",
                description: "",
                priority: "O'rta",
            })
            setShowAddModal(false)
        }
    }

    // Toggle task completion
    const handleTaskToggle = (taskId) => {
        setSelectedTaskId(taskId)
        setShowConfirmModal(true)
    }

    const confirmTaskToggle = () => {
        setTasks(
            tasks.map((task) => {
                if (task.id === selectedTaskId) {
                    return {
                        ...task,
                        completed: !task.completed,
                        status: !task.completed ? "Bajarilgan" : "Kutilayotgan",
                    }
                }
                return task
            }),
        )
        setShowConfirmModal(false)
        setSelectedTaskId(null)
    }

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Yuqori":
                return "text-red-400 bg-red-500/20"
            case "O'rta":
                return "text-yellow-400 bg-yellow-500/20"
            case "Past":
                return "text-green-400 bg-green-500/20"
            default:
                return "text-gray-400 bg-gray-500/20"
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("uz-UZ")
    }

    // Get overdue tasks count for notification
    const overdueTasksCount = tasks.filter((task) => isTaskOverdue(task.endDate, task.completed)).length

    const dueSoonTasksCount = tasks.filter((task) => isTaskDueSoon(task.endDate) && !task.completed).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
                <div className="flex items-center justify-between p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Calendar size={16} className="sm:hidden text-white" />
                            <Calendar size={20} className="hidden sm:block text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold">Vazifalar</h1>
                            {(overdueTasksCount > 0 || dueSoonTasksCount > 0) && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs">
                                    {overdueTasksCount > 0 && (
                                        <span className="flex items-center space-x-1 text-red-400">
                                            <AlertTriangle size={12} />
                                            <span>{overdueTasksCount} muddati o'tgan</span>
                                        </span>
                                    )}
                                    {dueSoonTasksCount > 0 && (
                                        <span className="flex items-center space-x-1 text-yellow-400">
                                            <Bell size={12} />
                                            <span>{dueSoonTasksCount} yaqinlashayotgan</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="bg-gray-800 p-2.5 sm:p-3 rounded-xl hover:bg-gray-700 transition-colors touch-manipulation"
                        >
                            <Filter size={18} className="sm:hidden text-gray-300" />
                            <Filter size={20} className="hidden sm:block text-gray-300" />
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 p-2.5 sm:p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg touch-manipulation"
                        >
                            <Plus size={18} className="sm:hidden text-white" />
                            <Plus size={20} className="hidden sm:block text-white" />
                        </button>
                    </div>
                </div>

                <div className="px-4 sm:px-6 pb-4">
                    <div className="relative">
                        <Search size={18} className="sm:hidden absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Search
                            size={20}
                            className="hidden sm:block absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Vazifalarni qidiring..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        />
                    </div>
                </div>

                <div className="px-4 sm:px-6 pb-4">
                    <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all touch-manipulation min-w-max ${activeTab === tab
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                <span className="text-xs sm:text-sm">{tab}</span>
                                <span
                                    className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-600 text-gray-400"
                                        }`}
                                >
                                    {getTabCount(tab)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 pb-20 sm:pb-6 max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <div className="text-4xl sm:text-6xl mb-4">📋</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
                            {searchQuery ? "Qidiruv natijasi topilmadi" : "Vazifalar yo'q"}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400 mb-4 px-4">
                            {searchQuery
                                ? "Boshqa kalit so'zlar bilan qidiring"
                                : 'Birinchi vazifangizni qo\'shish uchun "+" tugmasini bosing'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                Qidiruvni tozalash
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {filteredTasks.map((task) => {
                            const isOverdue = isTaskOverdue(task.endDate, task.completed)
                            const isDueSoon = isTaskDueSoon(task.endDate)

                            return (
                                <div
                                    key={task.id}
                                    className={`p-4 sm:p-4 rounded-2xl border transition-all duration-300 ${isOverdue && !task.completed
                                        ? "bg-red-900/20 border-red-500/50 shadow-lg shadow-red-500/10"
                                        : isDueSoon && !task.completed
                                            ? "bg-yellow-900/20 border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                                            : task.completed
                                                ? "bg-green-900/20 border-green-500/50"
                                                : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                                        }`}
                                >
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <button
                                            onClick={() => handleTaskToggle(task.id)}
                                            className={`mt-1 p-2 sm:p-1 rounded-full transition-all touch-manipulation ${task.completed ? "text-green-400 hover:text-green-300" : "text-gray-400 hover:text-gray-300"
                                                }`}
                                        >
                                            {task.completed ? (
                                                <CheckCircle size={20} className="sm:hidden fill-current" />
                                            ) : (
                                                <Circle size={20} className="sm:hidden" />
                                            )}
                                            {task.completed ? (
                                                <CheckCircle size={24} className="hidden sm:block fill-current" />
                                            ) : (
                                                <Circle size={24} className="hidden sm:block" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                                                <h3
                                                    className={`text-base sm:text-lg font-semibold pr-2 ${task.completed
                                                        ? "text-gray-400 line-through"
                                                        : isOverdue && !task.completed
                                                            ? "text-red-400"
                                                            : "text-white"
                                                        }`}
                                                >
                                                    {task.title}
                                                </h3>

                                                <div className="flex items-center space-x-2 flex-shrink-0">
                                                    <span
                                                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    {isOverdue && !task.completed && (
                                                        <AlertTriangle size={14} className="sm:hidden text-red-400" />
                                                    )}
                                                    {isOverdue && !task.completed && (
                                                        <AlertTriangle size={16} className="hidden sm:block text-red-400" />
                                                    )}
                                                    {isDueSoon && !task.completed && <Bell size={14} className="sm:hidden text-yellow-400" />}
                                                    {isDueSoon && !task.completed && (
                                                        <Bell size={16} className="hidden sm:block text-yellow-400" />
                                                    )}
                                                </div>
                                            </div>

                                            <p className={`text-sm mb-3 ${task.completed ? "text-gray-500" : "text-gray-300"}`}>
                                                {task.description}
                                            </p>

                                            <div
                                                className={`flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs ${task.completed ? "text-gray-500" : "text-gray-400"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <Calendar size={12} className="sm:hidden" />
                                                    <Calendar size={14} className="hidden sm:block" />
                                                    <span>Boshlanish: {formatDate(task.startDate)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={12} className="sm:hidden" />
                                                    <Clock size={14} className="hidden sm:block" />
                                                    <span
                                                        className={
                                                            isOverdue && !task.completed
                                                                ? "text-red-400 font-medium"
                                                                : isDueSoon && !task.completed
                                                                    ? "text-yellow-400 font-medium"
                                                                    : ""
                                                        }
                                                    >
                                                        Tugash: {formatDate(task.endDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center">
                    <div className="w-full sm:max-w-md sm:mx-4 bg-gray-900 rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-white">Yangi vazifa qo'shish</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors touch-manipulation"
                            >
                                <X size={20} className="text-gray-300" />
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Vazifa nomi</label>
                                <input
                                    type="text"
                                    placeholder="Vazifa nomini kiriting"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Boshlanish sanasi</label>
                                    <input
                                        type="date"
                                        value={newTask.startDate}
                                        onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                        className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tugash sanasi</label>
                                    <input
                                        type="date"
                                        value={newTask.endDate}
                                        onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                                        className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Muhimlik darajasi</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                >
                                    <option value="Yuqori">Yuqori</option>
                                    <option value="O'rta">O'rta</option>
                                    <option value="Past">Past</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tavsif</label>
                                <textarea
                                    placeholder="Vazifa haqida batafsil ma'lumot"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    rows={4}
                                    className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                />
                            </div>

                            <button
                                onClick={handleAddTask}
                                disabled={!newTask.title || !newTask.startDate || !newTask.endDate}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
                            >
                                Vazifa qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-white mb-4">Tasdiqlash</h3>
                        <p className="text-gray-300 mb-6 text-sm sm:text-base">Vazifa holatini o'zgartirmoqchimisiz?</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-700 p-3 rounded-xl font-medium text-white hover:bg-gray-600 transition-colors touch-manipulation text-sm sm:text-base"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={confirmTaskToggle}
                                className="flex-1 bg-blue-500 p-3 rounded-xl font-medium text-white hover:bg-blue-600 transition-colors touch-manipulation text-sm sm:text-base"
                            >
                                Ha, o'zgartirish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center">
                    <div className="w-full sm:max-w-md sm:mx-4 bg-gray-900 rounded-t-3xl sm:rounded-3xl p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-white">Filtrlar</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors touch-manipulation"
                            >
                                <X size={20} className="text-gray-300" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Muhimlik darajasi</label>
                                <select
                                    value={filters.priority}
                                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                >
                                    {priorities.map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-xl font-medium text-white transition-colors touch-manipulation text-sm sm:text-base"
                            >
                                Filtrlarni qo'llash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportsPage
