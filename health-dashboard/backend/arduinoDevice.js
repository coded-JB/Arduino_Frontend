const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

class ArduinoDevice {
  constructor(portPath = "/dev/ttyACM0", baudRate = 9600) {
    this.port = new SerialPort({
      path: portPath,
      baudRate,
    });

    this.parser = this.port.pipe(
      new ReadlineParser({ delimiter: "\n" })
    );
  }

  start(onData) {
    this.port.on("open", () => {
      console.log("Arduino connected");
    });

    this.port.on("error", (err) => {
      console.error("Serial error:", err.message);
    });

    this.parser.on("data", (line) => {
      try {
        line = line.trim();

        console.log("RAW:", line);

        const parts = line.split(",");
        const parsed = {};

        parts.forEach((part) => {
          const [key, value] = part.split(":");

          if (key && value) {
            parsed[key.trim()] = value.trim();
          }
        });

        const data = {
          bp: parsed.BP || "--",
          spo2: Number(parsed.SPO2 || 0),
          hr: Number(parsed.HR || 0),
          temp: Number(parsed.TEMP || 0),
          ecg: Number(parsed.ECG || 0),
        };

        onData(data);

      } catch (err) {
        console.error("Parse error:", err.message);
      }
    });
  }
}

module.exports = ArduinoDevice;