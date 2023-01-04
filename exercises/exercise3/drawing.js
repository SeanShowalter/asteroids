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
    ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
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
    ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
    ctx.stroke();
    if (y % major == 0) {
      ctx.fillText(y, 0, y + 10);
    }
  }

  ctx.restore();
}


function draw_pacman(context, vertex, radius, mouthOpen) {
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
        context.arc(vertex.x, vertex.y, radius, 0.2 * Math.PI, 1.9 * Math.PI);
    } else {
        context.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI);
   }
    
    context.lineTo(vertex.x,vertex.y);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
    context.strokeStyle = "#000000";
    context.stroke();
    
}