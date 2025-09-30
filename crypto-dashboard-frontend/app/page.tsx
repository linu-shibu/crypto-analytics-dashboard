import PriceTicker from "@/components/PriceTicker";
import MarketOverview from "@/components/MarketOverview";
import VolumeChart from "@/components/VolumeChart";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Row */}
      <div className="lg:col-span-2">
        <MarketOverview />
      </div>
      <div>
        <PriceTicker />
      </div>

      {/* Second Row */}
      <div className="lg:col-span-3">
        <VolumeChart />
      </div>
    </div>
  );
}
