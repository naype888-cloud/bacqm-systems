// The bound (2.2): t99·μ = ln 100 / (1 − ρ/k), one curve per k = 1 … 4, drawn in
// SVG with a sequential ramp (k is ordered). The sliders move the marked point;
// hovering the plot reads every curve at that ρ. No dependencies.
(() => {
  "use strict";
  const box = document.getElementById("boundChart");
  if (!box) return;
  const rho = document.getElementById("rho"), kk = document.getElementById("kk");
  const rhoOut = document.getElementById("rhoOut"), kOut = document.getElementById("kOut");
  const out = document.getElementById("boundOut"), legend = document.getElementById("tryLegend");
  const NS = "http://www.w3.org/2000/svg", L100 = Math.log(100);
  const W = 720, H = 300, M = { l: 44, r: 54, t: 12, b: 34 }, XMAX = 4, YMAX = 60;
  const X = (r) => M.l + (r / XMAX) * (W - M.l - M.r), Y = (v) => H - M.b - (Math.min(v, YMAX) / YMAX) * (H - M.t - M.b);
  const bound = (r, k) => (r < k ? L100 / (1 - r / k) : Infinity);
  const el = (tag, at, parent) => { const n = document.createElementNS(NS, tag); for (const a in at) n.setAttribute(a, at[a]); parent && parent.appendChild(n); return n; };

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Tail bound against offered load for one to four collectors" }, box);
  const tip = document.createElement("div"); tip.className = "tip"; box.appendChild(tip);

  const axis = el("g", { class: "axis" }, svg);
  for (let v = 0; v <= YMAX; v += 15) {
    el("line", { class: "gridline", x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v) }, axis);
    el("text", { x: M.l - 8, y: Y(v) + 4, "text-anchor": "end" }, axis).textContent = v;
  }
  for (let r = 0; r <= XMAX; r++) el("text", { x: X(r), y: H - M.b + 18, "text-anchor": "middle" }, axis).textContent = r;
  el("text", { x: W - M.r, y: H - 4, "text-anchor": "end" }, axis).textContent = "ρ = λ/μ";

  const curves = [], labels = [];
  for (let k = 1; k <= 4; k++) {
    el("line", { x1: X(k), x2: X(k), y1: M.t, y2: H - M.b, stroke: `var(--s${k})`, "stroke-width": 1, "stroke-dasharray": "2 4", opacity: 0.6 }, svg);
    let d = "";
    for (let s = 0; s <= 400; s++) {
      const r = (s / 400) * XMAX; if (r >= k) break;
      const v = bound(r, k); if (v > YMAX) { d += `L${X(k * (1 - L100 / YMAX)).toFixed(1)},${Y(YMAX)}`; break; }
      d += (d ? "L" : "M") + X(r).toFixed(1) + "," + Y(v).toFixed(1);
    }
    curves.push(el("path", { d, fill: "none", stroke: `var(--s${k})`, "stroke-width": 2, "stroke-linecap": "round" }, svg));
    const lx = X(k * (1 - L100 / YMAX));
    labels.push(el("text", { class: "lbl ink", x: lx + 6, y: Y(YMAX) + 12 }, svg));
    labels[k - 1].textContent = `k = ${k}`;
    const li = document.createElement("span"); li.innerHTML = `<i style="background:var(--s${k})"></i>k = ${k}`; legend.appendChild(li);
  }
  const marker = el("line", { x1: 0, x2: 0, y1: M.t, y2: H - M.b, stroke: "var(--muted)", "stroke-width": 1 }, svg);
  const dot = el("circle", { r: 5, fill: "var(--orange)", stroke: "var(--panel)", "stroke-width": 2 }, svg);
  const hover = el("line", { x1: 0, x2: 0, y1: M.t, y2: H - M.b, stroke: "var(--ink2)", "stroke-width": 1, opacity: 0 }, svg);

  function update() {
    const r = +rho.value, k = +kk.value, v = bound(r, k);
    rhoOut.value = rhoOut.textContent = r.toFixed(2); kOut.value = kOut.textContent = k;
    curves.forEach((c, i) => c.setAttribute("stroke-width", i + 1 === k ? 3.2 : 1.6));
    marker.setAttribute("x1", X(r)); marker.setAttribute("x2", X(r));
    dot.setAttribute("cx", X(r)); dot.setAttribute("cy", Y(isFinite(v) ? v : YMAX));
    dot.setAttribute("fill", isFinite(v) && v <= YMAX ? "var(--orange)" : "var(--red)");
    out.innerHTML = isFinite(v)
      ? `k = <b>${k}</b> · ρ/k = <b>${(r / k).toFixed(3)}</b> · t<sub>0.99</sub>·μ ≤ <b>${v.toFixed(2)}</b> · k* = ⌊ρ⌋ + 1 = <b>${Math.floor(r) + 1}</b>`
      : `k = <b>${k}</b> · ρ/k = <b class="hot">${(r / k).toFixed(3)}</b> · <span class="hot">no finite tail: open lane k* = ${Math.floor(r) + 1}</span>`;
  }
  rho.addEventListener("input", update); kk.addEventListener("input", update);
  update();

  svg.addEventListener("pointermove", (e) => {
    const b = svg.getBoundingClientRect(), sx = ((e.clientX - b.left) / b.width) * W;
    const r = Math.max(0, Math.min(XMAX, ((sx - M.l) / (W - M.l - M.r)) * XMAX));
    hover.setAttribute("x1", X(r)); hover.setAttribute("x2", X(r)); hover.setAttribute("opacity", 0.5);
    tip.innerHTML = `ρ = ${r.toFixed(2)}<br>` + [1, 2, 3, 4].map((k) => {
      const v = bound(r, k); return `<i style="background:var(--s${k})"></i>k = ${k}: ${isFinite(v) ? v.toFixed(1) : "∞"}`;
    }).join("<br>");
    const px = ((X(r) / W) * b.width), left = px > b.width * 0.62 ? px - tip.offsetWidth - 12 : px + 12;
    tip.style.left = left + "px"; tip.style.top = "8px"; tip.classList.add("on");
  });
  svg.addEventListener("pointerleave", () => { hover.setAttribute("opacity", 0); tip.classList.remove("on"); });
  svg.addEventListener("click", (e) => {
    const b = svg.getBoundingClientRect(), sx = ((e.clientX - b.left) / b.width) * W;
    rho.value = Math.max(0, Math.min(XMAX, ((sx - M.l) / (W - M.l - M.r)) * XMAX)).toFixed(2); update();
  });
})();
