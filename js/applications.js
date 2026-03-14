const ionCanvas = document.getElementById("ionCanvas");
const ionCtx    = ionCanvas.getContext("2d");
ionCanvas.width  = 620;
ionCanvas.height = 260;

let ionTime  = 0;
let ionLevel = 0;
let ionY     = 130;

const ION_COLORS = ["#00eeff","#a78bfa","#34d399","#fbbf24","#f472b6","#60a5fa"];

function drawIonTrap(){
  ionCtx.clearRect(0,0,620,260);

  const cx=310, cy=130;

  for(let i=1;i<=4;i++){
    ionCtx.beginPath();
    ionCtx.ellipse(cx,cy,55*i,28*i,0,0,Math.PI*2);
    ionCtx.strokeStyle=`rgba(120,150,255,${0.12/i})`;
    ionCtx.lineWidth=1;ionCtx.stroke();
  }

  ionCtx.beginPath();ionCtx.moveTo(cx,20);ionCtx.lineTo(cx,240);
  ionCtx.strokeStyle="rgba(120,150,255,0.2)";ionCtx.stroke();

  for(let n=0;n<5;n++){
    const ly = cy + 60 - n*24;
    const active=(n===ionLevel);
    ionCtx.beginPath();
    ionCtx.moveTo(cx-60,ly);ionCtx.lineTo(cx+60,ly);
    ionCtx.strokeStyle = active ? ION_COLORS[n] : "rgba(180,180,255,0.2)";
    ionCtx.lineWidth   = active ? 2 : 1;
    ionCtx.stroke();

    ionCtx.font="10px sans-serif";
    ionCtx.fillStyle = active ? ION_COLORS[n] : "rgba(160,180,255,0.35)";
    ionCtx.textAlign="left";
    ionCtx.fillText(`n=${n}`,cx+65,ly+4);
  }

  const targetY = cy + 60 - ionLevel*24;
  ionY += (targetY-ionY)*0.08;

  const oscY = ionY + Math.sin(ionTime)*18;

  const col=ION_COLORS[ionLevel];
  ionCtx.beginPath();
  ionCtx.arc(cx,oscY,9,0,Math.PI*2);
  ionCtx.fillStyle=col;
  ionCtx.shadowBlur=14;
  ionCtx.shadowColor=col;
  ionCtx.fill();
  ionCtx.shadowBlur=0;

  
  ionCtx.font="bold 11px sans-serif";
  ionCtx.fillStyle="#000";
  ionCtx.textAlign="center";
  ionCtx.fillText("+",cx,oscY+4);

  ionCtx.fillStyle="rgba(160,190,255,0.6)";
  ionCtx.font="12px sans-serif";
  ionCtx.fillText("Trapped Ion — quantized oscillator",cx,248);


  ionLevel = Math.floor((Math.sin(ionTime*0.3)+1)*2.5);

  ionTime+=0.05;
  requestAnimationFrame(drawIonTrap);
}
drawIonTrap();


const moleculeCanvas = document.getElementById("moleculeCanvas");
const molCtx         = moleculeCanvas.getContext("2d");
moleculeCanvas.width = 620;
moleculeCanvas.height= 220;

let molTime=0;

const irActive = document.getElementById("irActive");

function drawMolecule(){
  molCtx.clearRect(0,0,620,220);
  const center=310;
  const freq = 0.04;
  const offset = Math.sin(molTime)*40;

  const steps=6;
  for(let i=0;i<steps;i++){
    const x1 = center-offset+14 + (offset*2-28)/steps*i;
    const x2 = center-offset+14 + (offset*2-28)/steps*(i+1);
    const yOff= (i%2===0)?-8:8;
    molCtx.beginPath();molCtx.moveTo(x1,110);molCtx.lineTo((x1+x2)/2,110+yOff);molCtx.lineTo(x2,110);
    molCtx.strokeStyle="rgba(200,220,255,0.6)";molCtx.lineWidth=1.5;molCtx.stroke();
  }

  const gA=molCtx.createRadialGradient(center-offset,110,2,center-offset,110,14);
  gA.addColorStop(0,"#ffcc88");
  gA.addColorStop(1,"#ff8800");
  molCtx.beginPath();
  molCtx.arc(center-offset,110,14,0,Math.PI*2);
  molCtx.fillStyle=gA;
  molCtx.shadowBlur=12;
  molCtx.shadowColor="#ff8800";
  molCtx.fill();
  molCtx.shadowBlur=0;

  const gB=molCtx.createRadialGradient(center+offset,110,2,center+offset,110,14);
  gB.addColorStop(0,"#ffcc88");
  gB.addColorStop(1,"#ff8800");
  molCtx.beginPath();
  molCtx.arc(center+offset,110,14,0,Math.PI*2);
  molCtx.fillStyle=gB;
  molCtx.shadowBlur=12;
  molCtx.shadowColor="#ff8800";
  molCtx.fill();
  molCtx.shadowBlur=0;

  molCtx.font="bold 11px sans-serif";
  molCtx.fillStyle="#000";
  molCtx.textAlign="center";
  molCtx.fillText("C",center-offset,114);
  molCtx.fillText("O",center+offset,114);

  molCtx.fillStyle="rgba(160,190,255,0.6)";
  molCtx.font="12px sans-serif";
  const energy = (1+Math.abs(Math.sin(molTime))).toFixed(2);
  molCtx.fillText(`Vibrational energy ≈ ${energy} ℏω`,center,200);

  if(irActive){
    const intensity = (0.6+Math.abs(Math.sin(molTime))*0.4).toFixed(2);
    irActive.style.opacity=intensity;
  }

  molTime+=freq*1.2;
  requestAnimationFrame(drawMolecule);
}
drawMolecule();


const photonCanvas = document.getElementById("photonCanvas");
const phoCtx       = photonCanvas.getContext("2d");
photonCanvas.width = 620;
photonCanvas.height= 220;

const addPhotonBtn   = document.getElementById("addPhotonBtn");
const resetPhotonBtn = document.getElementById("resetPhotonBtn");
const photonCountEl  = document.getElementById("photonCount");

let photonN    = 1;
let photonTime = 0;

addPhotonBtn.addEventListener("click",()=>{
  if(photonN<8) photonN++;
  photonCountEl.textContent=`n = ${photonN}`;
  addPhotonBtn.disabled=(photonN>=8);
});

resetPhotonBtn.addEventListener("click",()=>{
  photonN=1;
  photonCountEl.textContent="n = 1";
  addPhotonBtn.disabled=false;
});

function drawPhotonCavity(){
  phoCtx.clearRect(0,0,620,220);

  const mirrorColor="rgba(100,140,255,0.5)";
  phoCtx.fillStyle=mirrorColor;
  phoCtx.fillRect(28,50,12,120);
  phoCtx.fillRect(580,50,12,120);
  phoCtx.fillStyle="rgba(160,180,255,0.5)";
  phoCtx.font="11px sans-serif";
  phoCtx.textAlign="center";
  phoCtx.fillText("M₁",34,170);
  phoCtx.fillText("M₂",586,170);

  for(let mode=0;mode<photonN;mode++){
    const amp   = 25/(photonN*0.5+1);
    const phase = photonTime*(0.8+mode*0.12);
    const r=Math.floor(100+mode*20),g=Math.floor(60+mode*10),b=Math.floor(220-mode*15);

    phoCtx.beginPath();
    for(let x=40;x<580;x++){
      const y = 110 + amp * Math.sin((mode+1)*Math.PI*(x-40)/540) * Math.cos(phase);
      x===40?phoCtx.moveTo(x,y):phoCtx.lineTo(x,y);
    }
    phoCtx.strokeStyle=`rgb(${r},${g},${b})`;
    phoCtx.lineWidth=2;
    phoCtx.shadowBlur=8;
    phoCtx.shadowColor=`rgb(${r},${g},${b})`;
    phoCtx.stroke();
    phoCtx.shadowBlur=0;
  }

  phoCtx.fillStyle="rgba(160,190,255,0.7)";
  phoCtx.font="13px sans-serif";
  phoCtx.textAlign="center";
  phoCtx.fillText(`Optical cavity — Fock state |n=${photonN}⟩`,310,205);

  photonTime+=0.04;
  requestAnimationFrame(drawPhotonCavity);
}
drawPhotonCavity();
