const canvas  = document.getElementById("energyCanvas");
const ctx     = canvas.getContext("2d");
canvas.width  = 720;
canvas.height = 380;

const centerX = canvas.width/2;
const centerY = canvas.height*0.75;

let level     = 0;
let electronY = centerY;
let photon    = null;
let photonTrail = [];

const exciteBtn = document.getElementById("exciteBtn");
const relaxBtn  = document.getElementById("relaxBtn");
const levelDisp = document.getElementById("levelDisplay");
const energyDisp= document.getElementById("energyDisplay");
const photonDisp= document.getElementById("photonDisplay");
const specStrip = document.getElementById("spectrumStrip");

const PHOTON_COLORS = ["red","orange","#88ff00","blue","violet","white"];
const PHOTON_NAMES  = ["Red","Orange","Green","Blue","Violet","White"];
const SUB           = ["₀","₁","₂","₃","₄","₅"];

function updateUI(){
  exciteBtn.disabled = (level >= 5);
  relaxBtn.disabled  = (level <= 0);

  levelDisp.textContent  = `n = ${level}`;
  energyDisp.textContent = `E${SUB[level]} = ${(level+0.5).toFixed(1)} ℏω`;

  if(specStrip){
    specStrip.querySelectorAll(".spectrum-segment").forEach(seg=>{
      seg.classList.toggle("active", parseInt(seg.dataset.level)===level);
    });
  }
}
updateUI();


function drawGrid(){
  for(let x=0;x<canvas.width;x+=25){
    ctx.strokeStyle="rgba(120,150,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    ctx.stroke();
  }
  for(let y=0;y<canvas.height;y+=25){
    ctx.strokeStyle="rgba(120,150,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    ctx.stroke();
  }
}

function drawAxes(){
  ctx.strokeStyle="rgba(220,220,255,0.4)";ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(0,centerY);
  ctx.lineTo(canvas.width,centerY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX,0);
  ctx.lineTo(centerX,canvas.height);
  ctx.stroke();
}

function drawPotential(){
  ctx.beginPath();
  for(let x=-300;x<300;x++) ctx.lineTo(centerX+x, centerY-0.003*x*x);
  ctx.strokeStyle="#8fa4ff";
  ctx.lineWidth=2;
  ctx.stroke();
}

function drawLevels(){
  for(let n=0;n<6;n++){
    const y      = centerY-(40+n*30);
    const active = (n===level);
    const col    = PHOTON_COLORS[n];

    ctx.beginPath();
    ctx.moveTo(centerX-200,y);ctx.lineTo(centerX+200,y);
    ctx.strokeStyle = active ? col : "rgba(200,210,255,0.45)";
    ctx.lineWidth   = active ? 2.5 : 1.5;
    ctx.shadowBlur  = active ? 14 : 0;
    ctx.shadowColor = col;
    ctx.stroke();ctx.shadowBlur=0;

    ctx.beginPath();
    for(let x=-200;x<200;x++) ctx.lineTo(centerX+x, y-Math.sin((n+1)*x*0.03)*10);
    ctx.strokeStyle=col+"55";
    ctx.lineWidth=1;
    ctx.stroke();

    ctx.fillStyle = active ? col : "rgba(160,180,255,0.6)";
    ctx.font=(active?"bold ":"")+"12px sans-serif";
    ctx.fillText(`n=${n}   E${SUB[n]}=${(n+0.5).toFixed(1)}ℏω`, centerX+208, y+4);
  }
}

function drawElectron(){
  const targetY = centerY-(40+level*30);
  electronY += (targetY-electronY)*0.18;

  const col = PHOTON_COLORS[level];
  for(let i=0;i<20;i++){
    const a=Math.random()*Math.PI*2, r=Math.random()*12;
    ctx.beginPath();
    ctx.arc(centerX+Math.cos(a)*r, electronY+Math.sin(a)*r, 2, 0, Math.PI*2);
    ctx.fillStyle=col+"44";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(centerX, electronY, 5, 0, Math.PI*2);
  ctx.fillStyle=col;
  ctx.shadowBlur=14;
  ctx.shadowColor=col;
  ctx.fill();
  ctx.shadowBlur=0;
}

function drawPhoton(){
  if(!photon) return;
  photon.x += photon.vx;

  photonTrail.push({x:photon.x, y:photon.y});
  if(photonTrail.length>20) photonTrail.shift();

  photonTrail.forEach((p,i)=>{
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
    ctx.fillStyle=photon.color;
    ctx.globalAlpha=0.2+i*0.012;
    ctx.fill();
  });

  ctx.globalAlpha=1;

  ctx.beginPath();
  ctx.arc(photon.x, photon.y, 5, 0, Math.PI*2);
  ctx.fillStyle=photon.color;
  ctx.shadowBlur=18;
  ctx.shadowColor=photon.color;
  ctx.fill();
  ctx.shadowBlur=0;

  ctx.font="bold 12px sans-serif";
  ctx.fillStyle=photon.color;
  ctx.fillText(photon.name, photon.x+10, photon.y-8);

  if(photon.x>canvas.width || photon.x<0){
    photon=null;photonTrail=[];
    photonDisp.textContent="—";
  }
}


exciteBtn.addEventListener("click",()=>{
  if(level>=5) return;
  level++;
  photon={x:centerX, y:electronY, vx:-7, color:PHOTON_COLORS[level-1], name:PHOTON_NAMES[level-1]};
  photonDisp.innerHTML=`<span style="color:${PHOTON_COLORS[level-1]}">${PHOTON_NAMES[level-1]} absorbed</span>`;
  updateUI();
});

relaxBtn.addEventListener("click",()=>{
  if(level<=0) return;
  const emitColor = PHOTON_COLORS[level-1];
  const emitName  = PHOTON_NAMES[level-1];
  photon={x:centerX, y:electronY, vx:7, color:emitColor, name:emitName};
  photonDisp.innerHTML=`<span style="color:${emitColor}">${emitName} emitted</span>`;
  level--;
  updateUI();
});


function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  drawAxes();
  drawPotential();
  drawLevels();
  drawElectron();
  drawPhoton();
  requestAnimationFrame(animate);
}
animate();
