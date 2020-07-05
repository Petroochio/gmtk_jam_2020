let canvas, ctx;
let prevTime, currentTime, dt;
prevTime = Date.now();

function update() {
  currentTime = Date.now();
  dt = currentTime - prevTime;
  prevTime = currentTime;

  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillRect(canvas.width / 2 + Math.sin(currentTime / 500) * 30, canvas.height / 2 + Math.cos(currentTime / 500) * 30, 10, 10)

  requestAnimationFrame(update);
}


window.onload = () => {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  requestAnimationFrame(update);
}