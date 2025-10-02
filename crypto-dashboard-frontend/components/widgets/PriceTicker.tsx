"use client";

import { useEffect, useState } from "react";

interface CryptoPriceDto {
  symbol: string;
  lastPrice: string; // comes as string in Binance API
  eventTime: number;
}

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string, CryptoPriceDto>>({});

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/stream");

    eventSource.onmessage = (event) => {
      const price: CryptoPriceDto = JSON.parse(event.data);
      console.log("price: ", price)

      setPrices((prev) => ({
        ...prev,
        [price.symbol]: price
      }));
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.values(prices).map((p) => (
        <div
          key={p.symbol}
          className="p-3 rounded-lg shadow bg-white text-center"
        >
          <h3 className="font-semibold">{p.symbol}</h3>
          <p className="text-lg font-mono">{parseFloat(p.lastPrice).toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {new Date(p.eventTime).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}
