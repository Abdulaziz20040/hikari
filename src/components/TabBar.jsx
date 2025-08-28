"use client";

import React from "react";
import {
    Home,
    TrendingUp,
    TrendingDown,
    Briefcase,
    CreditCard,
    Dumbbell, // Gym uchun ikonka
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const TabBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { path: "/", icon: Home, label: "Bosh sahifa", color: "text-blue-400" },
        { path: "/income", icon: TrendingUp, label: "Kirim", color: "text-emerald-400" },
        { path: "/expense", icon: TrendingDown, label: "Chiqim", color: "text-red-400" },
        { path: "/reports", icon: Briefcase, label: "Ishlar", color: "text-purple-400" },
        { path: "/debts", icon: CreditCard, label: "Qarzlar", color: "text-yellow-400" },
        { path: "/gym", icon: Dumbbell, label: "Gym", color: "text-lime-400" }, // yangisi: sport uchun to‘q yashil rang
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
            <div className="flex justify-around items-center py-2 px-3 max-w-lg mx-auto">
                {tabs.map(({ path, icon: Icon, label, color }) => {
                    const isActive = pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => router.push(path)}
                            className={`flex flex-col items-center space-y-1 p-1 sm:p-2 rounded-xl 
              text-[10px] sm:text-xs transition-all duration-300 
              ${isActive ? `${color} bg-white/10` : "text-gray-500 hover:text-gray-400"}`}
                        >
                            <Icon size={22} className="sm:size-[24px]" />
                            <span className="hidden sm:block">{label}</span>
                            <span className="block sm:hidden text-[10px]">{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TabBar;
