"use client";

import { useEffect, useState } from "react";

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function MarketOverview() {
  const [data, setData] = useState<MarketData[]>([]);

  async function fetchLatest(symbol: string) {
    try {
      const res = await fetch(`http://localhost:8080/api/prices/${symbol}/latest`);
      const json = await res.json();
      if (json) {
        setData((prev) => [
          ...prev.filter((d) => d.symbol !== symbol),
          {
            symbol: json.symbol,
            price: json.price,
            change24h: parseFloat(json.change24h ?? 0),
            volume24h: parseFloat(json.volume24h ?? 0),
          },
        ]);
      }
    } catch (err) {
      console.error(`❌ Failed to fetch /latest for ${symbol}:`, err);
    }
  }

  useEffect(() => {
    // fetch once on mount
    symbols.forEach((s) => fetchLatest(s));

    // poll every 30s
    const interval = setInterval(() => {
      symbols.forEach((s) => fetchLatest(s));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
      <table className="w-full border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Last Price</th>
            <th className="px-4 py-2">24h Change</th>
            <th className="px-4 py-2">24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((s) => {
            const d = data.find((row) => row.symbol === s);
            return (
              <tr key={s} className="border-t dark:border-gray-700">
                <td className="px-4 py-2 font-medium">{s}</td>
                <td className="px-4 py-2">
                  {d ? d.price.toFixed(2) : "—"}
                </td>
                <td
                  className={`px-4 py-2 ${
                    d && d.change24h < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {d ? `${d.change24h.toFixed(2)}%` : "—"}
                </td>
                <td className="px-4 py-2">
                  {d ? d.volume24h.toFixed(0) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
