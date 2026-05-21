export default function DeviceStatus({ device }) {

  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,

        border: device.connected
          ? "1px solid #22c55e"
          : "1px solid red",

        background: device.connected
          ? "rgba(34,197,94,0.08)"
          : "rgba(255,0,0,0.08)",

        color: device.connected
          ? "#22c55e"
          : "red",

        fontWeight: "bold"
      }}
    >
      {
        device.connected
          ? "DEVICE ONLINE"
          : "DEVICE OFFLINE"
      }

      <div
        style={{
          marginTop: 5,
          fontSize: 14,
          opacity: 0.8
        }}
      >
        {device.message}
      </div>
    </div>
  );
}
