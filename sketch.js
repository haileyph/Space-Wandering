var serial; 
let x = 400, y = 400;
var x1 = 0, y1 =0;

let vehicle;
let target;
var stars = [];

var screen = 0;
let lives = 5;
let meteorImg, ufoImg, sound, button, howtoplay;

function preload(){
  meteorImg = loadImage("assets/meteor.png");
  ufoImg = loadImage("assets/ufo.png");
  button = loadImage("assets/button.png");
  howtoplay = loadImage("assets/howtoplay.png");
  sound = loadSound("assets/theme.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

	soundFormats('mp3');
  sound.loop();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  sound.amp(0.5);

  serial = new p5.SerialPort(); //a new instance of serial port library

  //set up events for serial communication
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);

  //open our serial port -- CHANGE THE SERIAL PORT HERE
  serial.open('/dev/tty.usbmodem1201');
  
  for (var i = 0; i < 1000; i++) {
		stars[i] = new Star();
	}

  resetSketch();
}

function resetSketch(){
  vehicle = new Vehicle(100, 100);
}

function draw() {
  background(30);
	for (var i = 0; i < stars.length; i++) {
		stars[i].draw();
	}

  if(screen == 0){
    startScreen();
  }else if(screen == 1){
  	gameOn();
  }else if(screen==2){
  	endScreen();
  }	
}

function mousePressed(){
	if(screen==0){
  	screen = 1;
  }else if(screen==2){
    screen = 1;
  	resetSketch();
  }
}


function gameOn(){
  image(howtoplay, width/2-230, height - 200, 460,172, 80);
  
  fill(255, 0, 0);
  noStroke();
  target = createVector(x+=x1, y+=y1);
  image(ufoImg, target.x, target.y, 45.5, 30.8);
  
  vehicle.seek(target);
  vehicle.update();
  vehicle.show();
  
  // console.log(x1 + ","+ y1);
  //  console.log(vehicle.pos.x, vehicle.pos.y);
  
  if(abs(target.x - vehicle.pos.x) <=10 && abs(target.y -vehicle.pos.y)<=10){
    lives-=1;
     console.log(lives);
    if (lives<=50){
      screen=2;
      }
    }
}

function startScreen(){
  noStroke()
  fill(49,50,102)
  rect(2*width/6, height/2-width/12, width/3, width/6, 10);
  
  textFont('Space Mono');
  textAlign(CENTER);
  fill(255,255,255)
  textSize(width/35);
  text('space wandering', width / 2, height / 2)
  
  textSize(width/80);
  text('click to start', width / 2, height / 2 + width/35);

  image(button, width/2-15, height/2+width/25, 30, 30);
}

function endScreen(){
  noStroke()
  fill('#313266')
  rect(2*width/6, height/2-width/12, width/3, width/6, 10);
  
  textFont('Space Mono');
  textAlign(CENTER);
  fill('#ffffff')
  textSize(width/40);
  text("you're lost in space", width / 2, height / 2)
  
  textSize(width/80);
  text('click to play again', width / 2, height / 2 + width/35);

  image(button, width/2-15, height/2 + width/25, 30, 30);
}

//all my callback functions are down here:
//these are useful for giving feedback
function serverConnected(){
	console.log('connected to the server');
}

function portOpen(){
  console.log('the serial port opened!');
}

function serialEvent(){
  var data = serial.readLine();
  console.log(data);
  
  if(data.length > 0){
    var sensors = split(data, ",");
    let xValue = sensors[0];
    let yValue = sensors[1];
    let fsrValue = map(sensors[2], 0, 255, 0, 5);
    let velPos = 3 + fsrValue;
    let tofValue = map(sensors[3], 0, 1300, 5, 0.2);   
    sound.amp(tofValue);
    let buttonValue = sensors[4];
    if(buttonValue !=0){
      if(screen==0){
        screen = 1;
      }else if(screen==2){
        screen = 1;
        resetSketch();
      }
    }
    x1 = map(xValue, 0, 255, -velPos, velPos); // map mouse x position to a smaller range
    y1 = map(yValue, 0, 255, -velPos, velPos); // map mouse y position to a smaller range
  } 
}



function serialError(err){
  console.log('something went wrong with the port. ' + err);
}

function portClose(){
  console.log('the port was closed');
}

// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

class Star {
	constructor() {
		this.x = random(width);
		this.y = random(height);
		this.size = random(0.25, 3);
		this.t = random(TAU);
	}

	draw() {
		this.t += 0.1;
		var scale = this.size + sin(this.t) * 2;
		noStroke();
		ellipse(this.x, this.y, scale, scale);
	}
}

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
    this.maxForce = 0.25;
    this.r = 16;
  }

  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(this.maxSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    
    push();
    translate(this.pos.x, this.pos.y);
    angleMode(DEGREES);
    rotate(this.vel.heading()+45);
    image(meteorImg, -this.r-30, 0-32, 50, 50);
    pop();
  }

  
 
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
