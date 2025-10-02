"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  time: string;
  price: number;
}

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"]; // add more if needed

export default function PriceHistory() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [symbol, setSymbol] = useState("BTCUSDT");

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function fetchHistory() {
      const res = await fetch(
        `http://localhost:8080/api/prices/${symbol}?page=0&size=50`
      );
      const json = await res.json();

      if (json.content) {
        setData(
          json.content.map((p: any) => ({
            time: new Date(p.timestamp).toLocaleTimeString(),
            price: p.price,
          }))
        );
      }
    }

    fetchHistory();

    // Subscribe to live updates for this symbol
    eventSource = new EventSource(
      `http://localhost:8080/api/prices/${symbol}/stream`
    );

    eventSource.onmessage = (event) => {
      const price = JSON.parse(event.data);
      setData((prev) => [
        ...prev.slice(-49),
        {
          time: new Date(price.timestamp).toLocaleTimeString(),
          price: price.price,
        },
      ]);
    };

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [symbol]); // refetch/reconnect when symbol changes

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Price History</h2>
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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
