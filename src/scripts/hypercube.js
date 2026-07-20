/* ================================================================
   THE HYPERCUBE — a real tesseract: 16 vertices, 32 edges,
   rotating in 4-space (xw & yz planes), projected 4D→3D→2D.
   Exposes window.__cube for scroll choreography.
   ================================================================ */
(() => {
  const canvas = document.getElementById("cube-stage");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, DPR;
  const resize = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  };
  resize();
  addEventListener("resize", resize);

  // vertices: all (±1,±1,±1,±1)
  const V = [];
  for (let i = 0; i < 16; i++) V.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
  // edges: differ in exactly one coordinate
  const E = [];
  for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) {
    let d = 0;
    for (let k = 0; k < 4; k++) if (V[i][k] !== V[j][k]) d++;
    if (d === 1) E.push([i, j]);
  }

  const state = {
    ax: 0, ay: 0,
    mx: 0, my: 0,
    cam: 1,
    hue: 0,
    cx: 0.66, cy: 0.44,
    scale: 0.16,
  };

  addEventListener("pointermove", (e) => {
    state.mx = (e.clientX / innerWidth - 0.5) * 0.9;
    state.my = (e.clientY / innerHeight - 0.5) * 0.9;
  }, { passive: true });

  const ACC = [99, 230, 200], ACC2 = [255, 90, 46];
  const lerp = (a, b, t) => a + (b - a) * t;
  const col = (t, alpha) =>
    `rgba(${Math.round(lerp(ACC[0], ACC2[0], t))},${Math.round(lerp(ACC[1], ACC2[1], t))},${Math.round(lerp(ACC[2], ACC2[2], t))},${alpha})`;

  let t0 = performance.now();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function frame(now) {
    const dt = Math.min((now - t0) / 1000, 0.05);
    t0 = now;
    if (!reduce) {
      state.ax += dt * 0.21;
      state.ay += dt * 0.13;
    }
    const rx = state.ax + state.mx;
    const ry = state.ay + state.my;

    ctx.clearRect(0, 0, W, H);

    const S = Math.min(W, H) * state.scale * state.cam;
    const CX = W * state.cx, CY = H * state.cy;
    const pts = [];

    for (const [x0, y0, z0, w0] of V) {
      let x = x0 * Math.cos(rx) - w0 * Math.sin(rx);
      let w = x0 * Math.sin(rx) + w0 * Math.cos(rx);
      let y = y0 * Math.cos(ry) - z0 * Math.sin(ry);
      let z = y0 * Math.sin(ry) + z0 * Math.cos(ry);
      const d4 = 2.4;
      const s4 = d4 / (d4 - w);
      x *= s4; y *= s4; z *= s4;
      const d3 = 3.2;
      const s3 = d3 / (d3 - z);
      pts.push([CX + x * s3 * S, CY + y * s3 * S, z]);
    }

    const sorted = E.map(([a, b]) => ({ a, b, z: (pts[a][2] + pts[b][2]) / 2 }))
                    .sort((p, q) => q.z - p.z);
    for (const { a, b, z } of sorted) {
      const depth = 1 - (z + 1.6) / 3.2;
      const alpha = 0.12 + depth * 0.55;
      ctx.strokeStyle = col(state.hue, alpha);
      ctx.lineWidth = (0.8 + depth * 1.8) * DPR;
      ctx.shadowColor = col(state.hue, 0.8);
      ctx.shadowBlur = 14 * depth * DPR;
      ctx.beginPath();
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    for (const [px, py, z] of pts) {
      const depth = 1 - (z + 1.6) / 3.2;
      ctx.fillStyle = col(state.hue, 0.35 + depth * 0.6);
      ctx.beginPath();
      ctx.arc(px, py, (1.4 + depth * 2.2) * DPR, 0, 7);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.__cube = state;
})();
