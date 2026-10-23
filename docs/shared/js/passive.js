// Weekly medians of the passive probe (data/passive_weekly_medians.csv), drawn
// in SVG: p50, p99, p999 on one axis in µs, the step of 26 September marked,
// a crosshair that reads the week, and the table view filled from the same rows.
(() => {
  "use strict";
  const box = document.getElementById("passiveChart");
  if (!box) return;
  // iso_week, first_day_utc, samples, p50, p99, p999, max, miss_pct_mean
  const ROWS = [
    ["2026-W33", "2026-08-15", 60, 82.1, 116.2, 326.7, 536.4, 0.045],
    ["2026-W34", "2026-08-17", 308, 82.2, 110.7, 297.8, 492.1, 0.017],
    ["2026-W35", "2026-08-24", 295, 83.5, 124.7, 326.8, 519.0, 0.012],
    ["2026-W36", "2026-08-31", 277, 83.4, 117.6, 316.2, 540.5, 0.022],
    ["2026-W37", "2026-09-07", 311, 84.0, 128.2, 337.0, 511.9, 0.036],
    ["2026-W38", "2026-09-14", 261, 83.4, 116.1, 302.8, 507.4, 0.427],
    ["2026-W39", "2026-09-21", 313, 84.4, 133.1, 332.3, 522.7, 0.012],
    ["2026-W40", "2026-09-28", 304, 87.4, 260.1, 425.8, 596.8, 0.015],
    ["2026-W41", "2026-10-05", 311, 87.4, 264.6, 409.8, 541.9, 0.014],
    ["2026-W42", "2026-10-12", 142, 87.1, 242.7, 408.0, 545.1, 0.011],
  ];
  const SERIES = [{ i: 3, name: "p50", c: "var(--s1)" }, { i: 4, name: "p99", c: "var(--s3)" }, { i: 5, name: "p999", c: "var(--s4)" }];
  const NS = "http://www.w3.org/2000/svg";
  const W = 720, H = 300, M = { l: 44, r: 50, t: 14, b: 34 }, YMAX = 450, N = ROWS.length;
  const X = (n) => M.l + (n / (N - 1)) * (W - M.l - M.r), Y = (v) => H - M.b - (v / YMAX) * (H - M.t - M.b);
  const el = (tag, at, parent) => { const n = document.createElementNS(NS, tag); for (const a in at) n.setAttribute(a, at[a]); parent && parent.appendChild(n); return n; };

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Weekly p50, p99 and p999 wakeup delay of the passive probe, August to October 2026" }, box);
  const tip = document.createElement("div"); tip.className = "tip"; box.appendChild(tip);
  const axis = el("g", { class: "axis" }, svg);
  for (let v = 0; v <= YMAX; v += 150) {
    el("line", { class: "gridline", x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v) }, axis);
    el("text", { x: M.l - 8, y: Y(v) + 4, "text-anchor": "end" }, axis).textContent = v;
  }
  ROWS.forEach((r, n) => { if (n % 2 === 0 || n === N - 1) el("text", { x: X(n), y: H - M.b + 18, "text-anchor": "middle" }, axis).textContent = r[0].slice(5); });

  // the step: the 1 ms pulse sleeps from 26 September (between W39 and W40)
  const xs = (X(6) + X(7)) / 2;
  el("line", { x1: xs, x2: xs, y1: M.t, y2: H - M.b, stroke: "var(--muted)", "stroke-width": 1, "stroke-dasharray": "3 4" }, svg);
  el("text", { class: "lbl", x: xs - 6, y: M.t + 10, "text-anchor": "end" }, svg).textContent = "1 ms pulse → sleeps";

  SERIES.forEach((s) => {
    el("path", { d: ROWS.map((r, n) => (n ? "L" : "M") + X(n).toFixed(1) + "," + Y(r[s.i]).toFixed(1)).join(""),
      fill: "none", stroke: s.c, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
    el("text", { class: "lbl ink", x: X(N - 1) + 8, y: Y(ROWS[N - 1][s.i]) + 4 }, svg).textContent = s.name;
  });
  const hover = el("line", { x1: 0, x2: 0, y1: M.t, y2: H - M.b, stroke: "var(--ink2)", "stroke-width": 1, opacity: 0 }, svg);
  const dots = SERIES.map((s) => el("circle", { r: 4.5, fill: s.c, stroke: "var(--panel)", "stroke-width": 2, opacity: 0 }, svg));

  svg.addEventListener("pointermove", (e) => {
    const b = svg.getBoundingClientRect(), sx = ((e.clientX - b.left) / b.width) * W;
    const n = Math.max(0, Math.min(N - 1, Math.round(((sx - M.l) / (W - M.l - M.r)) * (N - 1)))), r = ROWS[n];
    hover.setAttribute("x1", X(n)); hover.setAttribute("x2", X(n)); hover.setAttribute("opacity", 0.5);
    dots.forEach((d, j) => { d.setAttribute("cx", X(n)); d.setAttribute("cy", Y(r[SERIES[j].i])); d.setAttribute("opacity", 1); });
    tip.innerHTML = `${r[0]} · ${r[2]} samples<br>` + SERIES.slice().reverse().map((s) => `<i style="background:${s.c}"></i>${s.name} ${r[s.i].toFixed(1)} µs`).join("<br>");
    const px = (X(n) / W) * b.width;
    tip.style.left = (px > b.width * 0.6 ? px - tip.offsetWidth - 12 : px + 12) + "px"; tip.style.top = "8px"; tip.classList.add("on");
  });
  svg.addEventListener("pointerleave", () => { hover.setAttribute("opacity", 0); dots.forEach((d) => d.setAttribute("opacity", 0)); tip.classList.remove("on"); });

  const body = document.querySelector("#passiveTable tbody");
  if (body) body.innerHTML = ROWS.map((r) => `<tr><td>${r[0]}</td><td class="num">${r[2]}</td>` +
    [3, 4, 5, 6].map((i) => `<td class="num">${r[i].toFixed(1)}</td>`).join("") + `<td class="num">${r[7].toFixed(3)} %</td></tr>`).join("");
})();
