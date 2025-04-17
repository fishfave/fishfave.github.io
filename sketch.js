let rave = 0;
let fish = [];
let socket;

let fishBodyColor;
let fishFinColor;

function setup() {
  socket = new WebSocket('ws://localhost:8080');

  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.command === 'startRave') {
      startRave();
    } else if (data.command === 'stopRave') {
      stopRave();
    }
  };
  
  createCanvas(windowWidth, windowHeight);
  if (rave) {
    colorMode(HSB);
  }
  fishBodyColor = color(210, 20, 60);
  fishFinColor = color(95, 10, 230);
  for (let i = 0; i < 10; i++) {
    let a = new Animal(
      random(width),
      random(height),
      random(0.5, 1.2),
      fishBodyColor,
      fishFinColor
    );
    fish.push(a);
  }
}

function draw() {
  
  clear();
  for (let i = 0; i < fish.length; i++) {
    let a = fish[i];
    let ang = a.head.dir + PI / 2;
    let wiggle = (sin(frameCount / 9 + i * 5) / 6) * a.scl;
    a.applyForce(createVector(cos(ang) * wiggle, sin(ang) * wiggle));

    strokeWeight(a.scl);
    a.update();

    a.drawFins(2, 29, 15);
    a.drawFins(6, 20, 7);

    a.drawTail();
    a.show();
    a.drawBack();
  }

  if (mouseIsPressed) {
    for (let f of fish) {
      if (dist(mouseX, mouseY, f.pos.x, f.pos.y) < 100) {
        f.applyForce(
          p5.Vector.sub(createVector(mouseX, mouseY), f.pos).limit(1)
        );
      }
      
    }
  }
}

function keyPressed(){
  if(keyCode == UP_ARROW){
    addFish();
  } else if(keyCode == DOWN_ARROW){
    removeFish();
  }
  
}



function startRave(){
  colorMode(HSB)
  rave = true;
}

function stopRave(){
  colorMode(RGB);
  rave = false;
  for(let f of fish){
    f.bodyColor = fishBodyColor;
    f.finColor = fishFinColor;
  }
}

function addFish(){
  let a = new Animal(
      random(width),
      random(height),
      random(0.5, 1.2),
      color(random(200, 220), random(20, 20), random(50,70)),
      color(random(90, 100), random(10, 10), random(220, 240))
    );
    fish.push(a);
}

function removeFish(){
  if(fish.length >= 1){
    fish.pop(fish.length-1);
  }
  
}
