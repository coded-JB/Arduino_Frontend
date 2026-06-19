#include <Arduino.h>
#include "config.h"
#include "ecg.h"

void initECG() {

}

int readECG() {

  return analogRead(ECG_PIN);

}
