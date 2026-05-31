// ── Presentation Engine ────────────────────────────────────────────────────
// Handles: rendering slides, navigation, fullscreen, speaker notes,
//          animated background, keyboard + clicker input
// ──────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────────────────
  let current = 0;
  let inTransition = false;

  const deck       = document.getElementById('deck');
  const fadeEl     = document.getElementById('fade');
  const progressEl = document.getElementById('progress');
  const notesEl    = document.getElementById('notes');
  const notesContent = document.getElementById('notes-content');
  const hintEl     = document.getElementById('hint');

  // ── Build slides ─────────────────────────────────────────────────────────

  function buildSlides() {
    deck.innerHTML = '';
    SLIDES.forEach((slide, i) => {
      const el = document.createElement('div');
      el.className = `slide slide-${slide.type}`;
      el.id = `slide-${slide.id}`;
      el.dataset.index = i;
      el.innerHTML = renderSlide(slide);
      deck.appendChild(el);
      renderBg(slide, el);
    });
  }

  // ── Broadcast state to speaker notes window ────────────────
  function broadcastState() {
    try {
      localStorage.setItem('presentation-state', JSON.stringify({
        current: current,
        total:   SLIDES.length,
        slides:  SLIDES
      }));
    } catch(e) {}
  }

  // ── Render background image for a slide ────────────────────
  function renderBg(slide, el) {
    if (!slide.bg) return;
    const div = document.createElement('div');
    div.className = 'slide-bg-img';
    div.style.backgroundImage = `url('${slide.bg.src}')`;
    // For animated GIFs, use an <img> tag instead so animation plays
    if (slide.bg.animated) {
      div.style.backgroundImage = 'none';
      const img = document.createElement('img');
      img.src = slide.bg.src;
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:1;';
      div.appendChild(img);
    }
    el.insertBefore(div, el.firstChild);
  }

  function renderSlide(slide) {
    switch (slide.type) {

      case 'hero':
        return `
          <div class="ascii-deco reveal">${slide.content.deco || ''}</div>
          <div class="hero-title reveal">
            ${slide.content.title.map(line =>
              `<div class="title-line">${line}</div>`
            ).join('')}
          </div>
          <div class="hero-sub reveal">${(slide.content.sub || '').replace(/\n/g, '<br>')}</div>
        `;

      case 'section':
        return `
          <div class="section-label reveal">${slide.label?.num || ''}</div>
          <div class="section-title reveal">${slide.content.title}</div>
        `;

      case 'quote':
        return `
          ${slide.label ? `<div class="label reveal"><span class="num">${slide.label.num}</span>${slide.label.text}</div>` : ''}
          <div class="rule reveal"></div>
          <blockquote class="quote reveal">${slide.content.quote}</blockquote>
          ${slide.content.body ? `<p class="body reveal">${slide.content.body.replace(/\n/g, '<br>')}</p>` : ''}
        `;

      case 'body':
        return `
          ${slide.label ? `<div class="label reveal"><span class="num">${slide.label.num}</span>${slide.label.text}</div>` : ''}
          <div class="rule reveal"></div>
          <h2 class="slide-heading reveal">${slide.content.heading}</h2>
          <p class="body reveal">${slide.content.body.replace(/\n/g, '<br>')}</p>
        `;

      case 'bullets':
        return `
          ${slide.label ? `<div class="label reveal"><span class="num">${slide.label.num}</span>${slide.label.text}</div>` : ''}
          <div class="rule reveal"></div>
          <h2 class="slide-heading reveal">${slide.content.heading}</h2>
          <ul class="list reveal">
            ${slide.content.bullets.map(b =>
              `<li class="${b.colour || ''}">${b.text}</li>`
            ).join('')}
          </ul>
        `;

      default:
        return `<div class="body">${JSON.stringify(slide.content)}</div>`;
    }
  }

  // ── Progress pips ────────────────────────────────────────────────────────

  function buildProgress() {
    progressEl.innerHTML = SLIDES.map((_, i) =>
      `<div class="pip" data-index="${i}"></div>`
    ).join('');
    progressEl.querySelectorAll('.pip').forEach(pip => {
      pip.addEventListener('click', () => goTo(+pip.dataset.index));
    });
  }

  function updateProgress() {
    progressEl.querySelectorAll('.pip').forEach((pip, i) => {
      pip.classList.toggle('active', i === current);
    });
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  function goTo(idx) {
    idx = Math.max(0, Math.min(SLIDES.length - 1, idx));
    if (idx === current || inTransition) return;

    inTransition = true;
    fadeEl.classList.add('dark');

    setTimeout(() => {
      // Deactivate current
      const currentEl = deck.querySelector('.slide.active');
      if (currentEl) currentEl.classList.remove('active');

      current = idx;
      updateProgress();
      updateNotes();
      broadcastState();

      // Activate next — wait one frame so CSS transition triggers cleanly
      requestAnimationFrame(() => {
        const nextEl = deck.querySelectorAll('.slide')[current];
        if (nextEl) nextEl.classList.add('active');

        requestAnimationFrame(() => {
          fadeEl.classList.remove('dark');
          setTimeout(() => { inTransition = false; }, 320);
        });
      });
    }, 320);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // ── Speaker notes ─────────────────────────────────────────────────────────

  function updateNotes() {
    const slide = SLIDES[current];
    notesContent.textContent = slide?.notes || '—';
  }

  function toggleNotes() {
    notesEl.classList.toggle('visible');
  }

  // ── Fullscreen ────────────────────────────────────────────────────────────

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // ── Keyboard + clicker ────────────────────────────────────────────────────
  // Clickers typically send: ArrowRight (next), ArrowLeft (prev),
  //   sometimes PageDown/PageUp, F5 (start), Escape (end), or b (black screen)

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        window.open('notes.html', 'speaker-notes', 'width=900,height=700');
        break;
      case 'n':
      case 'N':
        toggleNotes();
        break;
      case 'Escape':
        if (notesEl.classList.contains('visible')) {
          notesEl.classList.remove('visible');
        }
        break;
      // Go to slide number: type digits then Enter
      default:
        break;
    }
  });

  // Hide hint after 5s
  setTimeout(() => hintEl.classList.add('hidden'), 5000);

  // ── Animated ASCII background ─────────────────────────────────────────────

  function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    const CHARS = '·∘○◦⊙⊚◎❋✦✧⋆∗※⁕⊛░▒▓█▄▀■□▪▫◆◇◈'.split('');
    const COLOURS = ['#ff4dff', '#4dffd2', '#ffd24d', '#4d8fff'];

    let cols, rows, cells;
    const FONT_SIZE = 16;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width  / FONT_SIZE * 1.6);
      rows = Math.ceil(canvas.height / FONT_SIZE);
      cells = Array.from({ length: cols * rows }, () => ({
        char:    CHARS[Math.floor(Math.random() * CHARS.length)],
        colour:  COLOURS[Math.floor(Math.random() * COLOURS.length)],
        brightness: Math.random(),
        speed:   0.001 + Math.random() * 0.003,
        phase:   Math.random() * Math.PI * 2,
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px 'DM Mono', monospace`;
      ctx.textBaseline = 'top';

      const cw = canvas.width  / cols;
      const ch = canvas.height / rows;

      cells.forEach((cell, i) => {
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;

        // Gentle sine-wave brightness animation
        const b = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase));
        const alpha = b * 0.6;

        // Occasionally swap character
        if (Math.random() < 0.0003) {
          cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = cell.colour;
        ctx.fillText(cell.char, x, y);
      });

      ctx.globalAlpha = 1;
    }

    let raf;
    function loop(t) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(loop);
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    buildSlides();
    buildProgress();
    updateNotes();
    initBackground();

    // Show first slide
    const firstSlide = deck.querySelectorAll('.slide')[0];
    if (firstSlide) firstSlide.classList.add('active');
    updateProgress();
    broadcastState();
  }

  // Wait for fonts then init
  if (document.fonts) {
    document.fonts.ready.then(init);
  } else {
    init();
  }

})();
