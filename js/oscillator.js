const waveCanvas   = document.getElementById("waveCanvas");
const waveCtx      = waveCanvas.getContext("2d");
const probCanvas   = document.getElementById("probCanvas");
const probCtx      = probCanvas.getContext("2d");
const energyCanvas = document.getElementById("energyCanvas");
const energyCtx    = energyCanvas.getContext("2d");

const nSlider    = document.getElementById("nSlider");
const scaleSlider= document.getElementById("scaleSlider");
const measureBtn = document.getElementById("measureBtn");
const pauseBtn   = document.getElementById("pauseBtn");

const nValueLabel= document.getElementById("nValue");
const roN        = document.getElementById("ro-n");
const roE        = document.getElementById("ro-e");
const roNodes    = document.getElementById("ro-nodes");
const roColor    = document.getElementById("ro-color");

const W = 720, H = 360;
waveCanvas.width = probCanvas.width = energyCanvas.width = W;
waveCanvas.height= probCanvas.height= energyCanvas.height= H;

const cx = W/2, cy = H/2;

const LEVEL_COLORS = [
  "#00eeff", 
  "#a78bfa", 
  "#34d399", 
  "#fbbf24", 
  "#f472b6", 
  "#60a5fa"  
];
const LEVEL_NAMES  = ["Cyan","Violet","Emerald","Amber","Pink","Blue"];

const subscripts = ["₀","₁","₂","₃","₄","₅"];

let paused = false;
let animId = null;
let particleLevel = 0;
let particleY     = cy;
let measurementX  = null;


nSlider.addEventListener("input", () => {
  particleLevel = parseInt(nSlider.value);
  nValueLabel.textContent = particleLevel;
  updateReadout();
});

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶ Resume" : "⏸ Pause";
  if(!paused) animate();
});

measureBtn.addEventListener("click", () => {
  measurementX = cx + (Math.random()-0.5)*420;
  setTimeout(()=>{ measurementX = null; }, 1400);
});

function updateReadout(){
  const n = particleLevel;
  const color = LEVEL_COLORS[n];
  roN.textContent   = `n = ${n}`;
  roE.textContent   = `E${subscripts[n]} = ${(n+0.5).toFixed(1)} ℏω`;
  roNodes.textContent = `${n}`;
  roColor.innerHTML = `<span style="color:${color}">■</span> ${LEVEL_NAMES[n]}`;
}
updateReadout();


function drawGrid(ctx){
  for(let x=0;x<W;x+=20){
    ctx.strokeStyle="rgba(120,150,255,0.05)";
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,H);
    ctx.stroke();
  }

  for(let y=0;y<H;y+=20){
    ctx.strokeStyle="rgba(120,150,255,0.05)";
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(W,y);
    ctx.stroke();
  }

  ctx.strokeStyle="rgba(220,220,255,0.4)";ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(0,cy);
  ctx.lineTo(W,cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx,0);
  ctx.lineTo(cx,H);
  ctx.stroke();
}


function drawEnergy(){
  energyCtx.clearRect(0,0,W,H);
  drawGrid(energyCtx);

  energyCtx.beginPath();
  for(let x=-300;x<300;x++){
    energyCtx.lineTo(cx+x, cy+80-0.003*x*x);
  }
  energyCtx.strokeStyle="#8fa4ff";
  energyCtx.lineWidth=2;
  energyCtx.stroke();

  for(let n=0;n<6;n++){
    const y      = cy + 60 - n*30;
    const active = (n===particleLevel);
    const col    = LEVEL_COLORS[n];

    const xTurn = Math.sqrt((n+0.5)*0.1/0.003) * 1.8;

    energyCtx.setLineDash([4,4]);
    energyCtx.strokeStyle = active ? `${col}88` : "rgba(180,180,255,0.18)";
    energyCtx.lineWidth=1;
    for(const sign of [-1,1]){
      const tx = cx + sign*xTurn;
      if(tx>20 && tx<W-20){
        energyCtx.beginPath();
        energyCtx.moveTo(tx, y-8);
        energyCtx.lineTo(tx, y+8);
        energyCtx.stroke();
      }
    }

    energyCtx.setLineDash([]);

    energyCtx.beginPath();
    energyCtx.moveTo(cx-200, y);
    energyCtx.lineTo(cx+200, y);
    energyCtx.strokeStyle = active ? col : "rgba(200,210,255,0.5)";
    energyCtx.lineWidth = active ? 2.5 : 1.5;
    energyCtx.shadowBlur  = active ? 16 : 0;
    energyCtx.shadowColor = col;
    energyCtx.stroke();
    energyCtx.shadowBlur  = 0;

    energyCtx.beginPath();
    for(let x=-200;x<200;x++){
      energyCtx.lineTo(cx+x, y - Math.sin((n+1)*x*0.03)*10);
    }

    energyCtx.strokeStyle = col+"66";
    energyCtx.lineWidth   = 1;
    energyCtx.stroke();

    energyCtx.fillStyle = active ? col : "rgba(160,180,255,0.6)";
    energyCtx.font = (active?"bold ":"")+"12px sans-serif";
    energyCtx.fillText(`n=${n}  E${subscripts[n]}=${(n+0.5).toFixed(1)}ℏω`, cx+208, y+4);
  }

  const targetY = cy + 60 - particleLevel*30;
  particleY += (targetY - particleY)*0.15;

  const col = LEVEL_COLORS[particleLevel];
  for(let i=0;i<18;i++){
    const a=Math.random()*Math.PI*2, r=Math.random()*12;
    energyCtx.beginPath();
    energyCtx.arc(cx+Math.cos(a)*r, particleY+Math.sin(a)*r, 2, 0, Math.PI*2);
    energyCtx.fillStyle=col+"44";
    energyCtx.fill();
  }

  energyCtx.beginPath();
  energyCtx.arc(cx, particleY, 6, 0, Math.PI*2);
  energyCtx.fillStyle = col;
  energyCtx.shadowBlur = 14;
  energyCtx.shadowColor= col;
  energyCtx.fill();
  energyCtx.shadowBlur = 0;
}


function drawWave(){
  const n     = particleLevel;
  const scale = parseFloat(scaleSlider.value);
  const col   = LEVEL_COLORS[n];

  waveCtx.clearRect(0,0,W,H);
  drawGrid(waveCtx);

  const pts=[];
  for(let x=-300;x<300;x++){
    const psi = Math.sin((n+1)*x*0.02)*Math.exp(-x*x/40000);
    pts.push({x:cx+x, y:cy-psi*scale});
  }

  waveCtx.beginPath();
  waveCtx.moveTo(pts[0].x, cy);
  pts.forEach(p=>waveCtx.lineTo(p.x, p.y));
  waveCtx.lineTo(pts[pts.length-1].x, cy);
  waveCtx.closePath();
  waveCtx.fillStyle = col+"22";
  waveCtx.fill();

  waveCtx.beginPath();
  pts.forEach((p,i)=>i===0?waveCtx.moveTo(p.x,p.y):waveCtx.lineTo(p.x,p.y));
  waveCtx.strokeStyle = col;
  waveCtx.lineWidth   = 2;
  waveCtx.shadowBlur  = 10;
  waveCtx.shadowColor = col;
  waveCtx.stroke();
  waveCtx.shadowBlur  = 0;

  for(let i=1;i<=n;i++){
    const nodeX = cx+(i*120-n*60);
    waveCtx.beginPath();
    waveCtx.arc(nodeX, cy, 5, 0, Math.PI*2);
    waveCtx.fillStyle="#ef4444";
    waveCtx.fill();
  }

  if(measurementX!==null){
    waveCtx.beginPath();
    waveCtx.arc(measurementX, cy, 9, 0, Math.PI*2);
    waveCtx.fillStyle="yellow";
    waveCtx.shadowBlur=20;waveCtx.shadowColor="yellow";
    waveCtx.fill();waveCtx.shadowBlur=0;
  }

  waveCtx.fillStyle="rgba(160,180,255,0.6)";
  waveCtx.font="13px sans-serif";
  waveCtx.fillText("ψ(x)", 10, 20);
  waveCtx.fillText("x →", W-40, cy-8);
}


function drawProbability(){
  const n   = particleLevel;
  const col = LEVEL_COLORS[n];

  probCtx.clearRect(0,0,W,H);
  drawGrid(probCtx);

  const pts=[];
  for(let x=-300;x<300;x++){
    const psi  = Math.sin((n+1)*x*0.02)*Math.exp(-x*x/40000);
    const prob = psi*psi;
    pts.push({x:cx+x, y:cy+120-prob*260});
  }

  probCtx.beginPath();
  probCtx.moveTo(pts[0].x, cy+120);
  pts.forEach(p=>probCtx.lineTo(p.x,p.y));
  probCtx.lineTo(pts[pts.length-1].x, cy+120);
  probCtx.closePath();
  probCtx.fillStyle = col+"33";
  probCtx.fill();

  probCtx.beginPath();
  pts.forEach((p,i)=>i===0?probCtx.moveTo(p.x,p.y):probCtx.lineTo(p.x,p.y));
  probCtx.strokeStyle = col;
  probCtx.lineWidth   = 2;
  probCtx.shadowBlur  = 8;
  probCtx.shadowColor = col;
  probCtx.stroke();
  probCtx.shadowBlur  = 0;

  probCtx.fillStyle="rgba(160,180,255,0.6)";
  probCtx.font="13px sans-serif";
  probCtx.fillText("|ψ(x)|²", 10, 20);
  probCtx.fillText("x →", W-40, cy+116);
}


function animate(){
  if(paused) return;
  drawEnergy();
  drawWave();
  drawProbability();
  animId = requestAnimationFrame(animate);
}

animate();
