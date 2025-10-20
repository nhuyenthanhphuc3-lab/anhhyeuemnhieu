

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;
function resizeCanvas(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);

const colors = ["#99ffff", "#ccffff", "#66ffff", "#33cccc"];
let particles = [];
const NUM = Math.max(120, Math.floor((Math.min(window.innerWidth, window.innerHeight)/6)*2)); // adaptive

function makeParticle(layer){
  return {
    x: Math.random()*W,
    y: Math.random()*H,
    dx: (Math.random()-0.5) * (layer===1 ? 0.2 : 0.6),
    dy: - (0.2 + Math.random()*(layer===1?0.4:1.1)),
    r: layer===1 ? (Math.random()*1.6+0.8) : (Math.random()*2.8+1.6),
    col: colors[(Math.random()*colors.length)|0],
    a: layer===1 ? 0.22 + Math.random()*0.2 : 0.6 + Math.random()*0.3,
    layer
  };
}
function buildParticles(){
  particles = [];
  for(let i=0;i<NUM;i++) particles.push(makeParticle(i%2===0?1:2));
}
buildParticles();

function drawParticles(){
  ctx.clearRect(0,0,W,H);
  for(const p of particles){
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.col;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    p.x += p.dx; p.y += p.dy;
    // slight horizontal wrap
    if(p.x < -20) p.x = W + 20;
    if(p.x > W + 20) p.x = -20;
    if(p.y < -30) { Object.assign(p, makeParticle(p.layer)); p.y = H + 10; }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

const photoStack = document.getElementById('photoStack');
const photos = Array.from(photoStack.querySelectorAll('img'));
const heart = document.getElementById('heart');
const heartText = document.getElementById('heartText');
const acceptBtn = document.getElementById('accept');
const refuseBtn = document.querySelector('.btn.refuse');

function openPhotos(){
  photoStack.classList.add('open');
  // hide heart slightly
  heart.style.transform = 'translate(-50%,-50%) rotate(-45deg) scale(0.96)';
  // ensure heartText fades a bit
  heartText.style.opacity = '0.9';
}
heart.addEventListener('click', openPhotos);

const FINAL_LINK = "https://nhuyenthanhphuc3-lab.github.io/ahyeuemnhieulam/";

acceptBtn.addEventListener('click', () => {
  acceptBtn.disabled = true;
  acceptBtn.style.transform = 'scale(0.98)';
  setTimeout(() => window.open(FINAL_LINK, '_blank'), 180);
  setTimeout(() => acceptBtn.disabled = false, 600);
});

function moveRefuse(){
  const pad = 26;
  const x = Math.random()*(window.innerWidth - 120) + pad;
  const y = Math.random()*(window.innerHeight - 120) + pad;
  refuseBtn.style.position = 'fixed';
  refuseBtn.style.left = `${x}px`; refuseBtn.style.top = `${y}px`;
}
refuseBtn.addEventListener('mouseenter', moveRefuse);
refuseBtn.addEventListener('click', moveRefuse);

photos.forEach((img, idx)=>{
  img.addEventListener('click', (e)=>{
    e.stopPropagation();
    const wasActive = img.classList.contains('active');
    // remove active on all
    photos.forEach(p => p.classList.remove('active'));
    if(!wasActive){
      img.classList.add('active');
      // create sparkle effect
      showSparkle();
      // lock scroll / interactions underneath
      document.body.style.overflow = 'hidden';
    } else {
      // if clicked again, close active
      img.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});


document.addEventListener('click', (e)=>{
  // if click outside any .active img, remove active
  const anyActive = photos.some(p=>p.classList.contains('active'));
  if(anyActive){
    const active = photos.find(p=>p.classList.contains('active'));
    if(active){
      // if click target is the active itself, ignore (handled above)
      if(e.target === active) return;
      // else remove active
      active.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    photos.forEach(p=>p.classList.remove('active'));
    document.body.style.overflow = '';
  }
});


function showSparkle(){
  const s = document.createElement('div');
  s.className = 'sparkle';
  document.body.appendChild(s);
  setTimeout(()=> s.remove(), 1400);
}

const spStyle = document.createElement('style');
spStyle.innerHTML = `
.sparkle{
  position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); z-index:2000;
  width:220px; height:220px; border-radius:50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(153,255,255,0.18) 40%, rgba(0,255,255,0.02) 70%);
  box-shadow: 0 0 80px rgba(153,255,255,0.18), inset 0 0 40px rgba(255,255,255,0.12);
  animation: sparkA 1.3s ease-out forwards;
}
@keyframes sparkA {
  0%{ transform:translate(-50%,-50%) scale(0.6); opacity:0.9 }
  50%{ transform:translate(-50%,-50%) scale(1.2); opacity:1 }
  100%{ transform:translate(-50%,-50%) scale(0.2); opacity:0 }
}`;
document.head.appendChild(spStyle);

photos.forEach(img=>{
  if(!img.complete){
    img.onload = ()=> { /* nothing */ };
  }
});

window.addEventListener('load', ()=> heart.setAttribute('tabindex','0') );