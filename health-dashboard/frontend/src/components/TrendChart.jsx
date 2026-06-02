import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function TrendChart({ history = [] }) {

  const formatted = history.map((item, index) => ({
    index,
    hr: item.hr,
    spo2: item.spo2,
    temp: item.temp
  }));

  return (
    <div className="panel">

      <div className="title">
        TELEMETRY TRENDS
      </div>

      <div style={{ width: "100%", height: 300 }}>

        <ResponsiveContainer>

          <LineChart data={formatted}>

            <CartesianGrid stroke="#1e293b" />

            <XAxis dataKey="index" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="hr"
              stroke="#00ff88"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="spo2"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}