import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Ascii from "./shaders/ascii";
import Pixel from "./shaders/pixel";
import { SLIDES, type Modal, type ModalBlock, type TerminalLine, type ChatMessage } from "./slides";
import "./App.css";

const NOTES_KEY = "presentation-state";

function useKeyboard(handlers: Record<string, () => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't swallow keys when the user is typing in something
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      const key = e.key;
      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}

export default function App() {
  // Read initial slide from URL hash (e.g. #5 or #s1-iteration)
  const [index, setIndex] = useState(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return 0;
    const num = parseInt(hash, 10);
    if (!isNaN(num) && num >= 0 && num < SLIDES.length) return num;
    const byId = SLIDES.findIndex((s) => s.id === hash);
    return byId >= 0 ? byId : 0;
  });
  const [showNotes, setShowNotes] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const fadeRef = useRef<number | null>(null);

  const slide = SLIDES[index];
  const total = SLIDES.length;
  const hasModal = !!slide.modal;
  const palette = slide.palette ?? "color";

  // Sync URL hash with current slide
  useEffect(() => {
    window.location.replace(`#${index}`);
  }, [index]);

  // Listen for popstate (back/forward button) and hashchange
  useEffect(() => {
    const onNav = () => {
      const hash = window.location.hash.slice(1);
      const num = parseInt(hash, 10);
      if (!isNaN(num) && num >= 0 && num < SLIDES.length) {
        setIndex(num);
      }
    };
    window.addEventListener("popstate", onNav);
    window.addEventListener("hashchange", onNav);
    return () => {
      window.removeEventListener("popstate", onNav);
      window.removeEventListener("hashchange", onNav);
    };
  }, []);

  // ── Navigation with fade ────────────────────────────────────────────────
  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(total - 1, target));
      if (clamped === index) return;

      if (fadeRef.current) window.clearTimeout(fadeRef.current);
      setIsFading(true);
      setModalOpen(false); // always close modal when navigating
      fadeRef.current = window.setTimeout(() => {
        setIndex(clamped);
        fadeRef.current = window.setTimeout(() => setIsFading(false), 40);
      }, 220);
    },
    [index, total]
  );

  // Clicker flow:
  //   on a modal-bearing slide:
  //     - first press: open modal
  //     - second press: close modal AND advance
  //   on slides without a modal:
  //     - press: advance
  const advance = useCallback(() => {
    if (hasModal && !modalOpen) {
      setModalOpen(true);
      return;
    }
    if (modalOpen) {
      setModalOpen(false);
      // small delay so the close animation reads before advance
      window.setTimeout(() => goTo(index + 1), 120);
      return;
    }
    goTo(index + 1);
  }, [hasModal, modalOpen, goTo, index]);

  const retreat = useCallback(() => {
    if (modalOpen) {
      setModalOpen(false);
      return;
    }
    goTo(index - 1);
  }, [modalOpen, goTo, index]);

  const toggleModal = useCallback(() => {
    if (!hasModal) return;
    setModalOpen((v) => !v);
  }, [hasModal]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  const toggleNotes = useCallback(() => setShowNotes((v) => !v), []);
  const toggleOverview = useCallback(() => setShowOverview((v) => !v), []);

  const openNotesWindow = useCallback(() => {
    const w = window.open("/notes.html", "speaker-notes", "width=900,height=700");
    if (w) w.focus();
  }, []);

  // ── Keyboard ────────────────────────────────────────────────────────────
  const handlers = useMemo<Record<string, () => void>>(
    () => ({
      ArrowRight: advance,
      " ": advance,
      PageDown: advance,
      ArrowLeft: retreat,
      PageUp: retreat,
      Home: () => goTo(0),
      End: () => goTo(total - 1),
      f: toggleFullscreen,
      F: toggleFullscreen,
      n: toggleNotes,
      N: toggleNotes,
      p: openNotesWindow,
      P: openNotesWindow,
      o: toggleOverview,
      O: toggleOverview,
      m: toggleModal,
      M: toggleModal,
      Escape: () => {
        if (modalOpen) setModalOpen(false);
        else if (showOverview) setShowOverview(false);
      },
    }),
    [advance, retreat, goTo, total, toggleFullscreen, toggleNotes, openNotesWindow, toggleOverview, toggleModal, modalOpen, showOverview]
  );
  useKeyboard(handlers);

  // ── Broadcast to notes window via localStorage ──────────────────────────
  useEffect(() => {
    localStorage.setItem(
      NOTES_KEY,
      JSON.stringify({
        current: index,
        total,
        modalOpen,
        slides: SLIDES.map((s) => ({
          id: s.id,
          type: s.type,
          label: s.label,
          notes: s.notes ?? "",
          hasModal: !!s.modal,
          modalTitle: s.modal?.title,
          content: {
            title: s.content?.title,
            heading: s.content?.heading,
            quote: s.content?.quote,
          },
        })),
        t: Date.now(),
      })
    );
  }, [index, slide, total, modalOpen]);

  return (
    <div className={`presentation palette-${palette}`}>
      {/* Background ASCII shader — for non-split layouts, sits behind everything */}
      {(slide.layout !== "split-right" && slide.layout !== "split-left") && (
        <div className="bg-layer bg-layout-full">
          {slide.bg?.ascii && (
            <Ascii
              key={slide.id}
              style={{ width: "100%", height: "100%" }}
              {...slide.bg.ascii}
            />
          )}
          {slide.bg?.image && !slide.bg.ascii && (
            <div
              className="bg-image"
              style={{ backgroundImage: `url(${slide.bg.image})` }}
            />
          )}
        </div>
      )}

      {/* Vignette overlay for text legibility */}
      <div className="vignette" />

      {/* Fade overlay for transitions */}
      <div className={`fade ${isFading ? "active" : ""}`} />

      {/* Slide content */}
      <main
        className={`slide slide-${slide.type} layout-${slide.layout ?? "full"}`}
        key={slide.id}
      >
        <div className="text-panel">
          <SlideContent slide={slide} />
        </div>
        {/* For split layouts, render the ASCII art as a sibling cell instead of an overlapping layer */}
        {(slide.layout === "split-right" || slide.layout === "split-left") && slide.bg?.ascii && (
          <div className="split-ascii-panel">
            <Ascii
              key={slide.id + "-ascii"}
              style={{ width: "100%", height: "100%" }}
              {...slide.bg.ascii}
            />
          </div>
        )}
      </main>

      {/* Label badge */}
      {slide.label && (
        <div className="label">
          <span className="label-num">{slide.label.num}</span>
          <span className="label-text">{slide.label.text}</span>
        </div>
      )}

      {/* Modal-available indicator */}
      {hasModal && !modalOpen && (
        <div className="modal-hint" aria-hidden>
          <span className="modal-hint-dot" />
          <span>MORE — press →</span>
        </div>
      )}

      {/* Progress */}
      <div className="progress">
        <span className="progress-current">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="progress-sep">/</span>
        <span className="progress-total">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Hint bar */}
      <div className="hint">
        SPACE / → next &nbsp;·&nbsp; ← prev &nbsp;·&nbsp; M modal &nbsp;·&nbsp; F fullscreen &nbsp;·&nbsp; N notes &nbsp;·&nbsp; O overview
      </div>

      {/* Inline notes overlay */}
      {showNotes && slide.notes && (
        <div className="notes-inline">
          <div className="notes-inline-head">SPEAKER NOTES</div>
          <p>{slide.notes}</p>
        </div>
      )}

      {/* Modal — opens on top of slide */}
      {hasModal && (
        <ModalLayer
          modal={slide.modal!}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Overview grid — press O */}
      {showOverview && (
        <div className="overview" onClick={() => setShowOverview(false)}>
          <div className="overview-head">
            <span>OVERVIEW · {total} slides · Click to jump · Esc/O to close</span>
          </div>
          <div className="overview-grid">
            {SLIDES.map((s, i) => {
              const c = s.content ?? {};
              const headline = c.title || c.heading || c.quote || s.id;
              return (
                <button
                  key={s.id}
                  className={`overview-card ${i === index ? "current" : ""} type-${s.type} ${s.modal ? "has-modal" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOverview(false);
                    goTo(i);
                  }}
                >
                  <div className="overview-card-num">
                    {String(i + 1).padStart(2, "0")}
                    {s.modal ? <span className="overview-card-modal">●</span> : null}
                  </div>
                  {s.label && (
                    <div className="overview-card-label">
                      {s.label.num} · {s.label.text}
                    </div>
                  )}
                  <div className="overview-card-headline">{headline}</div>
                  <div className="overview-card-type">{s.type}{s.layout ? ` · ${s.layout}` : ""}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modal layer ──────────────────────────────────────────────────────────────
function ModalLayer({
  modal,
  open,
  onClose,
}: {
  modal: Modal;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`modal-layer ${open ? "open" : ""}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
        {/* CRT scanlines + glow are applied via CSS on .modal-frame */}
        <div className="modal-titlebar">
          <span className="modal-titlebar-corner" aria-hidden>◤</span>
          <span className="modal-title">{modal.title}</span>
          {modal.tag && <span className="modal-tag">{modal.tag}</span>}
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {modal.blocks.map((block, i) => (
            <ModalBlockView key={i} block={block} />
          ))}
        </div>

        {modal.footer && (
          <div className="modal-footer">
            <span>{modal.footer}</span>
            {modal.todo && <span className="modal-todo">TODO</span>}
          </div>
        )}

        {/* Bottom action bar like the references */}
        <div className="modal-actions" aria-hidden>
          <span className="modal-action">PREV</span>
          <span className="modal-action">NEXT</span>
          <span className="modal-action-spacer" />
          <span className="modal-action modal-action--primary">CLOSE</span>
        </div>
      </div>
    </div>
  );
}

function ModalBlockView({ block }: { block: ModalBlock }) {
  switch (block.kind) {
    case "image":
      return (
        <figure className="modal-image">
          <div className="modal-image-canvas">
            <img
              className="modal-image-fallback"
              src={block.src}
              alt={block.alt ?? ""}
              aria-hidden
            />
            <Pixel src={block.src} alt={block.alt} {...(block.pixel ?? {})} />
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "video":
      return (
        <figure className="modal-image">
          <div className="modal-image-canvas modal-video-canvas">
            <video
              src={block.src}
              autoPlay
              loop={block.loop ?? true}
              muted={block.muted ?? true}
              playsInline
              className="modal-video"
            />
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case "text":
      return (
        <div className="modal-text">
          {Array.isArray(block.body) ? (
            block.body.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{block.body}</p>
          )}
        </div>
      );
    case "quote":
      return (
        <div className={`modal-quote ${block.image ? "modal-quote--with-image" : ""}`}>
          {block.image && (
            <div className="modal-quote-image">
              <Pixel src={block.image} alt={block.attribution ?? ""} pixelSize={2} levels={8} threshold={0.03} fit="cover" contrast={1.2} brightness={1.0} />
            </div>
          )}
          <div className="modal-quote-content">
            <blockquote>"{block.text}"</blockquote>
            {block.attribution && <cite>— {block.attribution}</cite>}
          </div>
        </div>
      );
    case "bullets":
      return (
        <ul className="modal-bullets">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "list":
      return (
        <dl className="modal-list">
          {block.items.map((item, i) => (
            <div key={i} className="modal-list-row">
              <dt>{item.term}</dt>
              <dd>{item.def}</dd>
            </div>
          ))}
        </dl>
      );
    case "code":
      return (
        <pre className={`modal-code ${block.lang ? `lang-${block.lang}` : ""}`}>
          {block.body}
        </pre>
      );

    case "graph":
      return <GraphIllustration caption={block.caption} nodes={block.nodes} edges={block.edges} />;

    case "terminal":
      return <TerminalIllustration title={block.title} lines={block.lines} cursor={block.cursor} />;

    case "flow":
      return <FlowIllustration stages={block.stages} />;

    case "chat":
      return <ChatIllustration channel={block.channel} messages={block.messages} />;

    case "grid":
      return <GridIllustration columns={block.columns ?? 3} cards={block.cards} />;

    case "image-grid":
      return (
        <div className="modal-image-grid" style={{ gridTemplateColumns: `repeat(${block.columns ?? 3}, 1fr)` }}>
          {block.images.map((img, i) => (
            <div key={i} className="modal-image-grid-cell">
              <img src={img.src} alt={img.caption ?? ""} className="modal-image-grid-img" />
              {img.caption && <span className="modal-image-grid-caption">{img.caption}</span>}
            </div>
          ))}
        </div>
      );

    case "image-carousel":
      return <ImageCarousel images={block.images} interval={block.interval ?? 3000} />;

    default:
      return null;
  }
}

// ── Illustration components ─────────────────────────────────────────────────

function GraphIllustration({
  caption,
  nodes = 32,
  edges = 50,
}: {
  caption?: string;
  nodes?: number;
  edges?: number;
}) {
  // Deterministic seeded random so the graph is stable across renders.
  const rng = useMemo(() => {
    let s = nodes * 1009 + edges * 17;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }, [nodes, edges]);

  const positions = useMemo(() => {
    const arr: { x: number; y: number; r: number; type: number }[] = [];
    for (let i = 0; i < nodes; i++) {
      arr.push({
        x: 6 + rng() * 88,
        y: 8 + rng() * 84,
        r: 1.4 + rng() * 2.6,
        type: Math.floor(rng() * 4),
      });
    }
    return arr;
  }, [nodes, rng]);

  const links = useMemo(() => {
    const arr: { a: number; b: number }[] = [];
    for (let i = 0; i < edges; i++) {
      const a = Math.floor(rng() * nodes);
      let b = Math.floor(rng() * nodes);
      if (b === a) b = (a + 1) % nodes;
      arr.push({ a, b });
    }
    return arr;
  }, [edges, nodes, rng]);

  return (
    <figure className="modal-graph">
      <div className="modal-graph-canvas">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {links.map((l, i) => {
            const a = positions[l.a];
            const b = positions[l.b];
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="var(--phosphor)"
                strokeOpacity={0.18 + (i % 5) * 0.06}
                strokeWidth={0.15}
              />
            );
          })}
          {positions.map((p, i) => (
            <g key={i} className={`g-node g-node-type-${p.type}`} style={{ animationDelay: `${(i * 73) % 2400}ms` }}>
              <circle cx={p.x} cy={p.y} r={p.r * 1.6} fill="var(--phosphor)" opacity="0.08" />
              <circle cx={p.x} cy={p.y} r={p.r} fill="var(--phosphor)" />
            </g>
          ))}
        </svg>
        <span className="modal-graph-corner-tl">●</span>
        <span className="modal-graph-corner-br">●</span>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function TerminalIllustration({
  title,
  lines,
  cursor,
}: {
  title?: string;
  lines: TerminalLine[];
  cursor?: boolean;
}) {
  return (
    <div className="modal-terminal">
      {title && <div className="modal-terminal-bar">▣  {title}</div>}
      <div className="modal-terminal-body">
        {lines.map((line, i) => {
          switch (line.type) {
            case "prompt":
              return (
                <div key={i} className="modal-terminal-prompt">
                  <span className="modal-terminal-user">{line.user ?? "milly"}</span>
                  <span className="modal-terminal-arrow">$</span>
                  <span className="modal-terminal-cmd">{line.cmd}</span>
                </div>
              );
            case "out":
              return <div key={i} className="modal-terminal-out">{line.text}</div>;
            case "comment":
              return <div key={i} className="modal-terminal-comment">{line.text}</div>;
            case "blank":
              return <div key={i} className="modal-terminal-blank">&nbsp;</div>;
          }
        })}
        {cursor && <span className="modal-terminal-cursor">▮</span>}
      </div>
    </div>
  );
}

function FlowIllustration({
  stages,
}: {
  stages: { label: string; sub?: string; color?: string }[];
}) {
  return (
    <div className="modal-flow">
      {stages.map((s, i) => (
        <div className="modal-flow-row" key={i}>
          <div className="modal-flow-stage">
            <div className="modal-flow-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="modal-flow-text">
              <div className="modal-flow-label">{s.label}</div>
              {s.sub && <div className="modal-flow-sub">{s.sub}</div>}
            </div>
          </div>
          {i < stages.length - 1 && <div className="modal-flow-arrow" aria-hidden>↓</div>}
        </div>
      ))}
    </div>
  );
}

function ChatIllustration({
  channel,
  messages,
}: {
  channel?: string;
  messages: ChatMessage[];
}) {
  return (
    <div className="modal-chat">
      {channel && <div className="modal-chat-channel">▣  {channel}</div>}
      <div className="modal-chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`modal-chat-msg ${m.badge ? "modal-chat-msg--bot" : ""}`}>
            <div className="modal-chat-head">
              <span className="modal-chat-author">{m.author}</span>
              {m.badge && <span className="modal-chat-badge">{m.badge}</span>}
              {m.time && <span className="modal-chat-time">{m.time}</span>}
            </div>
            <div className="modal-chat-text">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageCarousel({ images, interval }: { images: { src: string; caption?: string }[]; interval: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);
  return (
    <figure className="modal-carousel">
      <div className="modal-carousel-canvas">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.caption ?? ""}
            className={`modal-carousel-img ${i === current ? "active" : ""}`}
          />
        ))}
        <div className="modal-carousel-dots">
          {images.map((_, i) => (
            <span key={i} className={`modal-carousel-dot ${i === current ? "active" : ""}`} />
          ))}
        </div>
        <div className="modal-carousel-counter">{current + 1} / {images.length}</div>
      </div>
    </figure>
  );
}

function GridIllustration({
  columns,
  cards,
}: {
  columns: number;
  cards: { title: string; lines?: string[] }[];
}) {
  return (
    <div
      className="modal-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cards.map((c, i) => (
        <div className="modal-grid-card" key={i}>
          <div className="modal-grid-title">{c.title}</div>
          {c.lines && (
            <ul className="modal-grid-lines">
              {c.lines.map((l, j) => <li key={j}>{l}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function SlideContent({ slide }: { slide: (typeof SLIDES)[number] }) {
  const c = slide.content ?? {};

  switch (slide.type) {
    case "hero":
      return (
        <div className="hero-inner">
          <h1 className="hero-title">{linebreaks(c.title)}</h1>
          {c.subtitle && <p className="hero-subtitle">{c.subtitle}</p>}
        </div>
      );

    case "thanks":
      return (
        <div className="hero-inner">
          <h1 className="hero-title">{linebreaks(c.title)}</h1>
          {c.subtitle && <p className="hero-subtitle">{c.subtitle}</p>}
        </div>
      );

    case "section":
      return (
        <div className="section-inner">
          <h2 className="section-heading">{linebreaks(c.heading)}</h2>
          {c.secondary && <p className="section-secondary">{linebreaks(c.secondary)}</p>}
        </div>
      );

    case "overview":
    case "summary": {
      const label = slide.type === "overview" ? "What we'll cover" : "In summary";
      return (
        <div className="overview-slide">
          <p className="overview-slide-label">{label}</p>
          {c.heading && c.heading !== label && (
            <h2 className="overview-slide-heading">{linebreaks(c.heading)}</h2>
          )}
          <ol className="overview-slide-list">
            {(c.bullets ?? []).map((b, i) => (
              <li key={i}>
                <span className="overview-slide-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="overview-slide-text">{b}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    case "body": {
      const modalBullet =
        typeof c.modalBullet === "number" ? c.modalBullet : -1;
      return (
        <div className="body-inner">
          {c.heading && (
            <h3
              className={`body-heading-display`}
            >
              {linebreaks(c.heading)}
            </h3>
          )}
          {c.secondary && <p className="body-secondary">{linebreaks(c.secondary)}</p>}
          {Array.isArray(c.bullets) ? (
            <ul className="body-list">
              {c.bullets.map((line, i) => (
                <li
                  key={i}
                  className={i === modalBullet ? "body-list-item--modal" : ""}
                >
                  <span className="body-list-text">{line}</span>
                  {i === modalBullet && (
                    <span className="body-list-modal-marker" aria-hidden>
                      ↗
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : Array.isArray(c.body) ? (
            <ul className="body-list">
              {c.body.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            c.body && <p className="body-text">{c.body}</p>
          )}
          {c.footer && <p className="body-footer">{linebreaks(c.footer)}</p>}
        </div>
      );
    }

    default:
      return null;
  }
}

function linebreaks(s?: string) {
  if (!s) return null;
  return s.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}
