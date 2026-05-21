export default function AlertPanel({ alerts = [] }) {

  return (
    <div className="panel">

      <div className="title">
        ALERTS
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}
      >

        {alerts.length === 0 && (
          <div
            style={{
              color: "#22c55e",
              fontWeight: "bold"
            }}
          >
            SYSTEM NORMAL
          </div>
        )}

        {alerts.map((alert, index) => (

          <div
            key={index}
            style={{
              padding: 14,
              borderRadius: 10,
              border:
                alert.type === "critical"
                  ? "1px solid red"
                  : "1px solid orange",

              background:
                alert.type === "critical"
                  ? "rgba(255,0,0,0.1)"
                  : "rgba(255,165,0,0.1)",

              animation:
                alert.type === "critical"
                  ? "pulse 1s infinite"
                  : "none"
            }}
          >

            <div
              style={{
                fontWeight: "bold",
                marginBottom: 5
              }}
            >
              {alert.type.toUpperCase()}
            </div>

            <div>
              {alert.message}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}