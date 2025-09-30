"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FiSearch, FiSun, FiMoon } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  // Toggle Tailwind "dark" class on <html>
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* persistent sidebar */}
      <Sidebar />

      {/* main area */}
      <div className="flex-1 flex flex-col">
        {/* header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search symbol (eg. BTCUSDT)"
                className="w-64 md:w-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <div className="flex items-center gap-3">
              <img src="/avatar.png" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
              <div className="hidden md:block">
                <div className="text-sm font-medium">Your Name</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">SDE · Realtime</div>
              </div>
            </div>
          </div>
        </header>

        {/* content */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
