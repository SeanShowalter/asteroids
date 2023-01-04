class Asteroid {
    constructor(segments, radius, noise) {
        this.x = ctx.canvas.width * Math.random();
        this.y = ctx.canvas.height * Math.random();
        this.angle = 0;
        this.xSpeed = ctx.canvas.width * (Math.random() - 0.5);
        this.ySpeed = ctx.canvas.height * (Math.random() - 0.5);
        this.rotationSpeed = 2 * Math.PI * (Math.random() - 0.5);
        this.radius = radius;
        this.noise = noise;
        this.shape = [];
        for (let i = 0; i < segments; i++) {
            this.shape.push(Math.random() - 0.5);
        }
    }
}

Asteroid.prototype.update = function(elapsed) {
    if (this.x - this.radius + elapsed * this.xSpeed > ctx.canvas.width) {
        this.x = -this.radius;
    }

    if (this.x + this.radius + elapsed * this.xSpeed < 0) {
        this.x = ctx.canvas.width + this.radius;
    }

    if (this.y - this.radius + elapsed * this.ySpeed > ctx.canvas.height) {
        this.y = -this.radius;
    }

    if (this.y + this.radius + elapsed * this.ySpeed < 0) {
        this.y = ctx.canvas.height + this.radius;
    }

    this.x += elapsed * this.xSpeed;
    this.y += elapsed * this.ySpeed;
    this.angle = (this.angle + this.rotationSpeed * elapsed) % (2 * Math.PI);
}

Asteroid.prototype.draw = function(ctx, guide) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    draw_asteroid(ctx, this.radius, this.shape, {guide: guide, noise: this.noise});
    ctx.restore();
}