"use client";

import React, { useEffect, useState } from "react";
import {
    Dumbbell,
    Play,
    Pause,
    RotateCcw,
    Timer as TimerIcon,
    X,
} from "lucide-react";

export default function GymTimerPage() {
    // Timer state
    const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);

    // Sahifa ochilganda oldingi vaqtni tiklash
    useEffect(() => {
        const savedStart = localStorage.getItem("startTime");
        const savedRunning = localStorage.getItem("isTimerRunning") === "true";

        if (savedStart && savedRunning) {
            setStartTime(parseInt(savedStart));
            setIsTimerRunning(true);
        }
    }, []);

    // Har 1s da real vaqt hisoblash
    useEffect(() => {
        if (!isTimerRunning || !startTime) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = elapsed % 60;
            setTimer({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, startTime]);

    // Timer boshqaruv funksiyalari
    const startTimer = () => {
        const now = Date.now();
        setStartTime(now);
        localStorage.setItem("startTime", now.toString());
        localStorage.setItem("isTimerRunning", "true");
        setIsTimerRunning(true);
    };

    const pauseTimer = () => {
        setIsTimerRunning(false);
        localStorage.setItem("isTimerRunning", "false");
    };

    const resetTimer = () => {
        setTimer({ hours: 0, minutes: 0, seconds: 0 });
        setIsTimerRunning(false);
        setStartTime(null);
        localStorage.removeItem("startTime");
        localStorage.setItem("isTimerRunning", "false");
    };

    // Formatlash
    const formatTime = (num) => String(num).padStart(2, "0");

    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-white">
            {/* ===== Header (GYM style) ===== */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-lime-500/30 to-lime-700/30 backdrop-blur-xl border-b border-lime-400/40">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                            <Dumbbell size={20} className="text-black" />
                        </div>
                        <h1 className="text-xl font-bold tracking-wide text-lime-400">
                            Gym Timer
                        </h1>
                    </div>
                </div>
            </div>

            {/* ===== Timer Markazda ===== */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="p-8 rounded-2xl text-center w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-lime-400/40">
                    <h1 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-lime-400">
                        <TimerIcon className="w-6 h-6" /> Workout Timer
                    </h1>

                    <div className="text-5xl font-mono font-bold mb-8 text-white tracking-widest">
                        {formatTime(timer.hours)}:{formatTime(timer.minutes)}:
                        {formatTime(timer.seconds)}
                    </div>

                    <div className="flex justify-center gap-4">
                        {!isTimerRunning ? (
                            <button
                                onClick={startTimer}
                                className="flex items-center gap-2 bg-lime-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-lime-300 transition"
                            >
                                <Play className="w-5 h-5" /> Start
                            </button>
                        ) : (
                            <button
                                onClick={pauseTimer}
                                className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
                            >
                                <Pause className="w-5 h-5" /> Pause
                            </button>
                        )}

                        <button
                            onClick={resetTimer}
                            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition"
                        >
                            <RotateCcw className="w-5 h-5" /> Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* 📱 Mobil uchun suzuvchi timer */}
            {isTimerRunning && (
                <div className="fixed bottom-4 right-4 bg-gray-900/90 border border-lime-400/50 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50">
                    <TimerIcon className="w-4 h-4 text-lime-400" />
                    <span className="font-mono text-lime-300">
                        {formatTime(timer.hours)}:{formatTime(timer.minutes)}:
                        {formatTime(timer.seconds)}
                    </span>
                    <button onClick={pauseTimer}>
                        <X className="w-4 h-4 ml-2 text-gray-400 hover:text-lime-300 transition" />
                    </button>
                </div>
            )}
        </div>
    );
}
