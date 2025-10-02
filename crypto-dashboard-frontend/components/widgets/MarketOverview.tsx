"use client";

import { useEffect, useState } from "react";

interface MarketData {
  symbol: string;
  price: number;
  change24h?: number;
  volume24h?: number;
}

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function MarketOverview() {
  const [data, setData] = useState<MarketData[]>([]);

  useEffect(() => {
    // const sources: EventSource[] = [];

    // async function fetchInitial(symbol: string) {
    //   try {
    //     const res = await fetch(
    //       `http://localhost:8080/api/prices/${symbol}?page=0&size=1&sortBy=timestamp&order=desc`
    //     );
    //     const json = await res.json();
    //     if (json.content && json.content.length > 0) {
    //       const p = json.content[0];
    //       setData((prev) => [
    //         ...prev.filter((d) => d.symbol !== symbol),
    //         { symbol, price: p.price, change24h: 0, volume24h: 0 },
    //       ]);
    //     }
    //   } catch (err) {
    //     console.error(`❌ Failed to fetch initial price for ${symbol}:`, err);
    //   }
    // }

    // // Fetch latest historic data first
    // symbols.forEach((s) => fetchInitial(s));

    // Then subscribe to live SSE per symbol
    // symbols.forEach((symbol) => {
    //   const es = new EventSource(
    //     `http://localhost:8080/api/prices/${symbol}/stream`
    //   );

    //   es.onmessage = (event) => {
    //     const priceObj = JSON.parse(event.data);
    //     setData((prev) => [
    //       ...prev?.filter((d) => d?.symbol !== symbol),
    //       {
    //         symbol,
    //         price: priceObj.price,
    //         change24h: 0, // TODO: fill when backend provides ticker data
    //         volume24h: 0,
    //       },
    //     ]);
    //   };

    //   sources.push(es);
    // });

    // return () => {
    //   sources.forEach((s) => s.close());
    // };
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
          {data?.map((d) => (
            <tr key={d.symbol} className="border-t dark:border-gray-700">
              <td className="px-4 py-2 font-medium">{d.symbol}</td>
              <td className="px-4 py-2">{d.price.toFixed(2)}</td>
              <td
                className={`px-4 py-2 ${
                  d.change24h && d.change24h < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {d.change24h?.toFixed(2)}%
              </td>
              <td className="px-4 py-2">
                {d.volume24h ? d.volume24h.toFixed(0) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
