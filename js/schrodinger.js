const canvas     = document.getElementById("catCanvas");
const ctx        = canvas.getContext("2d");
canvas.width     = 760;
canvas.height    = 420;

const measureBtn  = document.getElementById("measureBtn");
const resetBtn    = document.getElementById("resetBtn");
const decaySlider = document.getElementById("decaySlider");
const decayVal    = document.getElementById("decayVal");

const aliveCount  = document.getElementById("aliveCount");
const deadCount   = document.getElementById("deadCount");
const totalCount  = document.getElementById("totalCount");
const rateDisplay = document.getElementById("rateDisplay");

let state           = "superposition";
let time            = 0;
let decayTriggered  = false;
let poisonReleased  = false;
let shimmerPhase    = 0;

let stats = {alive:0, dead:0};

decaySlider.addEventListener("input", ()=>{
  decayVal.textContent = decaySlider.value;
});

function updateStats(){
  const total = stats.alive + stats.dead;
  aliveCount.textContent = stats.alive;
  deadCount.textContent  = stats.dead;
  totalCount.textContent = total;
  if(total > 0){
    const pct = ((stats.alive/total)*100).toFixed(0);
    rateDisplay.textContent = `Survival rate: ${pct}% (expected: ${100-parseInt(decaySlider.value)}%)`;
  }
}

function resetExperiment(){
  state          = "superposition";
  decayTriggered = false;
  poisonReleased = false;
  measureBtn.textContent = "🔬 Open the Box";
  measureBtn.disabled    = false;
}


function drawBox(){
  ctx.strokeStyle="rgba(200,210,255,0.8)";
  ctx.lineWidth=3;
  ctx.strokeRect(120,90,520,240);
  ctx.font="18px Arial";
  ctx.fillStyle="rgba(200,210,255,0.8)";
  ctx.textAlign="center";
  ctx.fillText("Quantum Box",380,72);
}

function drawAtom(){
  const x=200, y=180;
  ctx.beginPath();
  ctx.arc(x,y,16,0,Math.PI*2);
  ctx.fillStyle="yellow";
  ctx.fill();
  ctx.strokeStyle="orange";
  ctx.lineWidth=3;
  ctx.stroke();

  if(state==="superposition"){
    const r = 25+Math.sin(time)*5;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,200,0,${0.4+Math.sin(time*1.3)*0.2})`;
    ctx.lineWidth=2;
    ctx.stroke();
  }
  if(decayTriggered){
    ctx.beginPath();
    ctx.arc(x,y,28+Math.sin(time*4)*3,0,Math.PI*2);
    ctx.strokeStyle="rgba(255,80,0,0.7)";
    ctx.lineWidth=2;
    ctx.stroke();
  }
  ctx.fillStyle="rgba(200,210,255,0.7)";
  ctx.font="13px Arial";
  ctx.fillText("Radioactive Atom",x,y+40);
}

function drawGeiger(){
  const x=320,y=170;
  ctx.strokeStyle="rgba(200,210,255,0.6)";
  ctx.lineWidth=2;
  ctx.strokeRect(x,y,80,50);
  ctx.fillStyle="rgba(200,210,255,0.7)";
  ctx.font="13px Arial";
  ctx.textAlign="center";
  ctx.fillText("Geiger",x+40,y+28);
  if(decayTriggered){
    ctx.fillStyle="red";
    ctx.fillRect(x+20,y+10,40,10);
    ctx.fillStyle="rgba(255,80,80,0.6)";
    ctx.font="bold 10px Arial";
    ctx.fillText("CLICK!",x+40,y+50);
  }
}

function drawPoison(){
  const x=440,y=150;
  ctx.strokeStyle="rgba(200,210,255,0.6)";
  ctx.lineWidth=2;
  ctx.strokeRect(x,y,40,90);
  ctx.fillStyle=poisonReleased?"rgba(255,60,60,0.9)":"rgba(80,255,120,0.7)";
  ctx.fillRect(x+8,y+30,24,40);
  ctx.fillStyle="rgba(200,210,255,0.7)";
  ctx.font="13px Arial";
  ctx.fillText("Poison",x+20,y+110);
}

function drawCat(){
  const x=570, y=195;
  ctx.font="40px Arial";
  ctx.textAlign="center";

  if(state==="superposition"){
  
    shimmerPhase += 0.06;
    const a1 = 0.5+Math.sin(shimmerPhase)*0.45;
    const a2 = 1-a1;

    ctx.globalAlpha=a1;
    ctx.fillStyle="#34d399";
    ctx.fillText("😺",x,y);
    ctx.globalAlpha=a2;
    ctx.fillStyle="#ef4444";
    ctx.fillText("💀",x,y);
    ctx.globalAlpha=1;

    ctx.fillStyle="rgba(160,180,255,0.8)";
    ctx.font="bold 16px Arial";
    ctx.fillText("?",x,y+36);
  } 
  else if(state==="alive"){
    ctx.fillStyle="#34d399";
    ctx.fillText("😺",x,y);
    ctx.font="15px Arial";
    ctx.fillStyle="#34d399";
    ctx.fillText("ALIVE",x,y+36);
  } 
  else if(state==="dead"){
    ctx.fillStyle="#ef4444";
    ctx.fillText("💀",x,y);
    ctx.font="15px Arial";
    ctx.fillStyle="#ef4444";
    ctx.fillText("DEAD",x,y+36);
  }

  ctx.fillStyle="rgba(200,210,255,0.6)";
  ctx.font="13px Arial";
  ctx.fillText("Cat",x,y+56);
}

function drawQuantumWave(){
  ctx.beginPath();
  for(let x=140;x<640;x++){
    ctx.lineTo(x, 300+Math.sin(x*0.05+time)*14);
  }
  ctx.strokeStyle="#8fa4ff";
  ctx.lineWidth=2;
  ctx.shadowBlur=10;
  ctx.shadowColor="#8fa4ff";
  ctx.stroke();
  ctx.shadowBlur=0;

  ctx.font="12px Arial";
  ctx.textAlign="center";
  ctx.fillStyle="rgba(140,164,255,0.7)";
  ctx.fillText("⟨superposition wave⟩",380,335);
}

function drawCollapseLabel(){
  if(state==="alive"){
    ctx.font="bold 17px Arial";
    ctx.fillStyle="#34d399";
    ctx.textAlign="center";
    ctx.fillText("⟶ Wavefunction collapsed: Cat is ALIVE",380,370);
  } 
  else if(state==="dead"){
    ctx.font="bold 17px Arial";
    ctx.fillStyle="#ef4444";
    ctx.textAlign="center";
    ctx.fillText("⟶ Wavefunction collapsed: Cat is DEAD",380,370);
  }
}


function simulateExperiment(){
  if(state!=="superposition") return;
  measureBtn.disabled=true;

  const decayProb = parseInt(decaySlider.value)/100;

  if(Math.random() < decayProb){
    decayTriggered=true;
    setTimeout(()=>{
      poisonReleased=true;
      state="dead";
      stats.dead++;
      measureBtn.textContent="Dead 💀 — Reset to try again";
      updateStats();
    },900);
  } 
  else {
    state="alive";
    stats.alive++;
    measureBtn.textContent="Alive 😺 — Reset to try again";
    updateStats();
  }
}

measureBtn.addEventListener("click", simulateExperiment);
resetBtn.addEventListener("click", resetExperiment);


function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBox();
  drawAtom();
  drawGeiger();
  drawPoison();
  drawCat();
  if(state==="superposition") drawQuantumWave();
  drawCollapseLabel();
  time+=0.06;
  requestAnimationFrame(animate);
}
animate();
