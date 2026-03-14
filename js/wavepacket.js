const waveCanvas = document.getElementById("waveCanvas");
const waveCtx    = waveCanvas.getContext("2d");
const probCanvas = document.getElementById("probCanvas");
const probCtx    = probCanvas.getContext("2d");
const momCanvas  = document.getElementById("momCanvas");
const momCtx     = momCanvas.getContext("2d");

waveCanvas.width = probCanvas.width = momCanvas.width  = 720;
waveCanvas.height= probCanvas.height= 360;
momCanvas.height = 220;

const W  = 720;
const WH = 360, MH = 220;
const centerY    = WH / 2;
const probCenter = WH * 0.8;
const momCenter  = MH * 0.8;

let time = 0;

const sigmaSlider = document.getElementById("sigmaSlider");
const kSlider     = document.getElementById("kSlider");
const speedSlider = document.getElementById("speedSlider");
const resetBtn    = document.getElementById("resetPacket");

const sigmaVal = document.getElementById("sigmaVal");
const kVal     = document.getElementById("kVal");
const speedVal = document.getElementById("speedVal");

const roDx      = document.getElementById("ro-dx");
const roDp      = document.getElementById("ro-dp");
const roProduct = document.getElementById("ro-product");
const roCheck   = document.getElementById("ro-check");

const DEFAULTS = { sigma: 80, k: 5, speed: 4 };


function hookSlider(slider, label) {
  slider.addEventListener("input", () => {
    label.textContent = slider.value;
    updateUncertainty();
  });
}

hookSlider(sigmaSlider, sigmaVal);
hookSlider(kSlider,     kVal);
hookSlider(speedSlider, speedVal);


resetBtn.addEventListener("click", () => {
  
  time = 0;

  sigmaSlider.value = DEFAULTS.sigma;
  kSlider.value     = DEFAULTS.k;
  speedSlider.value = DEFAULTS.speed;

  sigmaVal.textContent = DEFAULTS.sigma;
  kVal.textContent     = DEFAULTS.k;
  speedVal.textContent = DEFAULTS.speed;

  updateUncertainty();
});


function updateUncertainty() {
  const sigma   = parseFloat(sigmaSlider.value);
  const dx      = (sigma / 80).toFixed(2);
  const dp      = (1 / (sigma / 80)).toFixed(2);
  const product = (parseFloat(dx) * parseFloat(dp)).toFixed(2);
  const ok      = parseFloat(product) >= 0.5;

  roDx.textContent      = `${dx} ℏ`;
  roDp.textContent      = `${dp} ℏ`;
  roProduct.textContent = `${product} ℏ²`;
  roCheck.innerHTML     = ok
    ? `<span style="color:#34d399">✓ satisfied</span>`
    : `<span style="color:#ef4444">✗ violated</span>`;
}

updateUncertainty();


function drawGrid(ctx, w, h) {
  for (let x = 0; x < w; x += 25) {
    ctx.strokeStyle = "rgba(120,150,255,0.07)";
    ctx.beginPath(); 
    ctx.moveTo(x, 0); 
    ctx.lineTo(x, h); 
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 25) {
    ctx.strokeStyle = "rgba(120,150,255,0.07)";
    ctx.beginPath(); 
    ctx.moveTo(0, y); 
    ctx.lineTo(w, y); 
    ctx.stroke();
  }
}

function drawAxis(ctx, w, y) {
  ctx.strokeStyle = "rgba(220,220,255,0.35)";
  ctx.lineWidth   = 1.5;
  ctx.beginPath(); 
  ctx.moveTo(0, y); 
  ctx.lineTo(w, y); 
  ctx.stroke();
}


function drawWavePacket() {
  const sigma0   = parseFloat(sigmaSlider.value);
  const k        = parseFloat(kSlider.value);
  const speed    = parseFloat(speedSlider.value);

  const dispRate = 0.8;
  const sigmaT   = sigma0 * Math.sqrt(1 + Math.pow(time * dispRate / (sigma0 * sigma0), 2));

  const envPts = [];
  for (let x = -350; x < 350; x++) {
    const env = Math.exp(-(x * x) / (2 * sigmaT * sigmaT)) * 100;
    envPts.push({ x: x + W / 2, env });
  }

  waveCtx.beginPath();
  waveCtx.moveTo(envPts[0].x, centerY);
  envPts.forEach(p => waveCtx.lineTo(p.x, centerY - p.env));
  waveCtx.lineTo(envPts[envPts.length - 1].x, centerY);
  waveCtx.closePath();
  waveCtx.fillStyle = "rgba(159,179,255,0.10)";
  waveCtx.fill();

  waveCtx.beginPath();
  waveCtx.moveTo(envPts[0].x, centerY);
  envPts.forEach(p => waveCtx.lineTo(p.x, centerY + p.env));
  waveCtx.lineTo(envPts[envPts.length - 1].x, centerY);
  waveCtx.closePath();
  waveCtx.fillStyle = "rgba(159,179,255,0.10)";
  waveCtx.fill();

  waveCtx.beginPath();
  let first = true;
  for (let x = -350; x < 350; x++) {
    const envelope = Math.exp(-(x * x) / (2 * sigmaT * sigmaT));
    const wave     = Math.cos(k * 0.05 * x - time * 0.1 * speed);
    const psi      = envelope * wave;
    const px = x + W / 2;
    const py = centerY - psi * 100;
    first ? waveCtx.moveTo(px, py) : waveCtx.lineTo(px, py);
    first = false;
  }
  waveCtx.strokeStyle = "#9fb3ff";
  waveCtx.lineWidth   = 2;
  waveCtx.shadowBlur  = 12;
  waveCtx.shadowColor = "#8fa4ff";
  waveCtx.stroke();
  waveCtx.shadowBlur  = 0;

  waveCtx.fillStyle = "rgba(160,180,255,0.6)";
  waveCtx.font      = "13px sans-serif";
  waveCtx.fillText("ψ(x,t)", 10, 20);
  waveCtx.fillText(`σ(t) = ${sigmaT.toFixed(0)}`, 10, 38);
}


function drawProbability() {
  const sigma0   = parseFloat(sigmaSlider.value);
  const k        = parseFloat(kSlider.value);
  const speed    = parseFloat(speedSlider.value);

  const dispRate = 0.8;
  const sigmaT   = sigma0 * Math.sqrt(1 + Math.pow(time * dispRate / (sigma0 * sigma0), 2));

  const pts = [];
  for (let x = -350; x < 350; x++) {
    const envelope = Math.exp(-(x * x) / (2 * sigmaT * sigmaT));
    const wave     = Math.cos(k * 0.05 * x - time * 0.1 * speed);
    const prob     = (envelope * wave) * (envelope * wave);
    pts.push({ x: x + W / 2, y: probCenter - prob * 180 });
  }

  probCtx.beginPath();
  probCtx.moveTo(pts[0].x, probCenter);
  pts.forEach(p => probCtx.lineTo(p.x, p.y));
  probCtx.lineTo(pts[pts.length - 1].x, probCenter);
  probCtx.closePath();
  probCtx.fillStyle = "rgba(52,211,153,0.18)";
  probCtx.fill();

  probCtx.beginPath();
  pts.forEach((p, i) => i === 0 ? probCtx.moveTo(p.x, p.y) : probCtx.lineTo(p.x, p.y));
  probCtx.strokeStyle = "#34d399";
  probCtx.lineWidth   = 2;
  probCtx.shadowBlur  = 10;
  probCtx.shadowColor = "#34d399";
  probCtx.stroke();
  probCtx.shadowBlur  = 0;

  probCtx.fillStyle = "rgba(160,180,255,0.6)";
  probCtx.font      = "13px sans-serif";
  probCtx.fillText("|ψ(x,t)|²", 10, 20);
}


function drawMomentumSpace() {
  const sigma = parseFloat(sigmaSlider.value);
  const k0    = parseFloat(kSlider.value);

  const kWidth = 100 / sigma;

  momCtx.clearRect(0, 0, W, MH);
  drawGrid(momCtx, W, MH);
  drawAxis(momCtx, W, momCenter);

  const pts = [];
  for (let ki = -350; ki < 350; ki++) {
    const kc   = (ki / 35) - k0;
    const prob = Math.exp(-(kc * kc) / (2 * kWidth * kWidth));
    pts.push({ x: ki + W / 2, y: momCenter - prob * 120 });
  }

  momCtx.beginPath();
  momCtx.moveTo(pts[0].x, momCenter);
  pts.forEach(p => momCtx.lineTo(p.x, p.y));
  momCtx.lineTo(pts[pts.length - 1].x, momCenter);
  momCtx.closePath();
  momCtx.fillStyle = "rgba(251,191,36,0.18)";
  momCtx.fill();

  momCtx.beginPath();
  pts.forEach((p, i) => i === 0 ? momCtx.moveTo(p.x, p.y) : momCtx.lineTo(p.x, p.y));
  momCtx.strokeStyle = "#fbbf24";
  momCtx.lineWidth   = 2;
  momCtx.shadowBlur  = 10;
  momCtx.shadowColor = "#fbbf24";
  momCtx.stroke();
  momCtx.shadowBlur  = 0;

  momCtx.fillStyle = "rgba(160,180,255,0.6)";
  momCtx.font      = "13px sans-serif";
  momCtx.fillText("|ψ̃(k)|²  — momentum space", 10, 20);
  momCtx.fillText(`Width ∝ 1/σ = ${(1 / sigma * 80).toFixed(2)}`, 10, 38);
}


function animate() {
  waveCtx.clearRect(0, 0, W, WH);
  probCtx.clearRect(0, 0, W, WH);

  drawGrid(waveCtx, W, WH); 
  drawAxis(waveCtx, W, centerY);
  drawGrid(probCtx, W, WH); 
  drawAxis(probCtx, W, probCenter);

  drawWavePacket();
  drawProbability();
  drawMomentumSpace();

  time += 0.5;
  requestAnimationFrame(animate);
}

animate();
