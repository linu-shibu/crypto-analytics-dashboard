"use client";

import MarketOverview from "@/components/widgets/MarketOverview";
import PriceHistory from "@/components/widgets/PriceHistory";
import VolumeChart from "@/components/widgets/VolumeChart";
import TradesTable from "@/components/widgets/TradesTable";

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MarketOverview />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <TradesTable />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <PriceHistory />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <VolumeChart />
        </div>
      </div>
    </>
  );
}
