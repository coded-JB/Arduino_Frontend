#include <Arduino.h>
#include "config.h"
#include "indicators.h"

void initIndicators() {

  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

}
