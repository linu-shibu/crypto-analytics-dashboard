"use client";

import { useEffect, useState } from "react";

export function useBinanceStream<T>(url: string, transform: (msg: any) => T) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(transform(parsed));
      } catch (err) {
        console.error("WebSocket parse error", err);
      }
    };

    return () => ws.close();
  }, [url, transform]);

  return data;
}
