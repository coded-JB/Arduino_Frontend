const metrics = [
  {
    key: "hr",
    label: "Heart Rate",
    unit: "BPM",
    decimals: 0,
    color: "#00ff88"
  },
  {
    key: "temp",
    label: "Temperature",
    unit: "°C",
    decimals: 1,
    color: "#f97316"
  },
  {
    key: "spo2",
    label: "SpO₂",
    unit: "%",
    decimals: 0,
    color: "#38bdf8"
  }
];

function formatValue(value, decimals) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toFixed(decimals);
}

function getStats(history, key) {
  const values = history
    .map((item) => Number(item[key]))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return {
      current: null,
      min: null,
      max: null,
      average: null
    };
  }

  const latest = Number(history[history.length - 1]?.[key]);
  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    current: Number.isFinite(latest) ? latest : values[values.length - 1],
    min: Math.min(...values),
    max: Math.max(...values),
    average: total / values.length
  };
}

export default function TelemetryStatsPanel({ history = [] }) {
  return (
    <div className="panel telemetry-stats">
      <div className="title">
        TELEMETRY STATISTICS
      </div>

      <div className="telemetry-stats-grid">
        {metrics.map((metric) => {
          const stats = getStats(history, metric.key);

          return (
            <div
              className="telemetry-stat"
              key={metric.key}
              style={{ "--metric-color": metric.color }}
            >
              <div className="telemetry-stat-label">
                {metric.label}
              </div>

              <div className="telemetry-stat-current">
                {formatValue(stats.current, metric.decimals)}
                <span>{metric.unit}</span>
              </div>

              <div className="telemetry-stat-breakdown">
                <div>
                  <span>Min</span>
                  <strong>{formatValue(stats.min, metric.decimals)}</strong>
                </div>

                <div>
                  <span>Max</span>
                  <strong>{formatValue(stats.max, metric.decimals)}</strong>
                </div>

                <div>
                  <span>Avg</span>
                  <strong>{formatValue(stats.average, metric.decimals)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
