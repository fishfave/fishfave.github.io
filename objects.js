class Body {
  constructor(x, y, r) {
    this.r = r;
    this.pos = createVector(x, y);
    this.dir = 0;
  }

  show() {
    noFill();
    stroke(0, 255, 0);
    circle(this.pos.x, this.pos.y, this.r);
  }
}

class Link {
  constructor(anchor, tail, len) {
    this.anchor = anchor;
    this.tail = tail;
    this.len = len;
    this.offset = p5.Vector.sub(this.tail.pos, this.anchor.pos);
  }
  update() {
    if (this.offset.mag() != this.len) {
      this.tail.pos = p5.Vector.add(
        this.offset.setMag(this.len),
        this.anchor.pos
      );
    }
    this.anchor.dir = this.offset.heading();
    this.tail.dir = this.offset.heading();
  }

  show() {
    let a = this.anchor.pos;
    let b = this.tail.pos;
    stroke(0, 255, 0);
    strokeWeight(1);
    line(a.x, a.y, b.x, b.y);
  }
}

class Animal {
  constructor(x, y, scl, c1, c2) {
    this.vel = p5.Vector.random2D();
    this.maxVel = 2;
    this.acc = createVector(0, 0);
    this.all = 0.05;
    this.col = 0.05;
    this.sep = 0.3;
    this.range = 100 * scl;
    this.bodyColor = c1;
    this.finColor = c2;
    this.scl = scl;
    this.rads = [25, 30, 32, 30, 25, 22, 19, 15, 9];
    this.d = 30 * this.scl;
    this.bodies = [];
    this.links = [];
    for (let i = 0; i < this.rads.length; i++) {
      let b = new Body(x, y + i * 10, this.rads[i] * this.scl);
      this.bodies.push(b);
      if (i > 0) {
        let l = new Link(this.bodies[i - 1], this.bodies[i], 10 * this.scl);
        this.links.push(l);
      }
    }
    this.pos = this.bodies[0].pos;
    this.head = this.bodies[0];
    this.tail = this.bodies[this.bodies.length - 1];
  }

  update() {
    this.Align();
    this.Cohesion();
    this.Separation();
    if (rave) {
      this.bodyColor = color((this.head.dir * 180) / PI + 180, 100, 100);
      this.finColor = this.bodyColor;
    }

    if (this.pos.x < this.d * 1.2) {
      this.applyForce(createVector(0.1, 0));
    }

    if (this.pos.x > width - this.d * 1.2) {
      this.applyForce(createVector(-0.1, 0));
    }

    if (this.pos.y < this.d * 1.2) {
      this.applyForce(createVector(0, 0.1));
    }

    if (this.pos.y > height - this.d * 1.2) {
      this.applyForce(createVector(0, -0.1));
    }
    this.vel.add(this.acc);
    if(rave){
      this.vel.limit(this.maxVel*2);
    }else{
      this.vel.limit(this.maxVel);
    }
    
    
      // if (
      //   this.links[0].offset.copy().mult(-1).angleBetween(this.vel) > 0.5 ||
      //   this.links[0].offset.copy().mult(-1).angleBetween(this.vel) < -0.5
      // ) {
      //   this.vel.setHeading(
      //     lerp(this.vel.heading(), this.head.dir+PI, 0.1)
      //   );
      // }
    
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.tail = this.bodies[this.bodies.length - 1];
    for (let i = 0; i < this.links.length; i++) {
      let l = this.links[i];

      l.offset = p5.Vector.sub(l.tail.pos, l.anchor.pos);
      l.update();
      // l.show()
    }
  }

  applyForce(v) {
    this.acc.add(v);
  }

  show() {
    fill(this.bodyColor);
    let b = this.head;
    beginShape();
    curveVertex(
      b.pos.x + (cos(b.dir + (3 * PI) / 4) * b.r) / 2,
      b.pos.y + (sin(b.dir + (3 * PI) / 4) * b.r) / 2
    );

    curveVertex(
      b.pos.x + (cos(b.dir + PI) * b.r) / 2,
      b.pos.y + (sin(b.dir + PI) * b.r) / 2
    );
    curveVertex(
      b.pos.x + (cos(b.dir + (5 * PI) / 4) * b.r) / 2,
      b.pos.y + (sin(b.dir + (5 * PI) / 4) * b.r) / 2
    );
    curveVertex(
      b.pos.x + (cos(b.dir + (6 * PI) / 4) * b.r) / 2,
      b.pos.y + (sin(b.dir + (6 * PI) / 4) * b.r) / 2
    );

    for (let i = 0; i < this.bodies.length; i++) {
      let b = this.bodies[i];
      let ang = b.dir - PI / 2;
      curveVertex(
        b.pos.x + (cos(ang) * b.r) / 2,
        b.pos.y + (sin(ang) * b.r) / 2
      );
    }
    curveVertex(
      this.tail.pos.x + (cos(this.tail.dir) * this.tail.r) / 2,
      this.tail.pos.y + (sin(this.tail.dir) * this.tail.r) / 2
    );

    for (let i = this.bodies.length - 1; i >= 0; i--) {
      let b = this.bodies[i];
      let ang = b.dir + PI / 2;
      curveVertex(
        b.pos.x + (cos(ang) * b.r) / 2,
        b.pos.y + (sin(ang) * b.r) / 2
      );
    }

    curveVertex(
      b.pos.x + (cos(b.dir + PI / 2) * b.r) / 2,
      b.pos.y + (sin(b.dir + PI / 2) * b.r) / 2
    );
    curveVertex(
      b.pos.x + (cos(b.dir + (3 * PI) / 4) * b.r) / 2,
      b.pos.y + (sin(b.dir + (3 * PI) / 4) * b.r) / 2
    );

    curveVertex(
      b.pos.x + (cos(b.dir + PI) * b.r) / 2,
      b.pos.y + (sin(b.dir + PI) * b.r) / 2
    );
    curveVertex(
      b.pos.x + (cos(b.dir + (5 * PI) / 4) * b.r) / 2,
      b.pos.y + (sin(b.dir + (5 * PI) / 4) * b.r) / 2
    );

    endShape();
    fill(0);
    circle(
      this.head.pos.x + (cos(this.head.dir + PI / 2) * this.head.r) / 2.5,
      this.head.pos.y + (sin(this.head.dir + PI / 2) * this.head.r) / 2.5,
      7 * this.scl
    );
    circle(
      this.head.pos.x + (cos(this.head.dir - PI / 2) * this.head.r) / 2.5,
      this.head.pos.y + (sin(this.head.dir - PI / 2) * this.head.r) / 2.5,
      7 * this.scl
    );
  }
  
  drawFins(n, w, h) {
    fill(this.finColor);
    let b2 = this.bodies[n + 1];
    let b = this.bodies[n];
    let x = b.pos.x + (cos(b.dir + PI / 3) * b.r) / 2;
    let y = b.pos.y + (sin(b.dir + PI / 3) * b.r) / 2;
    push();
    translate(x, y);
    rotate(b2.dir + 0.4);
    ellipse(0, 0, w * this.scl, h * this.scl);
    pop();
    x = b.pos.x + (cos(b.dir - PI / 3) * b.r) / 2;
    y = b.pos.y + (sin(b.dir - PI / 3) * b.r) / 2;
    push();
    translate(x, y);
    rotate(b2.dir - 0.4);
    ellipse(0, 0, w * this.scl, h * this.scl);
    pop();
  }
  
  drawTail() {
    fill(this.finColor);
    let b = this.tail;
    let x = b.pos.x;

    let y = b.pos.y;

    bezier(
      x,
      y,
      x + cos(b.dir) * 50 * this.scl,
      y + sin(b.dir) * 50 * this.scl,
      x + cos(b.dir - this.curv() / 2) * 50 * this.scl,
      y + sin(b.dir - this.curv() / 2) * 50 * this.scl,
      x,
      y
    );
    //ellipse(x,y,80)
    //arc(x,y,80,80,b.dir-0.2,b.dir+0.2)
  }

  drawBack() {
    let b = this.bodies;

    fill(this.finColor);
    beginShape();
    vertex(b[2].pos.x, b[2].pos.y);
    bezierVertex(
      b[2].pos.x,
      b[2].pos.y,
      b[3].pos.x,
      b[3].pos.y,
      b[5].pos.x,
      b[5].pos.y,
      b[8].pos.x,
      b[8].pos.y,
      0
    );
    bezierVertex(
      b[6].pos.x + cos(b[6].dir + PI / 2) * this.curv() * 8 * this.scl,
      b[6].pos.y + sin(b[6].dir + PI / 2) * this.curv() * 8 * this.scl,
      b[2].pos.x + cos(b[2].dir + PI / 2) * this.curv() * 8 * this.scl,
      b[2].pos.y + sin(b[2].dir + PI / 2) * this.curv() * 8 * this.scl,
      b[2].pos.x,
      b[2].pos.y
    );
    endShape();
  }

  curv() {
    let dif = 0;
    for (let i = 1; i < this.links.length; i++) {
      dif += p5.Vector.angleBetween(
        this.links[i].offset,
        this.links[i - 1].offset
      );
    }
    return dif;
  }

  Align() {
    let v = createVector(0, 0);
    let c = 0;
    for (let i = 0; i < fish.length; i++) {
      let f = fish[i];
      if (this.dis(f) > 2 && this.dis(f) < this.range) {
        v.add(f.vel);
        c++;
      }
    }
    if (c) {
      v.mult(1 / c);
      v.limit(this.all);
      this.acc.add(v);
    }
  }

  Cohesion() {
    let v = createVector(0, 0);
    let c = 0;
    for (let i = 0; i < fish.length; i++) {
      let f = fish[i];
      if (this.dis(f) > 2 && this.dis(f) < this.range) {
        v.add(p5.Vector.sub(f.pos, this.pos));
        c++;
      }
    }
    if (c) {
      v.mult(1 / c);
      v.limit(this.col);
      this.acc.add(v);
    }
  }

  Separation() {
    let v = createVector(0, 0);
    let c = 0;
    for (let i = 0; i < fish.length; i++) {
      let f = fish[i];
      if (this.dis(f) > 2 && this.dis(f) < this.range * 0.7) {
        let n = p5.Vector.sub(f.pos, this.pos);
        n.mult(-1 / this.dis(f));
        v.add(n);
        c++;
      }
    }
    if (c) {
      v.mult(1 / c);
      v.limit(this.sep);
      this.acc.add(v);
    }
  }

  dis(other) {
    return dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
  }
}
