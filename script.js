// ---------- Particles background ----------
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let dots = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

for (let i = 0; i < 70; i++) {
  dots.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach((d, i) => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ff2e63";
    ctx.fill();
    for (let j = i + 1; j < dots.length; j++) {
      const o = dots[j];
      const dist = Math.hypot(d.x - o.x, d.y - o.y);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(123, 47, 247, ${1 - dist / 120})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}
draw();

// ---------- Typing effect ----------
const lines = [
  "Yahan sab milke decide karte hain.",
  "Tera idea. Sabka vote.",
  "Chaos se hi kuch naya banta hai.",
];
const typed = document.getElementById("typed");
let li = 0, ci = 0, deleting = false;

function type() {
  const text = lines[li];
  typed.textContent = text.slice(0, ci);
  if (!deleting && ci < text.length) ci++;
  else if (!deleting) { deleting = true; setTimeout(type, 1500); return; }
  else if (ci > 0) ci--;
  else { deleting = false; li = (li + 1) % lines.length; }
  setTimeout(type, deleting ? 30 : 70);
}
type();

// ---------- Gunshot effect ----------
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function gunSound() {
  const len = audioCtx.sampleRate * 0.25;
  const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buf;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.6;
  noise.connect(gain).connect(audioCtx.destination);
  noise.start();
}

addEventListener("click", (e) => {
  if (e.target.closest("a")) return; // button pe click pe fire nahi

  if (audioCtx.state === "suspended") audioCtx.resume();
  gunSound();

  // muzzle flash
  const flash = document.getElementById("flash");
  flash.style.setProperty("--x", e.clientX + "px");
  flash.style.setProperty("--y", e.clientY + "px");
  flash.classList.add("on");
  setTimeout(() => flash.classList.remove("on"), 60);

  // bullet hole
  const hole = document.createElement("div");
  hole.className = "hole";
  hole.style.left = e.clientX + "px";
  hole.style.top = e.clientY + "px";
  document.body.appendChild(hole);
  setTimeout(() => hole.remove(), 5000);

  // sparks
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.setProperty("--dx", (Math.random() - 0.5) * 120 + "px");
    s.style.setProperty("--dy", (Math.random() - 0.5) * 120 + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 500);
  }

  // screen shake
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
});