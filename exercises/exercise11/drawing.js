// JavaScript Document
function draw_grid(ctx, minor, major, stroke, fill) {
  minor = minor || 10;
  major = major || minor * 5;
  stroke = stroke || "#00FF00";
  fill = fill || "#009900";
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  let width = ctx.canvas.width;
  let height = ctx.canvas.height;

  // Creates vertical lines
  for (var x = 0; x < width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.lineWidth = x % major == 0 ? 0.5 : 0.25;
    ctx.stroke();
    if (x % major == 0) {
      ctx.fillText(x, x, 10);
    }
  }

  // Creates horizontal lines
  for (var y = 0; y < height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = y % major == 0 ? 0.5 : 0.25;
    ctx.stroke();
    if (y % major == 0) {
      ctx.fillText(y, 0, y + 10);
    }
  }

  ctx.restore();
}

function draw_pacman(context, x, y, r, mouthOpen) {
  // draws a pacman
  //
  // Parameters:
  // context: the canvas context where the pacman is drawn
  // x: x-coordinate
  // y: y-coordrinate
  // r: radius
  // mouthOpen: a value of 1 or 0

  context.beginPath();
  if (mouthOpen > 0.5) {
    context.arc(x, y, r, 0.2 * Math.PI, 1.9 * Math.PI);
  } else {
    context.arc(x, y, r, 0, 2 * Math.PI);
  }

  context.lineTo(x, y);
  context.fillStyle = "yellow";
  context.fill();
  context.closePath();
  context.strokeStyle = "#000000";
  context.stroke();
}

function draw_ghost(ctx, radius, options) {
  options = options || {};
  var feet = options.feet || 4;
  var head_radius = radius * 0.8;
  var foot_radius = head_radius / feet;
  ctx.save();
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "red";
  ctx.lineWidth = options.lineWidth || radius * 0.05;
  ctx.beginPath();
  for (foot = 0; foot < feet; foot++) {
    ctx.arc(
      2 * foot_radius * (feet - foot) - head_radius - foot_radius,
      radius - foot_radius,
      foot_radius,
      0,
      Math.PI
    );
  }

  ctx.lineTo(-head_radius, radius - foot_radius);
  ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function draw_ship(ctx, radius, options) {
  // options = options || {};
  let angle = (options.angle || 0.5 * Math.PI) / 2;
  let curve1 = options.curve1 || 0.5;
  let curve2 = options.curve2 || 0.75;
  ctx.save();

  // optionally draw a guide showing the collision radius
  if (options.guide) {
    // console.log("options guide: " + options.guide);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  // draw thrusters
  if (options.thruster) {
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(Math.PI + angle * 0.8) * radius / 2,
      Math.sin(Math.PI + angle * 0.8) * radius /2
    )
    ctx.quadraticCurveTo(
      -radius * 2, 
      0,
      Math.cos(Math.PI - angle * 0.8) * radius / 2,
      Math.sin(Math.PI - angle * 0.8) * radius / 2
      );
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // set some default values
  ctx.lineWidth = options.lineWidth || 2;
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";

  // draw the ship in three lines
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.quadraticCurveTo(
    Math.cos(angle) * radius * curve2,
    Math.sin(angle) * radius * curve2,
    Math.cos(Math.PI - angle) * radius,
    Math.sin(Math.PI - angle) * radius
  );

  ctx.quadraticCurveTo(
    -radius * curve1,
    0,
    Math.cos(Math.PI + angle) * radius,
    Math.sin(Math.PI + angle) * radius
  );

  ctx.quadraticCurveTo(
    Math.cos(-angle) * radius * curve2,
    Math.sin(-angle) * radius * curve2,
    radius,
    0
  );

  ctx.fill();
  ctx.stroke();

  if (options.guide) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(-angle) * radius, Math.sin(-angle) * radius);
    ctx.lineTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.moveTo(-radius, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      Math.cos(angle) * radius * curve2,
      Math.sin(angle) * radius * curve2,
      radius / 40,
      0,
      2 * Math.PI
    );
  }
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    Math.cos(-angle) * radius * curve2,
    Math.sin(-angle) * radius * curve2,
    radius / 40,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(radius * curve1 - radius, 0, radius / 50, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function draw_asteroid(ctx, radius, shape, options) {
  options = options || {};
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";
  ctx.save();
  ctx.beginPath();
  // draw each asteroid
  for (let i = 0; i < shape.length; i++) {
    ctx.rotate((2 * Math.PI) / shape.length);
    ctx.lineTo(radius + radius * options.noise * shape[i], 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  if (options.guide) {
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 0.2;
    ctx.arc(0, 0, radius + radius * options.noise, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius - radius * options.noise, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

function draw_projectile(ctx, x, y, radius, lifetime) {
  let startAngle = 0;
  let endAngle = 2 * Math.PI;
  ctx.fillStyle = "rgb(100%, 100%, " + (100 * lifetime) + "%)";
  ctx.save();
  ctx.beginPath();

  // draw circle
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.fill();
  ctx.restore();
  
}