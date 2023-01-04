class PacMan {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.angle = 0;
    this.xSpeed = speed;
    this.ySpeed = 0;
    this.time = 0;
    this.mouth = 0;
  }
}

PacMan.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  draw_pacman(ctx, this.radius, this.mouth);
  ctx.restore();
};

PacMan.prototype.turn = function (direction) {
  if (this.ySpeed) {
    this.xSpeed = -direction * this.ySpeed;
    this.ySpeed = 0;
    this.angle = this.xSpeed > 0 ? 0 : Math.PI;
  } else {
    this.ySpeed = direction * this.xSpeed;
    this.xSpeed = 0;
    if (this.ySpeed > 0) {
      this.angle = 0.5 * Math.PI;
    } else {
      this.angle = 1.5 * Math.PI;
    }
  }
};

PacMan.prototype.turn_left = function () {
  this.turn(-1);
};

PacMan.prototype.turn_right = function () {
  this.turn(1);
};

PacMan.prototype.update = function (elapsed, width, height) {
  // an average of once per 100 frames
  // if (Math.random() <= 0.01) {
  //   if (Math.random() < 0.05) {
  //     this.turn_left();
  //   } else {
  //     this.turn_right();
  //   }
  // }

  // if (this.x - this.radius + elapsed * this.xSpeed > width) {
    if (this.x - this.radius + this.xSpeed > width) {
    this.x = -this.radius;
  }

  // if (this.x + this.radius + elapsed * this.xSpeed < 0) {
    if (this.x + this.radius + this.xSpeed < 0) {
    this.x = width + this.radius;
  }

  // if (this.y - this.radius + elapsed * this.ySpeed > height) {
  if (this.y - this.radius + this.ySpeed > height) {
    this.y = -this.radius;
  }

  // if (this.y + this.radius + elapsed * this.ySpeed < 0) {
    if (this.y + this.radius + this.ySpeed < 0) {
    this.y = height + this.radius;
  }
  // this.x += this.xSpeed * elapsed;
  // this.y += this.ySpeed * elapsed;
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  this.time += elapsed;
  this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
};

PacMan.prototype.move_right = function() {
  this.xSpeed = this.speed;
  this.ySpeed = 0;
  this.angle = 0;
}

PacMan.prototype.move_down = function() {
  this.xSpeed = 0;
  this.ySpeed = this.speed;
  this.angle = 0.5 * Math.PI;
}

PacMan.prototype.move_left = function() {
  this.xSpeed = -this.speed;
  this.ySpeed = 0;
  this.angle = Math.PI;
}

PacMan.prototype.move_up = function() {
  this.xSpeed = 0;
  this.ySpeed = -this.speed;
  this.angle = 1.5 * Math.PI;
}
class Ghost {
  constructor(x, y, radius, speed, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.color = color;
  }
}

Ghost.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  draw_ghost(ctx, this.radius, { fill: this.color });
  ctx.restore();
};

Ghost.prototype.update = function (target, elapsed) {
  var angle = Math.atan2(target.y - this.y, target.x - this.x);
  var x_speed = Math.cos(angle) * this.speed;
  var y_speed = Math.sin(angle) * this.speed;
  this.x += x_speed * elapsed;
  this.y += y_speed * elapsed;
};
