const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const ArduinoDevice = require("./arduinoDevice");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const device = new ArduinoDevice("/dev/ttyACM0", 9600);


wss.on("connection", (ws) => {
  console.log("Client connected");

  device.start((data) => {
    ws.send(JSON.stringify(data));
  });
});

server.listen(3000, () => {
  console.log("Backend running on port 3000");
});

device.start((data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
});