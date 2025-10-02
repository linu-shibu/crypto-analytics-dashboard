import DashboardLayout from "@/components/DashboardLayout";
import PriceTicker from "@/components/widgets/PriceTicker";
import MarketOverview from "@/components/widgets/MarketOverview";
import PriceHistory from "@/components/widgets/PriceHistory";
import TradesTable from "@/components/widgets/TradesTable";

export default function DashboardPage() {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceTicker />
          <TradesTable />
        </div>
        <div>
          <MarketOverview />
        </div>
      </div>
  );
}
