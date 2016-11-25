/*
 Tank Control 
 */

// ledPin
int ledPin = 13;

// Motor 1
int E1 = 3;  //PWMA
int M1 = 4;  //DIRA

// Motor 1
int E2 = 6;  //PWMB            
int M2 = 7;  //DIRB

//the speed value changevalue from 0-255
// the motor should only take 3 - 6 volt
// the current 18650 x 2 will have Max to 8.4 volt
// limit to 6 / 8.4 * 255 = 182, use to MaxSpeed
// limit to 5 / 8.4 * 255 = 151, use to MaxSpeed
int MaxSpeed = 153;

int baudrate = 9600;

char inputValue;

int Speed = 0;              // the PWM to EN1 EN2 

// the speed is from 0 to 9 control via main loop, 9 step
int stepSpeed = MaxSpeed/9;  


//  changeSpeed
void changeSpeed(int goSpeed) {
    // full speed MaxSpeed, stop 0

    Speed = constrain(goSpeed, 0, MaxSpeed);

    analogWrite(E1, Speed);
    analogWrite(E2, Speed);
}

// Motor 1 forward
void M1Forward() {
    digitalWrite(M1,HIGH);    
}
// Motor 2 forward
void M2Forward() {
    digitalWrite(M2,HIGH);    
}
// Motor 1 backward
void M1Backward() {
    digitalWrite(M1,LOW);    
}
// Motor 2 backward
void M2Backward() {
    digitalWrite(M2,LOW);    
}

// Motor 1 Stop
void M1Stop() {
    analogWrite(E1, 0);
}
// Motor 2 Stop
void M2Stop() {
    analogWrite(E2, 0);
}


// the setup routine runs once when you press reset:
void setup() {                
  // initialize the digital pin as an output.

  // ledPin
  pinMode(ledPin, OUTPUT);


  // Motor 1
  pinMode(M1, OUTPUT);     
  pinMode(E1, OUTPUT);     
  
  // Motor 2
  pinMode(M2, OUTPUT);     
  pinMode(E2, OUTPUT);     

  analogWrite(E1, 0);
  analogWrite(E2, 0);
  Serial.begin(baudrate);
  /*delay(6000);*/
}


// the loop routine runs over and over again forever:
void loop() {
    // reset ledPin

    if (Serial.available() > 0 ) {
        inputValue = Serial.read();

        Serial.println(inputValue);
        
        // Motor 1 is at right. 
        // Motor 2 is at left.
        switch (inputValue) {
            /*case 'w':*/
                /*digitalWrite(ledPin,HIGH);    */
                /*break;*/
            /*case 's':*/
                /*digitalWrite(ledPin,LOW);    */
                /*break;*/

            case 'q':
                // North West, Forward Left
                M1Forward();
                M2Stop();
                break;
            case 'w':
                // North ; Forward
                M1Forward();
                M2Forward();
                break;
            case 'e':
                // North East, Forward Right
                M1Stop();
                M2Forward();
                break;
            case 'a':
                // West, Left
                M1Forward();
                M2Backward();
                break;
            case 's':
                // West, Backward
                M1Backward();
                M2Backward();
                break;
            case 'd':
                // East, Right
                M1Backward();
                M2Forward();
                break;
            case 'z':
                // South West, Backward Left 
                M1Backward();
                M2Stop();
                break;
            case 'c':
                // South East, Backward Right
                M1Stop();
                M2Backward();
                break;

            // speed control
            case '9':
                changeSpeed(9*stepSpeed);
                break;
            case '8':
                changeSpeed(8*stepSpeed);
                break;
            case '7':
                changeSpeed(7*stepSpeed);
                break;
            case '6':
                changeSpeed(6*stepSpeed);
                break;
            case '5':
                changeSpeed(5*stepSpeed);
                break;
            case '4':
                changeSpeed(4*stepSpeed);
                break;
            case '3':
                changeSpeed(3*stepSpeed);
                break;
            case '2':
                changeSpeed(2*stepSpeed);
                break;
            case '1':
                changeSpeed(1*stepSpeed);
                break;
            case '0':
                changeSpeed(0);
                break;

            default:
                // Stop
                break;
        }

        /*Serial.println(inputValue, DEC );*/
        /*Serial.println(inputValue, HEX );*/
        /*Serial.println(inputValue, OCT );*/
        /*Serial.println(inputValue, BIN );*/
    }

    // make this change to action
    delay(100);

    //******************************************  
    // Motor test code
    /*changeSpeed(0);*/
    /*delay(3000);*/
    /*changeSpeed(0.5);*/
    /*M1Forward();*/
    /*M2Forward();*/
    /*delay(1000);*/
    /*M1Backward();*/
    /*M2Backward();*/
    /*delay(1000);*/
    //******************************************  

}

