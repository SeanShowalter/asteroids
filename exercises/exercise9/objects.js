class Mass {
  constructor(x, y, mass, radius, angle, xSpeed, ySpeed, rotationSpeed) {
    this.x = x;
    this.y = y;
    this.mass = mass || 1;
    this.radius = radius || 50;
    this.angle = angle || 0;
    this.xSpeed = xSpeed || 0;
    this.ySpeed = ySpeed || 0;
    this.rotationSpeed = rotationSpeed || 0;
  }
}

Mass.prototype.update = function (elapsed, ctx) {
  this.x += this.xSpeed * elapsed;
  this.y += this.ySpeed * elapsed;
  this.angle += this.rotationSpeed * elapsed;
  this.angle %= 2 * Math.PI;

  // sets x to beginning of left side of canvas if the object moves past the right side of canvas
  if (this.x - this.radius > ctx.canvas.width) {
    this.x = -this.radius;
  }
  // sets x to beggining of right side of canvas if object moves off the left side of canvas
  if (this.x + this.radius < 0) {
    this.x = ctx.canvas.width + this.radius;
  }

  // sets y to top of canvas
  if (this.y - this.radius > ctx.canvas.height) {
    this.y = -this.radius;
  }
  // sets y to bottom of canvass
  if (this.y + this.radius < 0) {
    this.y = ctx.canvas.height + this.radius;
  }
};

Mass.prototype.push = function (angle, force, elapsed) {
  this.xSpeed += (elapsed * (Math.cos(angle) * force)) / this.mass;
  this.ySpeed += (elapsed * (Math.sin(angle) * force)) / this.mass;
};

Mass.prototype.twist = function (force, elapsed) {
  // console.log("elapsed=" + elapsed, "force=" + force, "mass=" + this.mass);
  this.rotationSpeed += (elapsed * force) / this.mass;
  // console.log("rotationSpeed=" + this.rotationSpeed);
};

Mass.prototype.speed = function () {
  return Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2));
};

Mass.prototype.movementAngle = function () {
  return Math.atan2(this.ySpeed, this.xSpeed);
};


class Asteroid extends Mass {
  constructor(x, y, mass, xSpeed, ySpeed, rotationSpeed) {
    // console.log("Created new asteroid", "x=" + x, "y=" + y);
    var density = 1; // kg per sqaure pixel
    var radius = Math.sqrt(mass / density / Math.PI);
    let angle = 0;
    super(x, y, mass, radius, angle, xSpeed, ySpeed, rotationSpeed);
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = Math.ceil(this.circumference / 15);
    this.segments = Math.min(25, Math.max(5, this.segments));
    this.noise = 0.2;
    this.shape = [];
    for (var i = 0; i < this.segments; i++) {
      this.shape.push(2 * (Math.random() - 0.5));
    }
  }
}

Asteroid.prototype.draw = function (ctx, guide) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  draw_asteroid(ctx, this.radius, this.shape, {
    guide: guide,
    noise: this.noise,
  });
  ctx.restore();
};

class Ship extends Mass {
  constructor(x, y) {
    super(x, y);
    this.radius = 20;
  }
}

Ship.prototype.draw = function (ctx, guide) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.fillStyle = "black";
  draw_ship(ctx, this.radius, { guide: guide });
  ctx.restore();
};

/* PacMan */
// class PacMan {
//   constructor(x, y, radius, speed) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.speed = speed;
//     this.angle = 0;
//     this.xSpeed = speed;
//     this.ySpeed = 0;
//     this.time = 0;
//     this.mouth = 0;
//   }
// }

// PacMan.prototype.draw = function (ctx) {
//   ctx.save();
//   ctx.translate(this.x, this.y);
//   ctx.rotate(this.angle);
//   draw_pacman(ctx, this.x, this.y, this.radius, this.mouth);
//   ctx.restore();
// };

// PacMan.prototype.turn = function (direction) {
//   if (this.ySpeed) {
//     // if we are travelling vertically
//     // set the horizontal speed and apply the direction
//     this.xSpeed = -direction * this.ySpeed;
//     // clear the vertical speed and rotate
//     this.ySpeed = 0;
//     this.angle = this.xSpeed > 0 ? 0 : Math.PI;
//   } else {
//     // if we are travelling horizontally
//     // set the vertical speed and apply the direction
//     this.ySpeed = direction * this.xSpeed;
//     // clear the horizontal speed and rotate
//     this.xSpeed = 0;
//     this.angle = this.ySpeed > 0 ? 0.5 * Math.PI : 1.5 * Math.PI;
//   }
// };

// PacMan.prototype.turn_left = function () {
//   this.turn(-1);
// };

// PacMan.prototype.turn_right = function () {
//   this.turn(1);
// };

// PacMan.prototype.update = function (elapsed, width, height) {
//   // an average of once per 100 frames
//   if (Math.random() <= 0.01) {
//     if (Math.random() < 0.5) {
//       this.turn_left();
//     } else {
//       this.turn_right();
//     }
//   }

//   if (this.x - this.radius + elapsed * this.xSpeed > width) {
//     this.x = -this.radius;
//   }

//   if (this.x + this.radius + elapsed * this.xSpeed < 0) {
//     this.x = width + this.radius;
//   }

//   if (this.y - this.radius + elapsed * this.ySpeed > height) {
//     this.y = -this.radius;
//   }

//   if (this.y + this.radius + elapsed * this.ySpeed < 0) {
//     this.y = height + this.radius;
//   }
//   this.x += this.xSpeed * elapsed;
//   this.y += this.ySpeed * elapsed;
//   this.time += elapsed;
//   this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
// };

// class Ghost {
//   constructor(x, y, radius, speed, color) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.speed = speed;
//     this.color = color;
//   }
// }

// Ghost.prototype.draw = function (ctx) {
//   ctx.save();
//   ctx.translate(this.x, this.y);
//   draw_ghost(ctx, this.radius, { fill: this.color });
//   ctx.restore();
// };

// Ghost.prototype.update = function (target, elapsed) {
//   var angle = Math.atan2(target.y - this.y, target.x - this.x);
//   var x_speed = Math.cos(angle) * this.speed;
//   var y_speed = Math.sin(angle) * this.speed;
//   this.x += x_speed * elapsed;
//   this.y += y_speed * elapsed;
// };
