// ============================================================
// sketch.js — Presentation engine.
// Controls: → / Space = next, ← = prev, F = fullscreen, N = notes
// R = restart, G = go to slide number (type number then G)
// ============================================================

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  let currentSlide = 0;
  let slideFrame = 0;         // frames since this slide became active
  let globalFrame = 0;
  let notesVisible = false;
  let numberBuffer = '';      // for G-to-slide navigation
  let inTransition = false;

  // ── textmode.js init ───────────────────────────────────────
  const canvas = document.getElementById('tm-canvas');

  const t = textmode.create({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight,
    fontSize: 20,
    frameRate: 60,
  });

  // CSS fade overlay element — simpler and 100% reliable
  const fadeEl = document.getElementById('fade');

  // ── Helpers ────────────────────────────────────────────────

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function slide() { return SLIDES[currentSlide]; }

  function goTo(idx) {
    idx = clamp(idx, 0, SLIDES.length - 1);
    if (idx === currentSlide) return;
    if (inTransition) return; // ignore rapid presses during transition

    inTransition = true;
    fadeEl.classList.add('dark');

    // After fade-to-black completes (250ms), switch slide then fade back in
    setTimeout(() => {
      currentSlide = idx;
      slideFrame = 0;
      updateNotes();
      // Small extra delay so the new slide renders before fading back in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fadeEl.classList.remove('dark');
          // Allow next transition only after fade-in completes
          setTimeout(() => { inTransition = false; }, 260);
        });
      });
    }, 260);
  }

  function next() { goTo(currentSlide + 1); }
  function prev() { goTo(currentSlide - 1); }

  function updateNotes() {
    const el = document.getElementById('notes');
    const content = document.getElementById('notes-content');
    content.textContent = slide().notes || '(no notes for this slide)';
    el.classList.toggle('visible', notesVisible);
  }

  // ── Keyboard / clicker ────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prev();
        break;
      case 'f':
      case 'F':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        break;
      case 'n':
      case 'N':
        notesVisible = !notesVisible;
        updateNotes();
        break;
      case 'r':
      case 'R':
        if (e.shiftKey) {
          currentSlide = 0;
          slideFrame = 0;
          updateNotes();
        }
        break;
      case 'g':
      case 'G':
        if (numberBuffer.length > 0) {
          const idx = parseInt(numberBuffer, 10);
          if (!isNaN(idx)) goTo(clamp(idx, 0, SLIDES.length - 1));
          numberBuffer = '';
        }
        break;
      case 'Escape':
        numberBuffer = '';
        break;
      default:
        if (e.key >= '0' && e.key <= '9') {
          numberBuffer += e.key;
          // Auto-clear after 2s
          clearTimeout(window._numTimer);
          window._numTimer = setTimeout(() => { numberBuffer = ''; }, 2000);
        }
        break;
    }
  });

  // Hide the hint after 5s
  setTimeout(() => {
    const hint = document.getElementById('hint');
    if (hint) hint.classList.add('hidden');
  }, 5000);

  // Window resize
  t.windowResized(() => {
    t.resizeCanvas(window.innerWidth, window.innerHeight);
  });

  // ── Drawing helpers ────────────────────────────────────────

  // Draw a single string at grid position (col, row) from top-left
  // col/row are in grid coordinates relative to top-left corner
  function drawText(text, col, row, r, g, b) {
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const startX = -halfCols + col;
    const startY = -halfRows + row;

    for (let i = 0; i < text.length; i++) {
      t.push();
      t.translate(startX + i, startY, 0);
      t.char(text[i]);
      t.charColor(r, g, b);
      t.point();
      t.pop();
    }
  }

  // Draw a multi-line block of text, centred horizontally
  function drawTextCentred(lines, startRow, r, g, b, dimR, dimG, dimB) {
    const halfRows = Math.floor(t.grid.rows / 2);
    const halfCols = Math.floor(t.grid.cols / 2);

    lines.forEach((line, i) => {
      if (line === '') return;
      const col = Math.floor((t.grid.cols - line.length) / 2) - halfCols;
      const rowY = -halfRows + startRow + i;

      // Dim colour for lines starting with '['
      const isDim = line.startsWith('[');
      const fr = isDim ? (dimR || Math.floor(r * 0.4)) : r;
      const fg = isDim ? (dimG || Math.floor(g * 0.4)) : g;
      const fb = isDim ? (dimB || Math.floor(b * 0.4)) : b;

      for (let c = 0; c < line.length; c++) {
        t.push();
        t.translate(col + c, rowY, 0);
        t.char(line[c]);
        t.charColor(fr, fg, fb);
        t.point();
        t.pop();
      }
    });
  }

  // Draw a box border centred on the screen
  function drawBox(widthCells, heightCells, r, g, b) {
    const left  = -Math.floor(widthCells / 2);
    const right  = left + widthCells - 1;
    const top   = -Math.floor(heightCells / 2);
    const bottom = top + heightCells - 1;

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        let ch = '';
        if (x === left  && y === top)    ch = '┌';
        else if (x === right && y === top)    ch = '┐';
        else if (x === left  && y === bottom) ch = '└';
        else if (x === right && y === bottom) ch = '┘';
        else if (y === top   || y === bottom) ch = '─';
        else if (x === left  || x === right)  ch = '│';
        else continue;

        t.push();
        t.translate(x, y, 0);
        t.char(ch);
        t.charColor(r, g, b);
        t.point();
        t.pop();
      }
    }
  }

  // Draw a horizontal rule
  function drawHRule(row, r, g, b) {
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const y = -halfRows + row;
    for (let x = -halfCols + 2; x <= halfCols - 2; x++) {
      t.push();
      t.translate(x, y, 0);
      t.char('─');
      t.charColor(r, g, b);
      t.point();
      t.pop();
    }
  }

  // ── Slide renderers ────────────────────────────────────────

  function renderHero(s) {
    const [ar, ag, ab] = s.accent;
    const rows = t.grid.rows;

    // Big title — split on \n, centred, bright accent colour
    const titleLines = s.title.split('\n');
    const titleStartRow = Math.floor(rows / 2) - 4 - Math.floor(titleLines.length / 2);
    drawTextCentred(titleLines, titleStartRow, ar, ag, ab);

    // Horizontal rule below title
    const ruleRow = titleStartRow + titleLines.length + 1;
    drawHRule(ruleRow, Math.floor(ar * 0.4), Math.floor(ag * 0.4), Math.floor(ab * 0.4));

    // Subtitle
    if (s.subtitle) {
      drawTextCentred([s.subtitle], ruleRow + 2, 200, 200, 200);
    }

    // Venue line — dimmer
    if (s.venue) {
      drawTextCentred([s.venue], ruleRow + 4, 100, 100, 100);
    }
  }

  function renderContent(s) {
    const [ar, ag, ab] = s.accent;
    const rows = t.grid.rows;
    const cols = t.grid.cols;

    // Slide label top-left
    if (s.label) {
      drawText(`[ ${s.label} ]`, 2, 1, Math.floor(ar * 0.6), Math.floor(ag * 0.6), Math.floor(ab * 0.6));
    }

    // Title — upper third, left-aligned with margin
    const titleLines = s.title.split('\n');
    const margin = 4;
    const titleRow = Math.floor(rows * 0.2);

    titleLines.forEach((line, i) => {
      drawText(line, margin, titleRow + i, ar, ag, ab);
    });

    // Rule below title
    drawHRule(titleRow + titleLines.length + 1,
      Math.floor(ar * 0.3), Math.floor(ag * 0.3), Math.floor(ab * 0.3));

    // Body text — with typewriter reveal based on slideFrame
    const bodyStartRow = titleRow + titleLines.length + 3;
    const revealCharsPerFrame = 3;
    const totalBodyChars = (s.body || []).join('').length;
    const revealedChars = Math.min(totalBodyChars, slideFrame * revealCharsPerFrame);

    let charCount = 0;
    (s.body || []).forEach((line, lineIdx) => {
      const lineRow = bodyStartRow + lineIdx;
      if (line === '') return;

      let visibleLine = '';
      for (let c = 0; c < line.length; c++) {
        if (charCount < revealedChars) {
          visibleLine += line[c];
          charCount++;
        }
      }
      if (visibleLine.length > 0) {
        drawText(visibleLine, margin, lineRow, 220, 220, 220);
      }
      charCount += (line.length - visibleLine.length);
    });

    // Cursor blink at end of typewriter
    if (charCount >= totalBodyChars && Math.floor(slideFrame / 30) % 2 === 0) {
      const lastBodyLine = (s.body || []).length - 1;
      const lastLine = (s.body || [])[lastBodyLine] || '';
      drawText('▌', margin + lastLine.length + 1, bodyStartRow + lastBodyLine, ar, ag, ab);
    }
  }

  // ── Progress indicator ─────────────────────────────────────

  function renderProgress() {
    const total = SLIDES.length;
    const halfCols = Math.floor(t.grid.cols / 2);
    const halfRows = Math.floor(t.grid.rows / 2);
    const startX = -halfCols + 2;
    const y = halfRows - 2;
    const [ar, ag, ab] = slide().accent;

    for (let i = 0; i < total; i++) {
      const ch = i < currentSlide ? '█' : i === currentSlide ? '▶' : '·';
      const r = i <= currentSlide ? Math.floor(ar * 0.7) : 40;
      const g = i <= currentSlide ? Math.floor(ag * 0.7) : 40;
      const b = i <= currentSlide ? Math.floor(ab * 0.7) : 40;

      t.push();
      t.translate(startX + i * 2, y, 0);
      t.char(ch);
      t.charColor(r, g, b);
      t.point();
      t.pop();
    }

    // Slide number right side
    const label = `${currentSlide + 1}/${total}`;
    drawText(label, t.grid.cols - label.length - 2, t.grid.rows - 2, 60, 60, 60);
  }

  // Transitions handled via CSS #fade div — see goTo()

  // ── Main draw loop ─────────────────────────────────────────

  t.draw(() => {
    globalFrame++;
    slideFrame++;

    // Clear
    t.background(0, 0, 0);

    const s = slide();
    const accent = s.accent;

    // 1. Animated background
    const bgFn = Backgrounds[s.background] || Backgrounds.wave;
    bgFn(t, globalFrame, accent);

    // 2. Slide content
    if (s.type === 'hero') {
      renderHero(s);
    } else if (s.type === 'content') {
      renderContent(s);
    }

    // 3. Progress bar
    renderProgress();

  });

  // ── Initial notes update ───────────────────────────────────
  updateNotes();

})();
