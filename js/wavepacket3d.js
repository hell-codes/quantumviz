window.addEventListener("load", function(){

const container = document.getElementById("threeContainer");
if(!container) return;


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(
75,
container.clientWidth/container.clientHeight,
0.1,
1000
);

camera.position.z = 80;


const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(container.clientWidth,container.clientHeight);

container.appendChild(renderer.domElement);


const geometry = new THREE.BufferGeometry();
const vertices = [];

for(let i=0;i<2000;i++){

let x = (Math.random()-0.5)*60;
let y = (Math.random()-0.5)*60;
let z = (Math.random()-0.5)*60;


let r = Math.sqrt(x*x + y*y + z*z);
let probability = Math.exp(-(r*r)/800);

if(Math.random() < probability){
vertices.push(x,y,z);
}

}

geometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(vertices,3)
);

const material = new THREE.PointsMaterial({
color:0x66ccff,
size:1,
transparent:true,
opacity:0.9
});

const cloud = new THREE.Points(geometry,material);

scene.add(cloud);


function animateCloud(){

requestAnimationFrame(animateCloud);

cloud.rotation.y += 0.002;
cloud.rotation.x += 0.001;

renderer.render(scene,camera);

}

animateCloud();

});
