// Hand-rolled canvas confetti in the app palette. Real physics: gravity,
// drift, spin and fade. Under reduced motion it becomes a single calm fade.

const PALETTE = ['#E0457B', '#8E2A5E', '#F9C6D5', '#F0A63C', '#E8705A', '#D9678F', '#A366A0'];

let canvas = null, ctx = null, raf = 0, particles = [], startedAt = 0, duration = 2200;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
}

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(count) {
  const w = innerWidth, h = innerHeight;
  const out = [];
  for (let i = 0; i < count; i++) {
    const fromLeft = i % 2 === 0;
    const x = fromLeft ? w * 0.12 : w * 0.88;
    const y = h * 0.62;
    const angle = (fromLeft ? -Math.PI / 2 + 0.55 : -Math.PI / 2 - 0.55) + (Math.random() - 0.5) * 0.9;
    const speed = 0.55 + Math.random() * 0.6; // px per ms
    out.push({
      x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 6,
      shape: Math.random() < 0.7 ? 'rect' : 'dot',
      color: PALETTE[i % PALETTE.length],
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.004 + Math.random() * 0.006,
      drift: (Math.random() - 0.5) * 0.06,
    });
  }
  return out;
}

function frame(t) {
  const elapsed = t - startedAt;
  const dt = Math.min(40, t - (frame.last || t));
  frame.last = t;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const g = 0.0011; // gravity px/ms^2
  const fade = elapsed > duration - 600 ? Math.max(0, (duration - elapsed) / 600) : 1;
  for (const p of particles) {
    p.vy += g * dt;
    p.vx += p.drift * 0.001 * dt;
    p.vx *= 0.995;
    p.wobble += p.wobbleSpeed * dt;
    p.x += (p.vx + Math.sin(p.wobble) * 0.05) * dt;
    p.y += p.vy * dt;
    p.rot += p.spin * dt;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  if (elapsed < duration) raf = requestAnimationFrame(frame);
  else stop();
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0; particles = []; frame.last = 0;
  if (ctx) ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (canvas) canvas.classList.remove('is-on');
}

export function burst({ enabled = true, reducedMotion = false, count = 140 } = {}) {
  if (!enabled) return;
  if (reducedMotion) { calmFade(); return; }
  ensureCanvas();
  resize();
  stop();
  canvas.classList.add('is-on');
  particles = spawn(count);
  startedAt = performance.now();
  frame.last = startedAt;
  raf = requestAnimationFrame(frame);
}

// Reduced-motion alternative: one soft wash of colour that fades away.
export function calmFade() {
  let el = document.querySelector('.calm-fade');
  if (!el) {
    el = document.createElement('div');
    el.className = 'calm-fade';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
  el.classList.remove('is-on');
  void el.offsetWidth;
  el.classList.add('is-on');
  setTimeout(() => el.classList.remove('is-on'), 1400);
}
