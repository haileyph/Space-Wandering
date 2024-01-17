#include "Adafruit_VL53L0X.h"

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(4, INPUT_PULLUP); //sets pin 5 as a type of pin that is HIGH by default and LOW when pressed    

  while (! Serial) {
    delay(1);
  }

  if (!lox.begin()) {
    Serial.println(F("Failed to boot VL53L0X"));
    while(1);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  VL53L0X_RangingMeasurementData_t measure;
  lox.rangingTest(&measure, false);

  int buttonState1 = digitalRead(4); //declares a variable to hold the current state of pin 4

  int sensorValueX = analogRead(A0);
  int sensorValueY = analogRead(A1);
  int fsrReading = analogRead(A2); 

  // int xValue = sensorValueX;
  // int yValue = sensorValueY;
  int xValue = map(sensorValueX, 0, 1023, 0, 255);
  int yValue = map(sensorValueY, 0, 1023, 0, 255); // 0 to 255 range so that the digital pins can read them
  int fsrValue = map(fsrReading, 0, 1000, 0, 255);

  Serial.print(xValue);
  Serial.print(",");
  Serial.print(yValue);
  Serial.print(",");
  Serial.print(fsrValue);
  Serial.print(",");
  
  if (measure.RangeStatus != 4) {  // phase failures have incorrect data
    Serial.print(measure.RangeMilliMeter);
  } else {
    Serial.print(1300);
  }

  Serial.print(",");
  Serial.println(buttonState1);

  delay(100);
}


// void setup() {
//   // put your setup code here, to run once:
//   Serial.begin(9600);
// }

// void loop() {
//   // put your main code here, to run repeatedly:
//   int sensorValueX = analogRead(A0);
//   int sensorValueY = analogRead(A1);
//   int fsrReading = analogRead(A2); 

//   int xValue = map(sensorValueX, 0, 1023, 0, 255);
//   int yValue = map(sensorValueY, 0, 1023, 0, 255); // 0 to 255 range so that the digital pins can read them
  

//   Serial.print(xValue);
//   Serial.print(",");
//   Serial.println(yValue);
//   delay(1);
// }