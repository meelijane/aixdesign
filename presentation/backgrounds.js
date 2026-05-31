// ============================================================
// backgrounds.js — Animated ASCII background effects.
// Each function receives (t, frameCount, accent) and draws
// into the textmode canvas. Keep them stateless where possible.
// ============================================================

const Backgrounds = {

  // Rippling concentric wave field — good for hero/close
  wave(t, frame, accent) {
    const cx = 0, cy = 0;
    const chars = ['·', '∘', '○', '◌', '◎', '●', '+', '×'];
    const speed = frame * 0.04;

    for (let y = -Math.floor(t.grid.rows / 2); y <= Math.floor(t.grid.rows / 2); y++) {
      for (let x = -Math.floor(t.grid.cols / 2); x <= Math.floor(t.grid.cols / 2); x++) {
        const dist = Math.sqrt(x * x + y * y);
        const wave = Math.sin(dist * 0.4 - speed);
        const norm = (wave + 1) / 2; // 0..1

        const charIdx = Math.floor(norm * (chars.length - 1));
        const brightness = Math.floor(30 + norm * 80);

        // Blend from dark accent colour to bright
        const r = Math.floor((accent[0] / 255) * brightness);
        const g = Math.floor((accent[1] / 255) * brightness);
        const b = Math.floor((accent[2] / 255) * brightness);

        t.push();
        t.translate(x, y, 0);
        t.char(chars[charIdx]);
        t.charColor(r, g, b);
        t.point();
        t.pop();
      }
    }
  },

  // Matrix-style vertical rain — good for 'pivot'
  rain(t, frame, accent) {
    const cols = t.grid.cols;
    const rows = t.grid.rows;
    const halfCols = Math.floor(cols / 2);
    const halfRows = Math.floor(rows / 2);
    const chars = ['0', '1', '|', '/', '\\', '─', '│', '┼', '·', ' ', ' ', ' '];
    const speed = frame * 0.15;

    for (let x = -halfCols; x <= halfCols; x++) {
      for (let y = -halfRows; y <= halfRows; y++) {
        // Each column gets a phase offset based on x
        const phase = (x * 7.3 + speed) % rows;
        const distFromHead = ((y + halfRows - phase) % rows + rows) % rows;
        const norm = 1 - (distFromHead / rows);
        const bright = norm * norm; // quadratic falloff

        if (bright < 0.05) continue;

        const charIdx = Math.floor(Math.abs(Math.sin(x * 13.7 + y * 3.1 + frame * 0.1)) * chars.length) % chars.length;
        const r = Math.floor(accent[0] * bright * 0.6);
        const g = Math.floor(accent[1] * bright * 0.6);
        const b = Math.floor(accent[2] * bright * 0.6);

        t.push();
        t.translate(x, y, 0);
        t.char(chars[charIdx]);
        t.charColor(r, g, b);
        t.point();
        t.pop();
      }
    }
  },

  // Perlin-ish noise field — organic, good for 'customers'
  noise(t, frame, accent) {
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const chars = ['░', '▒', '▓', '█', '▓', '▒', '░', '·', ' '];
    const speed = frame * 0.02;

    for (let y = -halfRows; y <= halfRows; y++) {
      for (let x = -halfCols; x <= halfCols; x++) {
        // Layered sine waves approximate noise
        const n = Math.sin(x * 0.3 + speed) * Math.cos(y * 0.4 + speed * 0.7)
                + Math.sin(x * 0.17 - speed * 0.5) * Math.cos(y * 0.22 + speed)
                + Math.sin((x + y) * 0.25 + speed * 1.3) * 0.5;
        const norm = (n / 2.5 + 1) / 2; // 0..1

        const charIdx = Math.floor(norm * (chars.length - 1));
        const brightness = Math.floor(20 + norm * 70);
        const r = Math.floor((accent[0] / 255) * brightness);
        const g = Math.floor((accent[1] / 255) * brightness);
        const b = Math.floor((accent[2] / 255) * brightness);

        t.push();
        t.translate(x, y, 0);
        t.char(chars[charIdx]);
        t.charColor(r, g, b);
        t.point();
        t.pop();
      }
    }
  },

  // Expanding grid pattern — structured, good for 'upskilling'
  grid(t, frame, accent) {
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const speed = frame * 0.03;
    const gridChars = ['·', '+', '┼', '╬', '┼', '+', '·'];

    for (let y = -halfRows; y <= halfRows; y++) {
      for (let x = -halfCols; x <= halfCols; x++) {
        const isGridX = x % 4 === 0;
        const isGridY = y % 2 === 0;

        let norm, ch;
        if (isGridX && isGridY) {
          norm = (Math.sin(x * 0.2 + y * 0.3 + speed) + 1) / 2;
          const charIdx = Math.floor(norm * (gridChars.length - 1));
          ch = gridChars[charIdx];
        } else if (isGridX || isGridY) {
          norm = (Math.sin(x * 0.15 - y * 0.1 + speed * 0.7) + 1) / 2 * 0.5;
          ch = norm > 0.2 ? '─' : '│';
        } else {
          norm = (Math.sin(x * 0.4 + y * 0.4 + speed * 0.3) + 1) / 2 * 0.2;
          ch = '·';
        }

        const brightness = Math.floor(15 + norm * 65);
        const r = Math.floor((accent[0] / 255) * brightness);
        const g = Math.floor((accent[1] / 255) * brightness);
        const b = Math.floor((accent[2] / 255) * brightness);

        t.push();
        t.translate(x, y, 0);
        t.char(ch);
        t.charColor(r, g, b);
        t.point();
        t.pop();
      }
    }
  },

  // Glitch / static — chaotic, good for 'hard parts'
  glitch(t, frame, accent) {
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const glitchChars = ['█', '▓', '▒', '░', '╳', '×', '!', '?', '#', '%', '&', '|', '/', '\\', ' ', ' ', ' ', ' '];
    const slowFrame = Math.floor(frame / 3);

    for (let y = -halfRows; y <= halfRows; y++) {
      for (let x = -halfCols; x <= halfCols; x++) {
        // Sparse — most cells empty
        const seed = Math.abs(Math.sin(x * 127.1 + y * 311.7 + slowFrame * 74.5));
        if (seed > 0.12) continue;

        const charIdx = Math.floor(seed * glitchChars.length * 8) % glitchChars.length;
        const brightness = Math.floor(40 + seed * 180);

        // Occasional white flashes
        const isWhite = seed < 0.02;
        const r = isWhite ? brightness : Math.floor((accent[0] / 255) * brightness);
        const g = isWhite ? brightness : Math.floor((accent[1] / 255) * brightness);
        const b = isWhite ? brightness : Math.floor((accent[2] / 255) * brightness);

        t.push();
        t.translate(x, y, 0);
        t.char(glitchChars[charIdx]);
        t.charColor(r, g, b);
        t.point();
        t.pop();
      }
    }
  },

  // Radiating bloom — hopeful, good for 'potential' and close
  bloom(t, frame, accent) {
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const chars = ['·', '∘', '✦', '✧', '★', '✦', '∘', '·'];
    const speed = frame * 0.025;
    const maxDist = Math.sqrt(halfCols * halfCols + halfRows * halfRows);

    for (let y = -halfRows; y <= halfRows; y++) {
      for (let x = -halfCols; x <= halfCols; x++) {
        const dist = Math.sqrt(x * x + y * y * 2.5); // stretch horizontally
        const distNorm = dist / maxDist;

        const pulse = Math.sin(distNorm * 8 - speed) * 0.5
                    + Math.sin(distNorm * 3 - speed * 0.6) * 0.3
                    + Math.sin(speed * 0.4) * 0.2;
        const norm = Math.max(0, Math.min(1, (pulse + 1) / 2));
        const brightness = Math.floor(10 + norm * 100);

        if (brightness < 15) continue;

        const charIdx = Math.floor(norm * (chars.length - 1));

        // Shift hue across the grid — accent bleeds into white at center
        const centerWeight = 1 - distNorm;
        const r = Math.floor(accent[0] * (1 - centerWeight * 0.5) * (brightness / 255) + centerWeight * brightness * 0.5);
        const g = Math.floor(accent[1] * (1 - centerWeight * 0.5) * (brightness / 255) + centerWeight * brightness * 0.5);
        const b = Math.floor(accent[2] * (1 - centerWeight * 0.5) * (brightness / 255) + centerWeight * brightness * 0.5);

        t.push();
        t.translate(x, y, 0);
        t.char(chars[charIdx]);
        t.charColor(
          Math.min(255, r),
          Math.min(255, g),
          Math.min(255, b)
        );
        t.point();
        t.pop();
      }
    }
  },

};
