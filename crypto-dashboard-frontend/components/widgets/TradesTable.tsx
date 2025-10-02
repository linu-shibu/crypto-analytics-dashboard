"use client";

import { useEffect, useState } from "react";

interface Trade {
  tradeId: number;
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
  buyerMaker: boolean;
}

const symbols = ["ALL", "BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function TradesTable() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("ALL");

  useEffect(() => {
    let eventSource: EventSource | null = null;

    // 1. Fetch historical trades from MySQL
    async function fetchTrades() {
      let url =
        symbol === "ALL"
          ? `http://localhost:8080/api/trades?page=0&size=20&sortBy=timestamp&order=desc`
          : `http://localhost:8080/api/trades/${symbol}?page=0&size=20&sortBy=timestamp&order=desc`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.content) {
        setTrades(json.content);
      }
    }

    fetchTrades();

    // 2. Subscribe to live trades via SSE
    let streamUrl =
      symbol === "ALL"
        ? "http://localhost:8080/api/trades/stream"
        : `http://localhost:8080/api/trades/${symbol}/stream`;

    eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
        console.log("Trade stream in Trades table")
      const trade: Trade = JSON.parse(event.data);
      setTrades((prev) => [trade, ...prev].slice(0, 20));
    };

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [symbol]); // refetch + resubscribe when symbol changes

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Latest Trades</h2>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-800"
        >
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Maker</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.tradeId} className="border-t dark:border-gray-700">
              <td className="px-4 py-2">{t.symbol}</td>
              <td className="px-4 py-2">{t.price.toFixed(2)}</td>
              <td className="px-4 py-2">{t.quantity}</td>
              <td className="px-4 py-2">
                {new Date(t.timestamp).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2">{t.buyerMaker ? "Buyer" : "Seller"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
