import { useEffect, useState } from "react";

export default function useTelemetry() {
  const [data, setData] = useState({
    bp: "--",
    spo2: "--",
    hr: "--",
    temp: "--",
    ecg: 0,
    alerts: {
      spo2: "normal",
      hr: "normal",
      temp: "normal"
    }
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  return data;
}
