let rave = 0;

let fish = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (rave) {
    colorMode(HSB);
  }
  for (let i = 0; i < 10; i++) {
    let a = new Animal(
      random(width),
      random(height),
      random(0.5, 1.2),
      color(random(200, 220), random(20, 20), random(50,70)),
      color(random(90, 100), random(10, 10), random(220, 240))
    );
    fish.push(a);
  }
}

// color(random(200, 220), random(100, 120), random(60,70)),
// color(random(220, 240), random(190, 210), random(190, 210))

function draw() {
  // if (rave) {
  //   background(200, 90, 68);
  // } else {
  //   background(50, 150, 250);
  // }
  clear();
  fill(255, 0, 0);

  // text(a.curv(),100,100)

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

function startRave(){
  colorMode(HSB)
  rave = true;
}
