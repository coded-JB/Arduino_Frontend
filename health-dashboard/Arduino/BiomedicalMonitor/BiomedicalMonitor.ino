#include "config.h"
#include "ecg.h"
#include "temperature.h"
#include "indicators.h"

void setup() {

  Serial.begin(9600);

  randomSeed(analogRead(A5));

  initECG();
  initTemperature();
  initIndicators();
}

void loop() {

  int hr = random(68, 92);
  int spo2 = random(96, 100);

  float temp = readTemperature();

  int ecg = readECG();

  Serial.print("HR:");
  Serial.print(hr);

  Serial.print(",SPO2:");
  Serial.print(spo2);

  Serial.print(",TEMP:");
  Serial.print(temp);

  Serial.print(",ECG:");
  Serial.println(ecg);

  delay(500);
}
