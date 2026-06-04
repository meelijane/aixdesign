/**
 * shaders/pattern.tsx
 * Programmatic generative background pattern for dark/light themes.
 *
 * Renders a slowly animated dot-field driven by smooth noise on a canvas.
 * The pattern is very subtle — designed to add depth without distraction.
 *
 * Props:
 *   color    — dot/line colour (CSS hex or rgb string)
 *   bg       — background colour
 *   opacity  — overall opacity of the pattern layer (default 0.4)
 *   style    — "dots" | "lines" | "grid" (default "dots")
 *   speed    — animation speed multiplier (default 1.0)
 */

import { useEffect, useRef } from "react";

export type PatternStyle = "dots" | "lines" | "grid";

export type PatternProps = {
  color?: string;
  bg?: string;
  opacity?: number;
  style?: PatternStyle;
  speed?: number;
};

// ── Smooth noise helpers ─────────────────────────────────────────────────────

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

// Simple 2D Perlin noise
const PERM = new Uint8Array(512);
(function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

function noise2d(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[X] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y];
  const bb = PERM[PERM[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

// ── Parse CSS colour to rgba ─────────────────────────────────────────────────

function parseColor(css: string): [number, number, number] {
  // Support #rrggbb and #rgb
  const hex = css.trim();
  if (hex.startsWith("#")) {
    if (hex.length === 4) {
      const r = parseInt(hex[1] + hex[1], 16);
      const g = parseInt(hex[2] + hex[2], 16);
      const b = parseInt(hex[3] + hex[3], 16);
      return [r, g, b];
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  return [200, 190, 170]; // fallback
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Pattern({
  color = "#c9a96e",
  bg = "#0f0e0c",
  opacity = 0.35,
  style = "dots",
  speed = 1.0,
}: PatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [cr, cg, cb] = parseColor(color);
    const [br, bg2, bb] = parseColor(bg);

    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function drawDots(now: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      // Fill background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const spacing = 28;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const bx = col * spacing;
          const by = row * spacing;

          // Use noise to displace and size each dot
          const nx = bx / w * 3 + now * 0.08 * speed;
          const ny = by / h * 3 + now * 0.05 * speed;
          const n = noise2d(nx, ny) * 0.5 + 0.5; // 0..1

          const dx = noise2d(nx + 100, ny) * spacing * 0.25;
          const dy = noise2d(nx, ny + 100) * spacing * 0.25;

          const x = bx + dx;
          const y = by + dy;
          const r = n * 1.8 + 0.3;
          const a = n * opacity;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
          ctx.fill();
        }
      }
    }

    function drawLines(now: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const spacing = 32;
      const rows = Math.ceil(h / spacing) + 2;

      for (let row = 0; row < rows; row++) {
        const y = row * spacing;
        ctx.beginPath();
        ctx.moveTo(0, y);

        const segments = Math.ceil(w / 8);
        for (let seg = 0; seg <= segments; seg++) {
          const x = seg * 8;
          const nx = x / w * 4 + now * 0.04 * speed;
          const ny = y / h * 4 + now * 0.03 * speed;
          const n = noise2d(nx, ny) * 0.5 + 0.5;
          const wy = y + (n - 0.5) * spacing * 0.6;
          ctx.lineTo(x, wy);
        }

        const rowNoise = noise2d(0, row * 0.5 + now * 0.02 * speed) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${rowNoise * opacity * 0.7})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    function drawGrid(now: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const spacing = 40;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      // Draw grid lines with noise-modulated opacity
      for (let col = 0; col < cols; col++) {
        const x = col * spacing;
        const n = noise2d(col * 0.3 + now * 0.03 * speed, 0) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${n * opacity * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let row = 0; row < rows; row++) {
        const y = row * spacing;
        const n = noise2d(0, row * 0.3 + now * 0.025 * speed) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${n * opacity * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw dots at intersections
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing;
          const y = row * spacing;
          const n = noise2d(col * 0.4 + now * 0.05 * speed, row * 0.4 + now * 0.04 * speed) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, n * 2 + 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${n * opacity})`;
          ctx.fill();
        }
      }
    }

    // Suppress unused variable warnings
    void br; void bg2; void bb;

    function draw(timestamp: number) {
      t = timestamp / 1000;
      if (style === "lines") drawLines(t);
      else if (style === "grid") drawGrid(t);
      else drawDots(t);
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, bg, opacity, style, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
