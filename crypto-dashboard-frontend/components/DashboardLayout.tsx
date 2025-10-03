// app/page.tsx
"use client";

import MarketOverview from "@/components/widgets/MarketOverview";
import PriceHistory from "@/components/widgets/PriceHistory";
import VolumeChart from "@/components/widgets/VolumeChart";
import TradesTable from "@/components/widgets/TradesTable";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">CryptoDash</h1>
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:text-blue-500">Dashboard</a>
          <a href="#" className="hover:text-blue-500">Markets</a>
          <a href="#" className="hover:text-blue-500">Trades</a>
          <a href="#" className="hover:text-blue-500">Analytics</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <div className="lg:col-span-1">
            <MarketOverview />
          </div>

          {/* Price History */}
          <div className="lg:col-span-2">
            <PriceHistory />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Volume Chart */}
          <div className="lg:col-span-2">
            <VolumeChart />
          </div>

          {/* Trades Table */}
          <div className="lg:col-span-1">
            <TradesTable />
          </div>
        </div>
      </main>
    </div>
  );
}
