// Saturation evidence (E3), drawn in SVG from data/saturation_*.csv:
//  · strata: frame-period quantiles q50, q95, q99 in units of T0 per occupancy stratum;
//  · run: two panels on one time axis — the dimensionless loads (occupancy s, accelerator duty,
//    host load) above, the frame-period quantiles below — with a run selector and one crosshair.
// The tables under each chart are filled from the same rows. No dependencies.
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg", T0 = 1000 / 60;
  const el = (tag, at, parent) => { const n = document.createElementNS(NS, tag); for (const a in at) n.setAttribute(a, at[a]); parent && parent.appendChild(n); return n; };
  const csv = (txt) => { const [h, ...r] = txt.trim().split(/\r?\n/); const k = h.split(","); return r.map((l) => { const v = l.split(","); const o = {}; k.forEach((c, i) => (o[c] = isNaN(+v[i]) || v[i] === "" ? v[i] : +v[i])); return o; }); };
  const get = (f) => fetch("../data/" + f).then((r) => r.text()).then(csv);
  const place = (tip, box, px) => { const b = box.getBoundingClientRect(); tip.style.left = (px > b.width * 0.6 ? px - tip.offsetWidth - 12 : px + 12) + "px"; tip.style.top = "8px"; tip.classList.add("on"); };

  // ---- strata ---------------------------------------------------------------
  const sbox = document.getElementById("strataChart");
  if (sbox) get("saturation_strata.csv").then((rows) => {
    const Q = [{ k: "frame_p50_ms", name: "q50", c: "var(--s1)" }, { k: "frame_p95_ms", name: "q95", c: "var(--s2)" }, { k: "frame_p99_ms", name: "q99", c: "var(--s4)" }];
    const W = 720, H = 300, M = { l: 44, r: 20, t: 14, b: 44 }, YMAX = 9, N = rows.length;
    const band = (W - M.l - M.r) / N, X = (n) => M.l + band * (n + 0.5), Y = (v) => H - M.b - (Math.min(v, YMAX) / YMAX) * (H - M.t - M.b);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Frame-period quantiles in units of the presentation period, per occupancy stratum of the fast domain" }, sbox);
    const tip = document.createElement("div"); tip.className = "tip"; sbox.appendChild(tip);
    const axis = el("g", { class: "axis" }, svg);
    for (let v = 0; v <= YMAX; v += 3) {
      el("line", { class: "gridline", x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v) }, axis);
      el("text", { x: M.l - 8, y: Y(v) + 4, "text-anchor": "end" }, axis).textContent = v;
    }
    el("text", { x: M.l + 6, y: M.t + 14, "text-anchor": "start" }, axis).textContent = "τ/T₀";
    rows.forEach((r, n) => {
      el("text", { x: X(n), y: H - M.b + 18, "text-anchor": "middle" }, axis).textContent = `${r.occ_lo}–${r.occ_hi}`;
      if (n === N - 1) el("text", { x: X(n), y: H - M.b + 34, "text-anchor": "middle" }, axis).textContent = "s = σ/C𝒱 →";
    });
    // the bound of Observation 4 over the strata s ≥ 0.5
    el("line", { x1: X(1) - band / 2, x2: W - M.r, y1: Y(4.85), y2: Y(4.85), stroke: "var(--muted)", "stroke-width": 1, "stroke-dasharray": "3 4" }, svg);
    el("text", { class: "lbl", x: W - M.r - 4, y: Y(4.85) - 6, "text-anchor": "end" }, svg).textContent = "q99 ≤ 4.85 for s ≥ 0.5";
    const marks = rows.map((r, n) => {
      const g = el("g", {}, svg), v = Q.map((q) => r[q.k] / T0);
      el("line", { x1: X(n), x2: X(n), y1: Y(v[0]), y2: Y(v[2]), stroke: "var(--grid)", "stroke-width": 6, "stroke-linecap": "round" }, g);
      Q.forEach((q, j) => el("circle", { cx: X(n), cy: Y(v[j]), r: 5, fill: q.c, stroke: "var(--panel)", "stroke-width": 2 }, g));
      el("rect", { x: X(n) - band / 2, y: M.t, width: band, height: H - M.t - M.b, fill: "transparent" }, g);
      return g;
    });
    marks.forEach((g, n) => {
      g.addEventListener("pointerenter", () => {
        const r = rows[n];
        tip.innerHTML = `s ∈ [${r.occ_lo}, ${r.occ_hi}) · ${r.frames.toLocaleString("en")} frames<br>` +
          Q.slice().reverse().map((q) => `<i style="background:${q.c}"></i>${q.name} ${(r[q.k] / T0).toFixed(2)} T₀`).join("<br>") +
          `<br>host ${r.host_load_mean.toFixed(2)} · duty ${r.acc_load_mean.toFixed(2)}`;
        place(tip, sbox, (X(n) / W) * sbox.getBoundingClientRect().width);
      });
      g.addEventListener("pointerleave", () => tip.classList.remove("on"));
    });
    const body = document.querySelector("#strataTable tbody");
    if (body) body.innerHTML = rows.map((r) => `<tr><td>[${r.occ_lo}, ${r.occ_hi}${r.occ_hi === 1 ? "]" : ")"}</td><td class="num">${r.frames.toLocaleString("en")}</td>` +
      ["frame_p50_ms", "frame_p95_ms", "frame_p99_ms", "frame_p999_ms"].map((k) => `<td class="num">${(r[k] / T0).toFixed(2)}</td>`).join("") +
      `<td class="num">${r.frames_over_50ms_pct.toFixed(2)} %</td><td class="num">${r.host_load_mean.toFixed(2)}</td></tr>`).join("");
  });

  // ---- run ------------------------------------------------------------------
  const rbox = document.getElementById("runChart"), pick = document.getElementById("runPick");
  if (rbox) get("saturation_windows_15s.csv").then((all) => {
    const runs = [...new Set(all.map((r) => r.run))];
    const LOAD = [{ k: "occ_mean", name: "s = σ/C𝒱", c: "var(--c1)" }, { k: "acc_duty_mean", name: "accelerator duty", c: "var(--c2)" }, { k: "host_load_mean", name: "host load", c: "var(--c3)" }];
    const FR = [{ k: "q50_T0", name: "q50", c: "var(--s1)" }, { k: "q99_T0", name: "q99", c: "var(--s4)" }];
    const W = 720, H = 420, M = { l: 44, r: 20, t: 14, b: 34 }, GAP = 30, PH = (H - M.t - M.b - GAP) / 2, FMAX = 12;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "One run in 15-second windows: occupancy, accelerator duty and host load above; frame-period quantiles below" }, rbox);
    const tip = document.createElement("div"); tip.className = "tip"; rbox.appendChild(tip);
    const Y1 = (v) => M.t + PH - v * PH, Y2 = (v) => M.t + PH + GAP + PH - (Math.min(v, FMAX) / FMAX) * PH;
    const axis = el("g", { class: "axis" }, svg);
    [0, 0.5, 1].forEach((v) => { el("line", { class: "gridline", x1: M.l, x2: W - M.r, y1: Y1(v), y2: Y1(v) }, axis); el("text", { x: M.l - 8, y: Y1(v) + 4, "text-anchor": "end" }, axis).textContent = v; });
    [0, 4, 8, 12].forEach((v) => { el("line", { class: "gridline", x1: M.l, x2: W - M.r, y1: Y2(v), y2: Y2(v) }, axis); el("text", { x: M.l - 8, y: Y2(v) + 4, "text-anchor": "end" }, axis).textContent = v; });
    el("text", { class: "lbl", x: W - M.r, y: Y1(1) - 4, "text-anchor": "end" }, svg).textContent = "loads, dimensionless";
    el("text", { class: "lbl", x: W - M.r, y: Y2(FMAX) - 4, "text-anchor": "end" }, svg).textContent = "frame period, τ/T₀ (▲ off scale)";
    const xt = el("g", { class: "axis" }, svg), layer = el("g", {}, svg);
    const hover = el("line", { y1: M.t, y2: H - M.b, stroke: "var(--ink2)", "stroke-width": 1, opacity: 0 }, svg);
    let rows = [], X = () => 0;

    function draw(run) {
      rows = all.filter((r) => r.run === run);
      const TM = Math.max(1, rows[rows.length - 1].t_min);
      X = (t) => M.l + (t / TM) * (W - M.l - M.r);
      xt.innerHTML = ""; layer.innerHTML = "";
      const step = TM > 40 ? 10 : TM > 12 ? 2 : 1;
      for (let t = 0; t <= TM + 1e-9; t += step) el("text", { x: X(t), y: H - M.b + 18, "text-anchor": "middle" }, xt).textContent = t;
      el("text", { x: W - M.r, y: H - 4, "text-anchor": "end" }, xt).textContent = "minutes";
      el("rect", { x: M.l, y: Y1(1), width: W - M.l - M.r, height: Y1(0.95) - Y1(1), fill: "var(--c1)", opacity: 0.08 }, layer);
      const line = (k, Y, c) => el("path", { d: rows.map((r, n) => (n ? "L" : "M") + X(r.t_min).toFixed(1) + "," + Y(r[k]).toFixed(1)).join(""), fill: "none", stroke: c, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, layer);
      LOAD.forEach((s) => line(s.k, Y1, s.c));
      FR.forEach((s) => line(s.k, Y2, s.c));
      rows.forEach((r) => { if (r.q99_T0 > FMAX) el("path", { d: `M${X(r.t_min) - 4},${Y2(FMAX) + 1}l4,-7l4,7z`, fill: "var(--s4)" }, layer); });
      if (pick) pick.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.run === run));
      const sum = document.getElementById("runOut");
      if (sum) {
        const sat = rows.filter((r) => r.occ_mean >= 0.95), fr = rows.reduce((a, r) => a + r.frames, 0);
        sum.innerHTML = `<b>${run}</b> · ${rows.length} windows · ${fr.toLocaleString("en")} frames · ` +
          `${sat.length} windows at s ≥ 0.95 · mean host load ${(rows.reduce((a, r) => a + r.host_load_mean, 0) / rows.length).toFixed(2)}`;
      }
      const body = document.querySelector("#runTable tbody");
      if (body) body.innerHTML = rows.map((r) => `<tr><td class="num">${r.t_min.toFixed(2)}</td><td class="num">${r.frames}</td>` +
        ["occ_mean", "acc_duty_mean", "host_load_mean", "q50_T0", "q99_T0"].map((k) => `<td class="num">${r[k].toFixed(2)}</td>`).join("") + "</tr>").join("");
    }

    if (pick) {
      pick.innerHTML = runs.map((r) => `<button class="pill" type="button" data-run="${r}">${r.slice(5)}</button>`).join("");
      pick.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) draw(b.dataset.run); });
    }
    svg.addEventListener("pointermove", (e) => {
      if (!rows.length) return;
      const b = svg.getBoundingClientRect(), sx = ((e.clientX - b.left) / b.width) * W;
      let n = 0, d = Infinity; rows.forEach((r, i) => { const dd = Math.abs(X(r.t_min) - sx); if (dd < d) { d = dd; n = i; } });
      const r = rows[n];
      hover.setAttribute("x1", X(r.t_min)); hover.setAttribute("x2", X(r.t_min)); hover.setAttribute("opacity", 0.5);
      tip.innerHTML = `t = ${r.t_min.toFixed(2)} min · ${r.frames} frames<br>` +
        LOAD.map((s) => `<i style="background:${s.c}"></i>${s.name} ${r[s.k].toFixed(2)}`).join("<br>") + "<br>" +
        FR.slice().reverse().map((s) => `<i style="background:${s.c}"></i>${s.name} ${r[s.k].toFixed(2)} T₀`).join("<br>");
      place(tip, rbox, (X(r.t_min) / W) * b.width);
    });
    svg.addEventListener("pointerleave", () => { hover.setAttribute("opacity", 0); tip.classList.remove("on"); });
    draw(runs.includes("2026-10-23 11:41") ? "2026-10-23 11:41" : runs[0]);
  });

  // ---- sessions table ---------------------------------------------------------
  const sess = document.querySelector("#sessionTable tbody");
  if (sess) get("saturation_sessions.csv").then((rows) => {
    sess.innerHTML = rows.map((r) => `<tr><td>${r.date} ${r.start_local}</td><td class="num">${r.frames.toLocaleString("en")}</td><td class="num">${r.minutes.toFixed(1)}</td>` +
      `<td class="num">${r.occ_max.toFixed(4)}</td><td class="num">${(r.frame_p50_ms / T0).toFixed(2)}</td><td class="num">${(r.frame_p99_ms / T0).toFixed(2)}</td>` +
      `<td class="num">${(r.frame_p999_ms / T0).toFixed(1)}</td><td class="num">${r.host_load_mean_duty_ge_090 === "" || r.host_load_mean_duty_ge_090 === undefined ? "—" : (+r.host_load_mean_duty_ge_090).toFixed(2)}</td></tr>`).join("");
  });
})();
