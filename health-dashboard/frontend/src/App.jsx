import useTelemetry from "./useTelemetry";
import ECG from "./ECG";
import AlertPanel from "./AlertPanel";
import DeviceStatus from "./components/DeviceStatus";
export default function App() {
  const data = useTelemetry();

  return (
    <div className="dashboard">

      <div className="top-grid">

        <div className="panel">
          <div className="title">ECG MONITOR</div>

          <ECG hr={data.heart?.bpm} />

          <h2 className={
            data.qrs?.status === "warning"
              ? "status-warning"
              : "status-normal"
          }>
            HR: {data.heart?.bpm} BPM
          </h2>
        </div>

        <div className="panel">
          <div className="title">SYSTEM STATUS</div>

          <h1 className="big-number">
            {data.heart?.bpm}
          </h1>

          <p>BPM</p>

          <p className={
            data.qrs?.status === "warning"
              ? "status-warning"
              : "status-normal"
          }>
            {data.qrs?.status || "normal"}
          </p>
        </div>

      </div>

      <div style={{ marginTop: 20 }}>
        <DeviceStatus device={data.device} />
      </div>

      <div className="bottom-grid">

        <div className="panel">
          <div className="title">TEMPERATURE</div>

          <h1 className="big-number">
            {data.temperature?.value}<span className="unit">°C</span>
          </h1>
        </div>

        <div className="panel">
          <div className="title">SpO₂</div>

          <h1 className="big-number">
            {data.spo2?.value}<span className="unit">%</span>
          </h1>
        </div>

        <AlertPanel alerts={data.alerts} />

      </div>
<div
  style={{
    marginTop: 20,
    padding: 10,
    border: "1px solid #1e293b",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    background: "#020617",
    color: "#22c55e"
  }}
>
  <span>STATUS: SYSTEM ACTIVE</span>
  <span>ARDUINO CONNECTED</span>
</div>

    </div>
  );
}
