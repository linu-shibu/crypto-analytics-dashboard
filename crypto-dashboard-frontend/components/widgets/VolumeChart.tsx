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

interface Trade {
  tradeId?: number;
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
}

interface VolumePoint {
  time: string;
  volume: number;
}

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function VolumeChart() {
  const [data, setData] = useState<VolumePoint[]>([]);
  const [symbol, setSymbol] = useState("BTCUSDT");

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function fetchHistory() {
      try {
        const url =
          symbol === "ALL"
            ? `http://localhost:8080/api/trades?page=0&size=50&sortBy=timestamp&order=desc`
            : `http://localhost:8080/api/trades/${symbol}?page=0&size=50&sortBy=timestamp&order=desc`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.content) {
          // convert trades → volume buckets
          const buckets: { [key: string]: number } = {};
          json.content.reverse().forEach((t: Trade) => {
            const timeBucket = new Date(t.timestamp).toLocaleTimeString([], {
              minute: "2-digit",
              second: "2-digit",
            });
            const vol = t.price * t.quantity;
            buckets[timeBucket] = (buckets[timeBucket] || 0) + vol;
          });

          setData(
            Object.entries(buckets).map(([time, volume]) => ({
              time,
              volume,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch history:", err);
      }
    }

    fetchHistory();

    // SSE live stream
    const streamUrl =
      symbol === "ALL"
        ? "http://localhost:8080/api/trades/stream"
        : `http://localhost:8080/api/trades/${symbol}/stream`;

    eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      console.log("Volume charts: Stream message received:  ", event)
      const t: Trade = JSON.parse(event.data);
      const vol = t.price * t.quantity;
      const timeBucket = new Date(t.timestamp).toLocaleTimeString([], {
        minute: "2-digit",
        second: "2-digit",
      });

      setData((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.time === timeBucket) {
          last.volume += vol;
          return [...prev.slice(0, -1), last];
        } else {
          return [...prev.slice(-19), { time: timeBucket, volume: vol }];
        }
      });
    };

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [symbol]);

  return (
    <div className="bg-white shadow rounded-lg p-6 h-80 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trading Volume</h2>
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

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
