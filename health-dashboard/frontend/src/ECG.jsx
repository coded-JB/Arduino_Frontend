import { useEffect, useRef } from "react";

export default function ECG({ value = 0 }) {
  const canvasRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 160;

    const safeValue = typeof value === "number" ? value : 0;

    dataRef.current.push(safeValue);

    if (dataRef.current.length > 200) {
      dataRef.current.shift();
    }

    draw(ctx, canvas, dataRef.current);
  }, [value]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>ECG Monitor</div>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
}

/* ---------- DRAW ---------- */

function draw(ctx, canvas, data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(ctx, canvas);

  ctx.beginPath();
 ctx.strokeStyle = "#00ff88";
 ctx.lineWidth = 2;
 ctx.shadowColor = "#00ff88";
 ctx.shadowBlur = 10;

  const slice = canvas.width / data.length;
  let x = 0;

  for (let i = 0; i < data.length; i++) {
    const y = canvas.height / 2 - data[i] * 50;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    x += slice;
  }

  ctx.stroke();
}

function drawGrid(ctx, canvas) {
  const spacing = 20;

  ctx.strokeStyle = "rgba(34,197,94,0.08)";
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

const styles = {
  wrapper: {
    width: "100%",
    background: "#050816",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #1e293b",
    boxShadow: "0 0 20px rgba(0,255,120,0.15)"
  },

  title: {
    color: "#22c55e",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold"
  },

  canvas: {
    width: "100%",
    height: 220,
    background: "#020617",
    display: "block"
  }
};
