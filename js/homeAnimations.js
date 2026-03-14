const bg = document.getElementById("backgroundPhysics");

if(bg){

const bgctx = bg.getContext("2d");

function resizeBG(){
bg.width = window.innerWidth;
bg.height = window.innerHeight;
}

resizeBG();
window.addEventListener("resize", resizeBG);

let particles=[];

for(let i=0;i<150;i++){

particles.push({

x:Math.random()*bg.width,
y:Math.random()*bg.height,
vx:(Math.random()-0.5)*0.15,
vy:(Math.random()-0.5)*0.15,
r:Math.random()*2,
depth:Math.random()

});

}

function animateBackground(){

bgctx.clearRect(0,0,bg.width,bg.height);

particles.forEach(p=>{

p.x+=p.vx;
p.y+=p.vy;

if(p.x<0||p.x>bg.width)p.vx*=-1;
if(p.y<0||p.y>bg.height)p.vy*=-1;

bgctx.beginPath();

bgctx.fillStyle=`rgba(180,200,255,${0.2+p.depth})`;

bgctx.arc(p.x,p.y,p.r*(0.5+p.depth),0,Math.PI*2);

bgctx.fill();

});

requestAnimationFrame(animateBackground);

}

animateBackground();

}


const waveCanvas = document.getElementById("waveCanvas");

if(waveCanvas){

const wctx = waveCanvas.getContext("2d");

waveCanvas.width = waveCanvas.offsetWidth;
waveCanvas.height = 320;

let t = 0;

function waveAnimation(){

const w = waveCanvas.width;
const h = waveCanvas.height;

const centerY = h/2;

wctx.clearRect(0,0,w,h);

wctx.beginPath();

for(let x=0;x<w;x++){

let y = centerY + 60*Math.sin(x*0.02 + t);


if(x===0){
wctx.moveTo(x,y);
}else{
wctx.lineTo(x,y);
}

}

wctx.strokeStyle="#9fb3ff";
wctx.lineWidth=2;

wctx.shadowBlur=15;
wctx.shadowColor="#8fa4ff";

wctx.stroke();

wctx.shadowBlur=0;


let px = (t*100)%w;
let py = centerY + 60*Math.sin(px*0.02 + t);

wctx.beginPath();
wctx.arc(px,py,6,0,Math.PI*2);
wctx.fillStyle="white";
wctx.fill();

t += 0.04;

requestAnimationFrame(waveAnimation);

}

waveAnimation();

}


const atomCanvas=document.getElementById("atomCanvas");

if(atomCanvas){

const actx=atomCanvas.getContext("2d");

atomCanvas.width=520;
atomCanvas.height=420;

let angle=0;

const orbitals=[

{radius:60, tilt:0.5, speed:0.02, electrons:2},
{radius:100, tilt:0.25, speed:-0.015, electrons:4},
{radius:140, tilt:-0.45, speed:0.01, electrons:6},
{radius:180, tilt:0.7, speed:-0.008, electrons:8}

];

function drawAtom(){

actx.clearRect(0,0,atomCanvas.width,atomCanvas.height);

let cx=260;
let cy=210;


let gradient=actx.createRadialGradient(cx,cy,5,cx,cy,30);

gradient.addColorStop(0,"#ffd166");
gradient.addColorStop(1,"rgba(255,200,80,0)");

actx.fillStyle=gradient;

actx.beginPath();
actx.arc(cx,cy,30,0,Math.PI*2);
actx.fill();


actx.beginPath();
actx.arc(cx,cy,10,0,Math.PI*2);
actx.fillStyle="#ffd166";
actx.fill();

orbitals.forEach(orb=>{


actx.beginPath();

for(let a=0;a<Math.PI*2;a+=0.02){

let x=cx+Math.cos(a)*orb.radius;
let y=cy+Math.sin(a)*orb.radius*orb.tilt;

if(a===0){
actx.moveTo(x,y);
}else{
actx.lineTo(x,y);
}

}

actx.strokeStyle="rgba(150,170,255,0.25)";
actx.stroke();


for(let i=0;i<orb.electrons;i++){

let theta=angle*orb.speed+i*(Math.PI*2/orb.electrons);

let ex=cx+Math.cos(theta)*orb.radius;
let ey=cy+Math.sin(theta)*orb.radius*orb.tilt;

actx.beginPath();
actx.arc(ex,ey,4,0,Math.PI*2);
actx.fillStyle="#e8f0ff";
actx.fill();

}

});

angle+=1;

requestAnimationFrame(drawAtom);

}

drawAtom();

}
