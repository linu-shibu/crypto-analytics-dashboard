"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Price {
  symbol: string;
  price: number;
  timestamp: number;
}

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function PriceHistory() {
  const [data, setData] = useState<Price[]>([]);
  const [symbol, setSymbol] = useState("BTCUSDT");

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function fetchHistory() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/prices/${symbol}?page=0&size=50&sortBy=timestamp&order=desc`
        );
        const json = await res.json();

        if (json.content) {
          const history = json.content.reverse().map((p: any) => ({
            symbol: p.symbol,
            price: p.price,
            timestamp: p.timestamp,
          }));
          setData(history);
        }
      } catch (err) {
        console.error("❌ Failed to fetch price history:", err);
      }
    }

    // ✅ Step 1: fetch historic prices for selected symbol
    fetchHistory();

    // ✅ Step 2: open one global price stream
    eventSource = new EventSource("http://localhost:8080/api/prices/stream");

    eventSource.onmessage = (event) => {
      const price: Price = JSON.parse(event.data);

      // only update if it's the current symbol
      if (price.symbol === symbol) {
        setData((prev) => [...prev.slice(-49), price]); // keep 50 points
      }
    };

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [symbol]);

  return (
    <div className="bg-white shadow rounded-lg p-6 h-80 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Price History</h2>
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

      <ResponsiveContainer width="95%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 70, bottom: 20 }} // extra left margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) =>
              new Date(ts).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
          />
          <YAxis
            domain={[
              (dataMin: number) => dataMin * 0.999,
              (dataMax: number) => dataMax * 1.001,
            ]}
            tickFormatter={(value) => value.toFixed(2)} // full value, 2 decimals
          />
          <Tooltip
            labelFormatter={(ts) =>
              new Date(ts).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
            formatter={(value: number) => value.toFixed(2)}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
