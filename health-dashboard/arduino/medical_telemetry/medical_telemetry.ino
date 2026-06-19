#include <OneWire.h>
#include <DallasTemperature.h>

/*
  Hardware from your wiring notes:
  - Arduino Uno
  - AD8232 ECG module:
      3.3V -> 3.3V
      GND  -> GND
      OUT  -> A0
      LO+  -> D10
      LO-  -> D11
  - DS18B20 waterproof temperature probe:
      Red    -> 5V
      Black  -> GND
      Yellow -> DS18B20_PIN with 4.7k pull-up to 5V

  Important: your notes also show SIM800L on D10/D11. Do not use SIM800L on
  D10/D11 at the same time as AD8232 LO+/LO-. Move one of them to different
  pins or leave SIM800L disconnected while reading ECG.
*/

const unsigned long ECG_SAMPLE_INTERVAL_MS = 5;
const unsigned long TELEMETRY_INTERVAL_MS = 500;
const unsigned long STATUS_INTERVAL_MS = 1000;

const int ECG_PIN = A0;
const int ECG_LO_PLUS_PIN = 10;
const int ECG_LO_MINUS_PIN = 11;

// Change this if your DS18B20 yellow/data wire is on another Uno digital pin.
const int DS18B20_PIN = 2;

const int ECG_PEAK_DELTA = 80;
const unsigned long MIN_BEAT_INTERVAL_MS = 300;
const unsigned long MAX_BEAT_INTERVAL_MS = 2000;
const unsigned long BPM_TIMEOUT_MS = 3000;

OneWire oneWire(DS18B20_PIN);
DallasTemperature temperatureSensors(&oneWire);

unsigned long lastEcgSampleAt = 0;
unsigned long lastTelemetryAt = 0;
unsigned long lastStatusAt = 0;
unsigned long lastBeatAt = 0;

int latestEcgSignal = 0;
int latestHeartRateBpm = 0;
float ecgBaseline = 512.0;
bool wasAbovePeak = false;

void setup() {
  Serial.begin(9600);

  pinMode(ECG_LO_PLUS_PIN, INPUT);
  pinMode(ECG_LO_MINUS_PIN, INPUT);

  temperatureSensors.begin();
}

void loop() {
  unsigned long now = millis();

  if (now - lastEcgSampleAt >= ECG_SAMPLE_INTERVAL_MS) {
    lastEcgSampleAt = now;
    sampleEcg(now);
  }

  if (now - lastTelemetryAt < TELEMETRY_INTERVAL_MS) {
    return;
  }

  lastTelemetryAt = now;

  if (!hasPatientContact()) {
    latestHeartRateBpm = 0;
    sendNoContactStatus(now);
    return;
  }

  float temperatureC = readTemperatureC();

  if (!isValidTelemetry(temperatureC)) {
    sendNoContactStatus(now);
    return;
  }

  Serial.print("HR:");
  Serial.print(latestHeartRateBpm);
  Serial.print(",ECG:");
  Serial.print(latestEcgSignal);
  Serial.print(",TEMP:");
  Serial.print(temperatureC, 1);
  Serial.print(",SPO2:");
  Serial.print("NA");
  Serial.print(",QRS:");
  Serial.println("NA");
}

void sampleEcg(unsigned long now) {
  latestEcgSignal = analogRead(ECG_PIN);

  if (!hasPatientContact()) {
    wasAbovePeak = false;
    return;
  }

  ecgBaseline = (ecgBaseline * 0.98) + (latestEcgSignal * 0.02);
  bool isAbovePeak = latestEcgSignal > ecgBaseline + ECG_PEAK_DELTA;

  if (isAbovePeak && !wasAbovePeak) {
    unsigned long interval = now - lastBeatAt;

    if (interval >= MIN_BEAT_INTERVAL_MS && interval <= MAX_BEAT_INTERVAL_MS) {
      latestHeartRateBpm = 60000UL / interval;
    }

    lastBeatAt = now;
  }

  wasAbovePeak = isAbovePeak;

  if (lastBeatAt > 0 && now - lastBeatAt > BPM_TIMEOUT_MS) {
    latestHeartRateBpm = 0;
  }
}

bool hasPatientContact() {
  return digitalRead(ECG_LO_PLUS_PIN) == LOW &&
    digitalRead(ECG_LO_MINUS_PIN) == LOW;
}

bool isValidTelemetry(float temperatureC) {
  if (temperatureC < 30.0 || temperatureC > 45.0) {
    return false;
  }

  // HR is allowed to be 0 briefly while the ECG peak detector finds beats.
  if (latestHeartRateBpm > 0 &&
      (latestHeartRateBpm < 30 || latestHeartRateBpm > 220)) {
    return false;
  }

  return true;
}

float readTemperatureC() {
  temperatureSensors.requestTemperatures();
  return temperatureSensors.getTempCByIndex(0);
}

void sendNoContactStatus(unsigned long now) {
  if (now - lastStatusAt < STATUS_INTERVAL_MS) {
    return;
  }

  lastStatusAt = now;
  Serial.println("STATUS:NO_CONTACT");
}
