let deviceConnected = false;
let lastTelemetryTime = Date.now();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const ArduinoDevice = require("./arduinoDevice");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const device = new ArduinoDevice();


wss.on("connection", (ws) => {
  console.log("Client connected");
});

server.listen(3000, () => {
  console.log("Backend running on port 3000");
});

function enrichTelemetry(data) {

  const alerts = [];

  // HEART RATE
  if (data.heart.bpm < 55) {
    alerts.push({
      type: "warning",
      source: "heart",
      message: "Bradycardia detected"
    });
  }

  if (data.heart.bpm > 110) {
    alerts.push({
      type: "critical",
      source: "heart",
      message: "Tachycardia detected"
    });
  }

  // SPO2
  if (data.spo2.value < 95) {
    alerts.push({
      type: "warning",
      source: "spo2",
      message: "Low oxygen saturation"
    });
  }

  if (data.spo2.value < 90) {
    alerts.push({
      type: "critical",
      source: "spo2",
      message: "Critical oxygen level"
    });
  }

  // TEMPERATURE
  if (data.temperature.value > 37.5) {
    alerts.push({
      type: "warning",
      source: "temperature",
      message: "Elevated temperature"
    });
  }

  return {
    ...data,
    alerts
  };
}

device.start((data) => {

  deviceConnected = true;
  lastTelemetryTime = Date.now();

  const enriched = enrichTelemetry(data);

  wss.clients.forEach((client) => {

    if (client.readyState === 1) {
      client.send(JSON.stringify(enriched));
    }

  });

});

setInterval(() => {

  const now = Date.now();

  if (now - lastTelemetryTime > 3000) {

    deviceConnected = false;

    const disconnectPayload = {
      type: "device_status",
      connected: false,
      message: "Arduino disconnected"
    };

    wss.clients.forEach((client) => {

      if (client.readyState === 1) {
        client.send(JSON.stringify(disconnectPayload));
      }

    });

  }

}, 1000);
