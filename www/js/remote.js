/*
___________              __   __________                       __
\__    ___/____    ____ |  | _\______   \ ____   _____   _____/  |_  ____
  |    |  \__  \  /    \|  |/ /|       _// __ \ /     \ /  _ \   __\/ __ \
  |    |   / __ \|   |  \    < |    |   \  ___/|  Y Y  (  <_> )  | \  ___/
  |____|  (____  /___|  /__|_ \|____|_  /\___  >__|_|  /\____/|__|  \___  >
               \/     \/     \/       \/     \/      \/                 \/

Author: terryh.tp@gmail.com
Date: 2014-07-08

this remote control send only one char to bluetooth serial port

w --> North, Up
s --> South, Down
d --> East, Right
a --> West, Left

e --> North East
q --> North West
c --> West East
z -- > West West

this mainly take from keyboard mapping

QWE
ASD
Z C

number mean speed

0 to 9

*/
// Initialize Phaser
//var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update, render: render});
var game = new Phaser.Game(700, 700, Phaser.AUTO, 'game' );

var Config = {
  useDeviceOrientation: null,
  bluetoothId: null,
  isConnected: false,
  devices: null
};

// global const

var PI1 = Math.PI/8 * 1;
var PI3 = Math.PI/8 * 3;
var PI5 = Math.PI/8 * 5;
var PI7 = Math.PI/8 * 7;

var Remote = {

  preload : function () {
    // Change the background color of the game
    this.game.stage.backgroundColor = '#71c5cf';
    this.game.load.image('arrow', 'img/go_right.png');

  },

  create : function () {

    // center point
    this.center = new Phaser.Point(350, 350);


    // setup timer to check bluetooth
    this.checkInterval = 400;
    this.timer = this.game.time.create();
    this.timer.loop( this.checkInterval, this.countSentData, this);
    this.timer.start();

    this.inProcess = false;

    // serial connect state
    this.maxRetry = 5;
    this.countRetry = 0;

    this.IsConnected = false;

    // pointer arrow
    this.arrow = this.game.add.sprite(0,0, 'arrow');
    this.arrow.anchor.set(0.5);
    this.arrow.inputEnabled = true;
    this.arrow.input.enableDrag(true);
    this.arrow.x = this.center.x + 270;
    this.arrow.y = this.center.y;

    // the arrow scale mean the speed dfault scale from 1 to 2
    // the speed is from 0 to 9
    this.arrow.scale.x = 1;
    this.arrow.scale.y = 1;
    //this.arrow.visible = false;
    this.arrowDistance = this.arrow.x - this.game.world.centerX;

    // draw outerBall
    var radius = 60;
    var outerRadius = 200;
    this.maxDist  = outerRadius - radius;

    // inner control
    var inner = this.game.add.bitmapData(radius*2,radius*2);
    inner.circle(radius, radius, radius, "#ff0000");
    this.control = this.game.add.sprite(this.center.x, this.center.y, inner);
    this.control.anchor.set(0.5);

    var outerCircle = this.game.add.graphics(0,0);
    outerCircle.lineStyle(20, "#cfffff", 0.2);
    outerCircle.drawCircle(this.center.x, this.center.y, outerRadius);

    if (this.game.device.touch) {
      this.touchDevice = true;
      this.game.input.addPointer();
    }

  },

  update: function () {
    this.arrow.rotation = this.game.physics.arcade.angleToPointer(this.center);


    this.arrow.x = this.center.x + this.arrowDistance * Math.cos(this.arrow.rotation);
    this.arrow.y = this.center.y + this.arrowDistance * Math.sin(this.arrow.rotation);
  },

  render: function () {
    var deltaX, deltaY, rotate, dist;
    deltaX = 0;
    deltaY = 0;
    rotate = 0;
    dist = 0;


    if (this.touchDevice) {
      if (game.input.pointer1.isDown) {
        dist = this.game.math.distance(this.game.input.x, this.game.input.y, this.center.x, this.center.y);
      } else {
        dist = 0;
      }

    } else {
      if (game.input.mousePointer.isDown) {
        dist = this.game.math.distance(this.game.input.x, this.game.input.y, this.center.x, this.center.y);
      } else {
        dist = 0;
      }
    }


    if (dist !== 0 ) {

      dist = dist >= this.maxDist ? this.maxDist : dist;

      this.control.x = this.center.x + dist * Math.cos(this.arrow.rotation);
      this.control.y = this.center.y + dist * Math.sin(this.arrow.rotation);

      // count the arrow scale from 1 to 2
      this.arrow.scale.x = 1 + 1 * dist/this.maxDist;
      this.arrow.scale.y = this.arrow.scale.x;

    } else {
      this.control.x = this.center.x;
      this.control.y = this.center.y;
      this.arrow.scale.x = 1;
      this.arrow.scale.y = 1;

    }


    this.game.debug.spriteInfo(this.arrow, 10, 10);
    this.game.debug.text(this.arrowDistance, 10, 100);
    this.game.debug.text(this.center.x, 10, 120);
    this.game.debug.text(this.center.y, 10, 140);
    this.game.debug.text(this.arrow.rotation, 10, 160);


    //game.debug.geom(innerBall,'red');
  },
  writeSerial: function(OneChar) {
    // dummy write, not care about success or error
    console.log(OneChar);
    bluetoothSerial.write(OneChar, function(){
      console.log("write success");
    }, function(){
      console.log("write fail");
    });
  },

  countSentData: function(){
    if (! Config.isConnected) return;

    // 1.0 ~ 1.1 consider stop maxspeed is (2-1) * 10 -1 = 9

    var speedChar = Math.round((this.arrow.scale.x - 1) * 10 -1);

    speedChar = speedChar <=0 ? 0 : speedChar;

    this.writeSerial(speedChar);

    // Math.PI = 3.14159;
    // q -> >= -7/8 ~  < -5/8 PI
    // w -> >= -5/8 ~  < -3/8 PI
    // e -> >= -3/8 ~  < -1/8 PI
    //
    // a -> >= -8/8 ~ < -7/8 PI
    // a -> <=  8/8 ~ >  7/8 PI
    //
    //
    // s -> <=  5/8 ~ >  3/8 PI
    // d -> >= -1/8  ~ < 1/8 PI
    //
    // z -> <=  7/8  ~  > 5/8 PI
    // c -> <=  3/8  ~  > 1/8 PI
    //
    //QWE
    //ASD
    //Z C
    var rPI  = this.arrow.rotation;
    console.log(rPI);
    // only kep doing while speed have value
    if (speedChar == 0) return;


    switch (true) {

      case (rPI >= -PI7 && rPI < -PI5 ):
        this.writeSerial("q");
        break;
      case (rPI >= -PI5 && rPI < -PI3 ):
        this.writeSerial("w");
        break;
      case (rPI >= -PI3 && rPI < -PI1 ):
        this.writeSerial("e");
        break;
      case (rPI >= -Math.PI && rPI < -PI7 ):
        this.writeSerial("a");
        break;
      case (rPI <= Math.PI && rPI > PI7 ):
        this.writeSerial("a");
        break;
      case (rPI <= PI5 && rPI > PI3 ):
        this.writeSerial("s");
        break;
      case (rPI >= -PI1 && rPI < PI1 ):
        this.writeSerial("d");
        break;
      case (rPI <= PI7 && rPI > PI5 ):
        this.writeSerial("z");
        break;
      case (rPI <= PI3 && rPI > PI1 ):
        this.writeSerial("c");
        break;

      default:
        //this.writeSerial("0");
        break;
    }

  }
};


game.state.add('main', Remote);
game.state.start('main');

// cordova device ready
document.addEventListener('deviceready', onDeviceReady, false);

//
// window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;
  console.log("Absolute",absolute);
  console.log("Alpha",alpha);
  console.log("Leta", beta);
  console.log("Gamma", gamma);
}

function onDeviceReady(){

}

function toggleUseOrientation(){
  Config.useDeviceOrientation = document.querySelector("#checkboxFourInput").checked;

}


var bluetoothList = function(){
  bluetoothSerial.list(function(devices) {
    Config.devices = devices;
    var domSelect = document.getElementById('bluetoothId');
    domSelect.options.length = 0; // clear out existing items
    console.log(devices);
    domSelect.options.add(new Option( "Select (Disconnect)", ""));

    devices.forEach(function(device) {
      domSelect.options.add(new Option( device.name + " (" + device.id + ")", device.id));
      console.log(device);
    });

  }, function() {
    alert("Sorry, not found any bluetooth device.");

  });
} // end of bluetoothList

function listBlueToothDevices(){
  if ( typeof( bluetoothSerial) !== 'undefined') {
      bluetoothList();
  }
}

function onSelect(){
  Config.bluetoothId = document.getElementById("bluetoothId").value;

  // make connection
  if (Config.bluetoothId && Config.isConnected === false ) {
    // not isConnected, try to connect
    console.log("Going to connect.");
    bluetoothSerial.connect(Config.bluetoothId,
      function(){
        console.log("Connect successful.");
        Config.isConnected = true;
      },
      function(){
        console.log("Connect fail.");
      }
    ); // end of bluetoothSerial connect
  } // end of if


  // disconnect
  if (Config.bluetoothId === "") {
    console.log("Going to connect.");
    bluetoothSerial.disconnect(
      function(){
        console.log("Disconnect successful.");
        Config.isConnected = false;
      },

      function(){
        console.log("Disconnect fail.");
      }
    );

  } // end of if Config

}
