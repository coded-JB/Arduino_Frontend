export default function Header() {

  const time = new Date().toLocaleTimeString();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        padding: "14px 20px",

        marginBottom: 20,

        border: "1px solid #1e293b",

        borderRadius: 12,

        background: "#020617"
      }}
    >

      <div>

        <h2
          style={{
            margin: 0,
            color: "#00ff88"
          }}
        >
          Biomedical Monitoring System
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b"
          }}
        >
          Real-Time Telemetry Dashboard
        </p>

      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#38bdf8"
        }}
      >
        {time}
      </div>

    </div>
  );
}