"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", volume: 1200 },
  { name: "Tue", volume: 2200 },
  { name: "Wed", volume: 1800 },
  { name: "Thu", volume: 2600 },
  { name: "Fri", volume: 3000 },
];

export default function VolumeChart() {
  return (
    <div className="bg-white shadow rounded-lg p-6 h-80">
      <h2 className="text-xl font-semibold mb-4">Trading Volume</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
