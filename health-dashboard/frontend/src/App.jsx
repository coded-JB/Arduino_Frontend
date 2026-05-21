import useTelemetry from "./useTelemetry";
import ECG from "./ECG";

export default function App() {
  const data = useTelemetry();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Medical Dashboard</h2>

      <div style={styles.grid}>
        <Card label="BP" value={data.bp} />
        <Card label="SpO₂" value={data.spo2 + "%"} />
        <Card label="HR" value={data.hr + " bpm"} />
        <Card label="Temperature" value={data.temp + " °C"} />
      </div>

      <ECG value={data.ecg} />
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}
{/* <ECG value={data.ecg} /> */}
const styles = {
  container: {
    padding: 30,
    fontFamily: "Arial",
    background: "#0b1220",
    minHeight: "100vh",
    color: "white"
  },
  title: {
    marginBottom: 20
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20
  },
  card: {
    background: "#111c2d",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #1f2a44"
  },
  label: {
    fontSize: 12,
    color: "#94a3b8"
  },
  value: {
    fontSize: 28,
    fontWeight: "bold"
  }
};