# Space Wandering
## Description
View the live website [HERE]().

This project is a comination of building Arduino hardware interaction and connecting with P5.JS front-end library.

Space Wandering is a chasing game where users try to move their UFO away from the approaching Meteor, the game ends when the Meteor hits their UFO. Movement can be controlled with a thumb joystick, acceleration by pressing the force-sensitive sensors, and the sound volume is measured by the distance from our hands to the physical playing zone. The goal is to deliver an immersive and dynamic gameplay environment that combines cutting-edge technology with engaging user interactions.

## Setting Up
### Step 1: Hardware
Set up the hardware and plug into Arduino Uno as the circuit diagram below:
![alt text](https://github.com/haileyph/Space-Wandering/blob/main/assets/circuit.png?raw=true)

Hardware used in the circuit:
- [Arduino Uno](https://store-usa.arduino.cc/products/arduino-uno-rev3?selectedStore=us)
- [Thumb Joystick](https://exploreembedded.com/wiki/Analog_JoyStick_with_Arduino)
- [Force Sensing Resistor](https://learn.adafruit.com/force-sensitive-resistor-fsr/overview)
- [Adafruit VL530X Time of Flight Distance Sensor](https://www.adafruit.com/product/3317)
- 10k Ohm Resistors
- Pushbutton
- Wires

### Step 2: Arduino IDE
Download the software [HERE](https://www.arduino.cc/en/software)

[Adafruit VL53L0X Library](https://github.com/adafruit/Adafruit_VL53L0X)

Paste and Run the Arduino IDE code below

```cpp
#include "Adafruit_VL53L0X.h"
Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(9600);
  pinMode(4, INPUT_PULLUP);
  while (! Serial) {
    delay(1);
  }
  if (!lox.begin()) {
    Serial.println(F("Failed to boot VL53L0X"));
    while(1);
  }
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;
  lox.rangingTest(&measure, false);
  int buttonState1 = digitalRead(4);
  int sensorValueX = analogRead(A0);
  int sensorValueY = analogRead(A1);
  int fsrReading = analogRead(A2); 
  int xValue = map(sensorValueX, 0, 1023, 0, 255);
  int yValue = map(sensorValueY, 0, 1023, 0, 255);
  int fsrValue = map(fsrReading, 0, 1000, 0, 255);

  Serial.print(xValue);
  Serial.print(",");
  Serial.print(yValue);
  Serial.print(",");
  Serial.print(fsrValue);
  Serial.print(",");
  if (measure.RangeStatus != 4) { 
    Serial.print(measure.RangeMilliMeter);
  } else {
    Serial.print(1300);
  }
  Serial.print(",");
  Serial.println(buttonState1);

  delay(100);
}
```

### Step 3: P5.JS

Connect P5.JS to the serial port in ```sketch.js```

```javascript
  //open our serial port -- CHANGE THE SERIAL PORT HERE
  serial.open('/dev/tty.usbmodem1201');
```

## Process Document
Refer to my [process document](https://sheridanc-my.sharepoint.com/personal/phamhang_shernet_sheridancollege_ca/Documents/23%20Fall%20%F0%9F%8C%A4%EF%B8%8F/IxD%20Phy%20Comp/submit/HaileyPham_Project2.pdf?CT=1705426768912&OR=ItemsView) for more details.

Demo images and videos [HERE](https://ixd552.phoenix.sheridanc.on.ca/Fall%2023/PhysComp/Module_2_WebTemplate/#Project1)

## License
[MIT](https://choosealicense.com/licenses/mit/)
