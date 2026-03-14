const bg    = document.getElementById("backgroundPhysics");
const bgCtx = bg.getContext("2d");

function resize() {
  bg.width  = window.innerWidth;
  bg.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

let stars = [];
for (let i = 0; i < 180; i++) {
  stars.push({
    x:     Math.random() * bg.width,
    y:     Math.random() * bg.height,
    size:  Math.random() * 2,
    speed: Math.random() * 0.3
  });
}

function drawBackground() {
  bgCtx.clearRect(0, 0, bg.width, bg.height);

  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > bg.height) {
      s.y = 0;
      s.x = Math.random() * bg.width;
    }
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    bgCtx.fillStyle = "rgba(200,220,255,0.7)";
    bgCtx.fill();
  });

  requestAnimationFrame(drawBackground);
}

drawBackground();
