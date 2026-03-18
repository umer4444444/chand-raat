import './style.css';

// --- Unified Canvas Logic: Festive Blooms, Sparks, and Petels ---
const canvas = document.getElementById('festiveCanvas');
const ctx = canvas.getContext('2d');

function initCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
initCanvasSize();
window.addEventListener('resize', initCanvasSize);

const particles = [];
const sparks = [];

class FestiveBloom {
  constructor(x, y, isMega = false) {
    this.x = x;
    this.y = y;
    this.scale = 0;
    this.maxScale = isMega ? Math.random() * 0.8 + 0.8 : Math.random() * 0.4 + 0.3;
    this.opacity = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.petalCount = isMega ? 12 : Math.floor(Math.random() * 3) + 6;
    this.growthSpeed = isMega ? 0.04 : 0.08;
    this.fadeSpeed = isMega ? 0.005 : 0.015;
    
    const colors = [
      'rgba(255, 213, 79, ', // Gold
      'rgba(244, 143, 177, ', // Blush Pink
      'rgba(194, 24, 91, ',   // Magenta
      'rgba(255, 255, 255, '  // White Shimmer
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    if (this.scale < this.maxScale) {
      this.scale += this.growthSpeed;
      this.growthSpeed *= 0.95;
    } else {
      this.opacity -= this.fadeSpeed;
      this.rotation += 0.003;
    }
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    
    ctx.fillStyle = this.colorBase + this.opacity + ')';
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.colorBase + this.opacity + ')';
    
    // Intricate Mandala Shape
    for (let i = 0; i < this.petalCount; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / this.petalCount) * i);
        
        // Main Petal
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(20, -40, 40, -25, 52, 0);
        ctx.bezierCurveTo(40, 25, 20, 40, 0, 0);
        ctx.fill();
        
        // Inner glowing vein
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(35, 0);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }
    
    // Core detail
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 100, ${this.opacity})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }
}

class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 18;
    this.vy = (Math.random() - 0.5) * 18 - 8;
    this.scale = Math.random() * 4 + 1;
    this.opacity = 1;
    this.decay = Math.random() * 0.015 + 0.008;
    this.color = (Math.random() > 0.4) ? '#ffd54f' : '#f8bbd0';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.35; 
    this.opacity -= this.decay;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function spawnButterfly(x, y) {
  const bf = document.createElement('div');
  bf.classList.add('butterfly');
  bf.style.left = `${x}px`;
  bf.style.top = `${y}px`;
  
  // Random flight paths
  const tx1 = (Math.random() - 0.5) * 400;
  const ty1 = -(Math.random() * 300 + 100);
  const tx2 = tx1 + (Math.random() - 0.5) * 200;
  const ty2 = ty1 - (Math.random() * 400 + 200);
  
  bf.style.setProperty('--tx1', `${tx1}px`);
  bf.style.setProperty('--ty1', `${ty1}px`);
  bf.style.setProperty('--tx2', `${tx2}px`);
  bf.style.setProperty('--ty2', `${ty2}px`);
  
  document.body.appendChild(bf);
  setTimeout(() => bf.remove(), 5000);
}

let lastMouseBloom = 0;

function spawnBloom(x, y, isMega = false) {
  particles.push(new FestiveBloom(x, y, isMega));
}

function triggerCelebrationMagic(x, y) {
  // 1. Confetti & Sparks
  for(let i = 0; i < 80; i++) sparks.push(new Sparkle(x, y));
  
  // 2. Butterflies!
  for(let i = 0; i < 8; i++) {
    setTimeout(() => spawnButterfly(x, y), i * 150);
  }
  
  // 3. Mega Mandala Growth
  spawnBloom(x, y, true);
  
  // 4. Surround blooms
  for(let i = 0; i < 12; i++) {
     const angle = (Math.PI * 2 / 12) * i;
     const dist = 200;
     setTimeout(() => {
        spawnBloom(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist);
     }, i * 50);
  }
}

// Logic Loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw(ctx);
    if (p.opacity <= 0) particles.splice(i, 1);
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    s.update();
    s.draw(ctx);
    if (s.opacity <= 0) sparks.splice(i, 1);
  }
  
  if(Math.random() < 0.015) {
    spawnBloom(Math.random() * canvas.width, Math.random() * canvas.height);
  }
  
  requestAnimationFrame(loop);
}
loop();

// Interactions
window.addEventListener('click', (e) => {
  if (e.target.id === 'magicBtn' || e.target.classList.contains('greeting')) return;
  spawnBloom(e.clientX, e.clientY);
  if (Math.random() > 0.7) spawnButterfly(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastMouseBloom > 120) {
    spawnBloom(e.clientX, e.clientY);
    lastMouseBloom = now;
  }
});

const btn = document.getElementById('magicBtn');
const greeting = document.querySelector('.greeting');
const content = document.querySelector('.content');

function doEpicWishTap(e) {
  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight / 2;

  triggerCelebrationMagic(x, y);

  // Body vibe change
  document.body.classList.add('celebrate-filter');
  content.classList.add('transformed');

  btn.textContent = "Eid Mubarak! ✨";
  btn.style.background = "linear-gradient(45deg, #ffd54f, #c2185b)";
  btn.style.boxShadow = "0 0 60px rgba(255, 213, 79, 1)";
  btn.style.transform = "scale(1.1)";
  
  // Robust Text Morphing
  greeting.style.transition = 'opacity 0.4s ease';
  greeting.style.opacity = '0';
  
  setTimeout(() => {
     greeting.innerHTML = `Eid Mubarak<br><span style="font-size:2.8rem; font-family:'Poppins', sans-serif; color:var(--festive-gold); text-shadow:0 0 15px #fff; display:block; margin-top:10px;">Full of Light & Grace</span>`;
     greeting.style.opacity = '1';
     greeting.style.letterSpacing = '5px';
     subtitle.style.opacity = '0.9';
     
     // Update signature to match the theme
     const sig = document.querySelector('.signature');
     sig.innerHTML = "Warmly, Umar";
     sig.style.color = "#fff";
     sig.style.textShadow = "0 0 20px var(--festive-gold)";
  }, 450);
}

btn.addEventListener('click', doEpicWishTap);
greeting.addEventListener('click', doEpicWishTap);
