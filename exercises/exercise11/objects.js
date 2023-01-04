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
  // console.log("xSpeed=" + this.xSpeed, "ySpeed=" + this.ySpeed, "elapsed=" + elapsed);
  // if (this.xSpeed <= this.maxSpeed) {
  //   this.xSpeed += (elapsed * (Math.cos(angle) * force)) / this.mass;
  // } else {
  //   this.xSpeed += ((Math.cos(angle) * force)) / this.mass;
  // }

  // if (this.ySpeed <= this.maxSpeed) {
  //   this.ySpeed += (elapsed * (Math.sin(angle) * force)) / this.mass;
  // } else {
  //   this.ySpeed += ((Math.sin(angle) * force)) / this.mass;
  // }
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
  constructor(x, y, power, guide, weaponPower) {
    super(x, y, 10);
    this.mass = 10;
    this.radius = 10;
    this.angle = 1.5 * Math.PI;
    this.loaded = false;
    this.weaponReloadTime = 0.25; // seconds
    this.timeUntilReloaded = this.weaponReloadTime;
    this.thrusterPower = power;
    this.steeringPower = power / 20;
    this.rightThruster = false;
    this.leftThruster = false;
    this.thrusterOn = false;
    this.weaponPower = 200;
    this.options = {
      guide: guide || false,
      thruster: this.thrusterOn,
      // weaponPower: weaponPower || 200
      // maxSpeed: 1
    };
  }
}

Ship.prototype.draw = function (ctx, guide) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  // ctx.strokeStyle = "white";
  // ctx.lineWidth = 2;
  // ctx.fillStyle = "black";
  // this.options.guide = guide;
  this.options.thruster = this.thrusterOn;
  draw_ship(ctx, this.radius, this.options);
  ctx.restore();
};

Ship.prototype.update = function (elapsedTime) {
  this.push(this.angle, this.thrusterOn * this.thrusterPower, elapsedTime);
  this.twist(
    (this.rightThruster - this.leftThruster) * this.steeringPower,
    elapsedTime
  );

  // reload as necessary
  this.loaded = this.timeUntilReloaded === 0;
  if (!this.loaded) {
    this.timeUntilReloaded -= Math.min(elapsedTime, this.timeUntilReloaded);
  }
  Mass.prototype.update.apply(this, arguments);
};

Ship.prototype.projectile = function(elapsedTime) {
  let mass = 0.025;
  let lifetime = 1;
  let x = this.x + Math.cos(this.angle) * this.radius;
  let y = this.y + Math.sin(this.angle) * this.radius;

  // xSpeed, ySpeed, and rotationSpeed are inherited from the ship
  let myProjectile = new Projectile(mass, lifetime, x, y, this.xSpeed, this.ySpeed, this.rotationSpeed);

  // applies Newton's 3rd law to projectile and ship
  // myProjectile.push(this.angle, this.options.weaponPower, elapsedTime);
  myProjectile.push(this.angle, this.weaponPower, elapsedTime);
  this.timeUntilReloaded = this.weaponReloadTime;
  return myProjectile;
}

class Projectile extends Mass {
  constructor(mass, lifetime, x, y, xSpeed, ySpeed, rotationSpeed) {
    var density = 0.001; // low density means we can see very light projectiles
    let radius = Math.sqrt(mass / density / Math.PI);
    let angle = 0;
    super(x, y, mass, radius, angle, xSpeed, ySpeed, rotationSpeed);
    this.lifetime = lifetime;
    this.life = 1.0;
  }
}

Projectile.prototype.update = function(elapsedTime, ctx) {
  this.life -= (elapsedTime / this.lifetime);
  Mass.prototype.update.apply(this, arguments);
}

Projectile.prototype.draw = function(ctx, guide) {
  ctx.save();
  // ctx.translate(this.x, this.y);
  // ctx.rotate(this.angle);
  draw_projectile(ctx, this.x, this.y, this.radius, this.life, guide);  
  ctx.restore();
}
