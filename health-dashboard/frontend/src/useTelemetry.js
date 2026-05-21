import { useEffect, useState } from "react";

export default function useTelemetry() {
  const [data, setData] = useState({
    ecg: {
      signal: 0,
      qrsDuration: 92,
      status: "normal"
    },
    alerts: [],
    device: {
      connected: true,
      message: "Connected"
    }

  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {

      const incoming = JSON.parse(event.data);

      if (incoming.type === "device_status") {

        setData((prev) => ({
          ...prev,
          device: {
            connected: incoming.connected,
            message: incoming.message
          }
        }));

        return;
      }

      setData((prev) => ({
        ...incoming,

        device: {
          connected: true,
          message: "Arduino Connected"
        }
      }));
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  return data;
}
