"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { PricePoint } from "@/types/crypto";

const dummyData: PricePoint[] = [
  { time: "10:00", price: 42000 },
  { time: "10:05", price: 42120 },
  { time: "10:10", price: 41980 },
  { time: "10:15", price: 42250 },
  { time: "10:20", price: 42100 },
];

export default function PriceTicker() {
  const [data, setData] = useState<PricePoint[]>(dummyData);

  // For now, simulate updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint: PricePoint = {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: Math.round(42000 + Math.random() * 500), // dummy variation
      };
      setData((prev) => [...prev.slice(-9), newPoint]); // keep last 10 points
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-2">BTC/USDT Live</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
