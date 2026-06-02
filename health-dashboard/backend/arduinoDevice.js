const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

class ArduinoDevice {

  constructor() {
    this.port = null;
    this.parser = null;
    this.connected = false;
    this.onData = null;

    this.connect();
  }

  async findArduinoPort() {

    const ports = await SerialPort.list();

    return ports.find((p) => {

      const manufacturer =
        p.manufacturer?.toLowerCase() || "";

      return (
        p.vendorId === "2341" ||
        manufacturer.includes("arduino") ||
        manufacturer.includes("wch") ||
        manufacturer.includes("ch340") ||
        manufacturer.includes("silicon")
      );

    });
  }

  async connect() {

    try {

      const portInfo = await this.findArduinoPort();

      if (!portInfo) {

        console.log("Waiting for Arduino...");

        setTimeout(() => this.connect(), 3000);

        return;
      }

      console.log("Connecting to:", portInfo.path);

      this.port = new SerialPort({
        path: portInfo.path,
        baudRate: 9600
      });

      this.parser = this.port.pipe(
        new ReadlineParser({
          delimiter: "\n"
        })
      );

      this.connected = true;

      console.log("Arduino connected");

      this.attachListeners();

    } catch (err) {

      console.error("Connection failed:", err.message);

      setTimeout(() => this.connect(), 3000);
    }
  }

  attachListeners() {

    this.port.on("close", () => {

      console.log("Arduino disconnected");

      this.connected = false;

      setTimeout(() => this.connect(), 3000);
    });

    this.port.on("error", (err) => {

      console.error("Serial error:", err.message);

      this.connected = false;
    });

    this.parser.on("data", (line) => {

      try {

        line = line.trim();

        const parts = line.split(",");

        const parsed = {};

        parts.forEach((part) => {

          const [key, value] = part.split(":");

          if (key && value) {
            parsed[key.trim()] = value.trim();
          }

        });

        const bpm = Number(parsed.HR || 0);

        const data = {

          ecg: {
            signal: Number(parsed.ECG || 0),

            // Temporary simulated QRS duration
            qrsDuration:
              92 + Math.floor(Math.random() * 6),

            status:
              bpm > 110 || bpm < 55
                ? "warning"
                : "normal"
          },

          heart: {
            bpm
          },

          temperature: {
            value: Number(parsed.TEMP || 0)
          },

          spo2: {
            value: Number(parsed.SPO2 || 0)
          }

        };

        if (this.onData) {
          this.onData(data);
        }

      } catch (err) {

        console.error("Parse error:", err.message);

      }

    });

  }

  start(onData) {
    this.onData = onData;
  }

}

module.exports = ArduinoDevice;
