// The living manifold of the landing. The fast domain 𝒱 sits at the centre as
// nineteen cells, ringed by the kernel Ω. Around it, k collectors ℛᵢ at equal
// angles 2π/k: equal precedence is the rotation symmetry Z_k. Pages leave 𝒱 in
// turn (page n goes to lane n mod k), wait at the ring if their lane is busy,
// cross the lane and are absorbed; absorbed load drains into the outer
// dissipative ring ∇S. Arrivals and service times are exponential, the offered
// load is ρ = λ/μ = 1.7 lanes of work: one lane cannot carry it, two can.
// Click opens one more lane (1 … 6), drag turns the plane. No dependencies.
(() => {
  "use strict";
  const canvas = document.getElementById("manifold");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const out = document.getElementById("readout");
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  const BLUE = [91, 155, 230], INK = [242, 241, 238], WARM = [240, 138, 93], RED = [240, 96, 95];
  const R0 = 0.44, R1 = 1.16, R2 = 1.5, EL0 = 0.62, KMAX = 6, QMAX = 44;
  const MU = 2.2, RHO = 1.7, LAMBDA = RHO * MU;
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, a).toFixed(3)})`;
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const expo = (rate) => -Math.log(1 - Math.random()) / rate;

  // 𝒱: the hexagonal cluster of radius 2 (19 cells) in the plane z = 0
  const cells = [];
  for (let q = -2; q <= 2; q++) for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r++)
    cells.push({ x: 0.13 * (q + r / 2), y: 0.13 * (r * 0.866), dim: 0 });

  // the queueing state
  let k = 2, next = 0, served = 0, clock = expo(LAMBDA), stall = 0;
  let lanes = [];
  const sparks = [];
  function makeLanes(n, carry) {
    const old = lanes;
    lanes = Array.from({ length: n }, () => ({ wait: 0, busy: null, level: 0 }));
    let backlog = carry ? old.reduce((s, l) => s + l.wait, 0) : 0;
    for (let i = 0; backlog > 0; i = (i + 1) % n, backlog--) lanes[i].wait++;
    old.forEach((l) => { if (l.busy) lanes[0].wait++; });
    next = 0;
  }
  makeLanes(k, false);
  const angle = (i) => (2 * Math.PI * i) / k - Math.PI / 2;

  function readout() {
    if (!out) return;
    const r = RHO / k;
    out.innerHTML = r < 1
      ? `<b>k = ${k}</b> · ρ/k = <b>${r.toFixed(2)}</b> · p99·μ ≤ <b>${(Math.log(100) / (1 - r)).toFixed(1)}</b>`
      : `<b>k = ${k}</b> · ρ/k = <b class="hot">${r.toFixed(2)}</b> · <span class="hot">serial backlog, no bound</span>`;
  }
  readout();

  function step(dt) {
    clock -= dt;
    while (clock <= 0) {                         // a page leaves 𝒱
      const c = cells[(Math.random() * cells.length) | 0];
      c.dim = 1;
      const L = lanes[next];
      if (L.wait < QMAX) L.wait++;
      next = (next + 1) % k;
      clock += expo(LAMBDA);
    }
    let backlog = 0;
    lanes.forEach((L, i) => {
      if (L.busy) {
        L.busy.t += dt;
        if (L.busy.t >= L.busy.d) {                // absorbed by ℛᵢ
          L.busy = null; L.level = Math.min(1, L.level + 0.22); served++;
          if (Math.random() < 0.55) sparks.push({ a: angle(i), r: R1, life: 1 });
        }
      }
      if (!L.busy && L.wait > 0) { L.wait--; L.busy = { t: 0, d: Math.max(0.12, expo(MU)) }; }
      L.level *= Math.exp(-0.45 * dt);
      backlog += L.wait;
    });
    cells.forEach((c) => (c.dim *= Math.exp(-2.2 * dt)));
    stall += ((backlog > 0.6 * QMAX ? 1 : 0) - stall) * Math.min(1, dt * 2.5);
    for (let s = sparks.length - 1; s >= 0; s--) {
      const p = sparks[s];
      p.r += (R2 - p.r) * Math.min(1, dt * 3); p.a += dt * 0.25; p.life -= dt * 0.55;
      if (p.life <= 0) sparks.splice(s, 1);
    }
  }

  // view
  let az = 0.35, el = EL0, vaz = 0, dragging = false, moved = 0, lastX = 0, lastY = 0;
  let W = 0, H = 0, S = 0, CX = 0, CY = 0, dpr = 1;
  const cs = [1, 0, 1, 0];
  function setView() { cs[0] = Math.cos(az); cs[1] = Math.sin(az); cs[2] = Math.cos(el); cs[3] = Math.sin(el); }
  function project(x, y, z, o) {
    const x1 = x * cs[0] - y * cs[1], y1 = x * cs[1] + y * cs[0];
    o[0] = CX + S * x1; o[1] = CY - S * (z * cs[2] + y1 * cs[3]); o[2] = y1 * cs[2] - z * cs[3];
    return o;
  }
  const polar = (r, a, o) => project(r * Math.cos(a), r * Math.sin(a), 0, o);

  const sprite = document.createElement("canvas");
  function makeSprite() {
    const r = Math.round(20 * dpr);
    sprite.width = sprite.height = r * 2;
    const g = sprite.getContext("2d"), grd = g.createRadialGradient(r, r, 0, r, r, r);
    grd.addColorStop(0, rgba(WARM, 0.9)); grd.addColorStop(0.3, rgba(WARM, 0.3)); grd.addColorStop(1, rgba(WARM, 0));
    g.fillStyle = grd; g.fillRect(0, 0, r * 2, r * 2);
  }
  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    S = Math.min(W, H) * 0.3; CX = W / 2; CY = H * 0.52;
    makeSprite();
    if (!running) frame(performance.now());
  }

  function ring(r, color, alpha, width, dash, phase) {
    ctx.strokeStyle = rgba(color, alpha); ctx.lineWidth = width; ctx.lineCap = "round"; ctx.setLineDash(dash); ctx.lineDashOffset = phase || 0;
    ctx.beginPath();
    for (let s = 0; s <= 96; s++) { const p = polar(r, (s / 96) * 2 * Math.PI, A); s ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
    ctx.stroke(); ctx.setLineDash([]);
  }
  function quantum(p, a) {
    const sw = sprite.width / dpr;
    ctx.globalAlpha = a; ctx.drawImage(sprite, p[0] - sw / 2, p[1] - sw / 2, sw, sw);
    ctx.fillStyle = "rgb(255,241,228)"; ctx.beginPath(); ctx.arc(p[0], p[1], 2.3, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = 1;
  }

  const A = [0, 0, 0], B = [0, 0, 0];
  let t0 = performance.now(), last = t0, running = false, raf = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = still.matches ? 99 : (now - t0) / 1000;
    if (!still.matches && t > 1.6) step(dt);
    if (!dragging && !still.matches) { az += (0.05 + vaz) * dt; vaz *= Math.pow(0.04, dt); el += (EL0 - el) * dt * 0.8; }
    setView();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const k0 = ease(t / 1.2), k1 = ease((t - 0.6) / 1.2);

    // ∇S: the outer dissipative ring, and Ω: the kernel ring
    ring(R2, BLUE, 0.34 * k1, 1.8, [0, 7], -t * 6);
    ring(R0, stall > 0.05 ? RED.map((v, c) => BLUE[c] + (v - BLUE[c]) * stall) : BLUE, (0.3 + 0.3 * stall) * k0, 1.4, []);

    // lanes, then their collectors
    for (let i = 0; i < k; i++) {
      const a = angle(i), L = lanes[i];
      polar(R0, a, A); polar(R1, a, B);
      const g = ease((t - 0.8 - 0.12 * i) / 0.9);
      ctx.strokeStyle = rgba(BLUE, (0.28 + 0.3 * (L.busy ? 1 : 0)) * g); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(A[0] + (B[0] - A[0]) * g, A[1] + (B[1] - A[1]) * g); ctx.stroke();
      if (g < 1) continue;
      const br = 15 + 10 * L.level;
      ctx.strokeStyle = rgba(BLUE, 0.35 + 0.4 * L.level); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(B[0], B[1], br, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = rgba(BLUE, 0.08 + 0.32 * L.level);
      ctx.beginPath(); ctx.arc(B[0], B[1], br * (0.35 + 0.65 * L.level), 0, 6.2832); ctx.fill();
      // the backlog waits on the kernel ring, spread around the lane's angle
      for (let j = 0; j < L.wait; j++) {
        const s = (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 0.075;
        polar(R0, a + s, A);
        ctx.fillStyle = rgba(j > 6 ? RED : WARM, 0.85); ctx.beginPath(); ctx.arc(A[0], A[1], 2.2, 0, 6.2832); ctx.fill();
      }
      if (L.busy) quantum(polar(R0 + (R1 - R0) * ease(L.busy.t / L.busy.d), a, A), 1);
    }

    // sparks drifting into ∇S
    for (const p of sparks) quantum(polar(p.r, p.a, A), 0.55 * p.life);

    // 𝒱: nineteen cells, nearly all occupied; a cell dims as its page leaves
    const order = cells.map((c, n) => [project(c.x, c.y, 0, [0, 0, 0]), n]).sort((x, y) => y[0][2] - x[0][2]);
    for (const [p, n] of order) {
      const c = cells[n], d = ease((t - 0.1 * (n % 7)) / 0.8);
      if (d <= 0) continue;
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.9 + n * 1.7);
      ctx.strokeStyle = rgba(BLUE, (0.08 + 0.12 * breathe) * d); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, 6.2832); ctx.stroke();
      const col = INK.map((v, ch) => v + (WARM[ch] - v) * c.dim * 0.8);
      ctx.fillStyle = rgba(col, (0.9 - 0.6 * c.dim) * d);
      ctx.beginPath(); ctx.arc(p[0], p[1], 3.6 - 1.4 * c.dim, 0, 6.2832); ctx.fill();
    }

    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || still.matches || document.hidden) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // drag to turn, click to open one more lane
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; vaz = 0; canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    az += dx * 0.008; el = Math.max(0.25, Math.min(1.25, el + dy * 0.005)); vaz = dx * 0.25;
    if (!running) frame(performance.now());
  });
  canvas.addEventListener("pointerup", () => {
    dragging = false; vaz = Math.max(-2, Math.min(2, vaz));
    if (moved < 6) { k = (k % KMAX) + 1; makeLanes(k, true); readout(); if (!running) frame(performance.now()); }
  });
  canvas.addEventListener("pointercancel", () => (dragging = false));

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  still.addEventListener?.("change", () => { stop(); t0 = performance.now() - 99000; frame(performance.now()); start(); });
  new ResizeObserver(resize).observe(canvas);
  resize();
  requestAnimationFrame(() => canvas.classList.add("ready"));
  start();

  // ---- the ticker of the results ---------------------------------------------
  const items = [...document.querySelectorAll(".ticker li")], bar = document.querySelector(".progress");
  if (!items.length) return;
  const TICK = 3600;
  let idx = 0, paused = false;
  function show(i) {
    items.forEach((li, n) => { li.classList.toggle("on", n === i); li.classList.toggle("off", n === idx && n !== i);
      li.querySelector("a").tabIndex = n === i ? 0 : -1; li.setAttribute("aria-hidden", n === i ? "false" : "true"); });
    idx = i;
    if (bar) { bar.style.setProperty("--tick", TICK / 1000 + "s"); bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run"); }
  }
  function tick() { if (!paused && !document.hidden) show((idx + 1) % items.length); setTimeout(tick, TICK); }
  const list = document.querySelector(".ticker");
  list.addEventListener("pointerenter", () => (paused = true));
  list.addEventListener("pointerleave", () => (paused = false));
  list.addEventListener("focusin", () => (paused = true));
  list.addEventListener("focusout", () => (paused = false));
  show(0);
  if (!still.matches) setTimeout(tick, TICK);
})();
