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

  ctx.beginPath();
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;

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

const styles = {
  wrapper: {
    marginTop: 20,
    background: "#0b1220",
    padding: 15,
    borderRadius: 12
  },
  title: {
    color: "#94a3b8",
    marginBottom: 10
  },
  canvas: {
    width: "100%",
    height: 160,
    background: "#070d18"
  }
};