"use client";

import React from "react";
import Link from "next/link";   // ✅ Import Next.js Link

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">CryptoDash</h1>
        <nav className="flex flex-col gap-4">
          <Link href="/" className="hover:text-blue-500">
            Dashboard
          </Link>
          <Link href="/markets" className="hover:text-blue-500">
            Markets
          </Link>
          <Link href="/trades" className="hover:text-blue-500">
            Trades
          </Link>
          <Link href="/analytics" className="hover:text-blue-500">
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
