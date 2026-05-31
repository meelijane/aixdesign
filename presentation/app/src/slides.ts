// Slide content for "Lessons from the AI frontier"
// Synced with presentation/talk-content.md (the canonical source of truth).
//
// Structure derived from talk-content.md:
//   1. HERO
//   2. Overview (5-line list of section names)
//   3. Five sections, each with:
//        - Section header slide (#) with section image
//        - Three content slides — each starts with `>` heading
//          and has three dot-point lines, with one line marked [modal]
//          and a modal content block describing the modal
//   4. In summary (mirrors the Overview)
//   5. Thank you
//
// Each slide that carries a modal uses the phosphor palette so the
// ASCII background and the modal share the green/black aesthetic.
import type { AsciiProps } from "./shaders/ascii";
import type { PixelProps } from "./shaders/pixel";
export type SlideType =
  | "hero"
  | "section"
  | "overview"
  | "body"
  | "summary"
  | "thanks";
export type Layout =
  | "full"
  | "split-left"
  | "split-right"
  | "deco"
  | "bare";
export type Palette = "color" | "phosphor";
export type ModalBlock =
  | { kind: "image"; src: string; alt?: string; caption?: string; pixel?: Partial<PixelProps> }
  | { kind: "video"; src: string; caption?: string; loop?: boolean; muted?: boolean }
  | { kind: "text"; body: string | string[] }
  | { kind: "quote"; text: string; attribution?: string; image?: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "list"; items: { term: string; def: string }[] }
  | { kind: "code"; lang?: string; body: string }
  /** Animated SVG node-graph illustration */
  | { kind: "graph"; caption?: string; nodes?: number; edges?: number }
  /** Terminal / CLI mock — looks like a phosphor terminal window */
  | { kind: "terminal"; title?: string; lines: TerminalLine[]; cursor?: boolean }
  /** Stage-to-stage flow with arrows */
  | { kind: "flow"; stages: { label: string; sub?: string; color?: string }[] }
  /** Slack / chat mock — looks like a thread of messages */
  | { kind: "chat"; channel?: string; messages: ChatMessage[] }
  /** Mini grid of mock UI cards (e.g. convergent 'For You' pages) */
  | { kind: "grid"; columns?: number; cards: { title: string; lines?: string[] }[] }
  /** Grid of images rendered through the pixel shader */
  | { kind: "image-grid"; columns?: number; images: { src: string; caption?: string }[] }
  /** Auto-scrolling carousel — one image fills the modal, cycles through all */
  | { kind: "image-carousel"; images: { src: string; caption?: string }[]; interval?: number };
export type TerminalLine =
  | { type: "prompt"; user?: string; cmd: string }
  | { type: "out"; text: string }
  | { type: "comment"; text: string }
  | { type: "blank" };
export type ChatMessage = {
  author: string;
  badge?: string; // e.g. "BOT" or "AGENT"
  text: string;
  time?: string;
};
export type Modal = {
  title: string;
  tag?: string;
  blocks: ModalBlock[];
  footer?: string;
  todo?: boolean;
};
export type Slide = {
  id: string;
  type: SlideType;
  layout?: Layout;
  palette?: Palette;
  label?: { num: string; text: string };
  content?: {
    title?: string;
    subtitle?: string;
    heading?: string;
    secondary?: string;
    body?: string | string[];
    bullets?: string[];
    /** Highlighted bullet (the one tied to the modal) — for body slides. */
    modalBullet?: number;
    quote?: string;
    attribution?: string;
    footer?: string;
  };
  bg?: {
    image?: string;
    ascii?: Partial<AsciiProps>;
  };
  modal?: Modal;
  notes?: string;
};
// ── Palette tokens ──────────────────────────────────────────────────────────
const PHOSPHOR_GREEN = "#7CFFB2";
const PHOSPHOR_DIM = "#3A9460";
const PHOSPHOR_BG = "#04120A";
// A bigger palette to cycle through. Each entry = a pair of colors
// (primary + secondary) used as ascii source colors. The whole presentation
// rotates through this palette so neighbouring slides feel visually distinct.
const SLIDE_PALETTES: [string, string][] = [
  ["#1868DB", "#7CFFB2"],   // blue + phosphor
  ["#FCA700", "#FF4D88"],   // amber + pink
  ["#AF59E1", "#1868DB"],   // violet + blue
  ["#6A9A23", "#7CFFB2"],   // moss + phosphor
  ["#FF4D88", "#FCA700"],   // pink + amber
  ["#00B8D9", "#7CFFB2"],   // cyan + phosphor
  ["#AF59E1", "#FCA700"],   // violet + amber
  ["#1868DB", "#00B8D9"],   // blue + cyan
  ["#6A9A23", "#FCA700"],   // moss + amber
  ["#FF4D88", "#AF59E1"],   // pink + violet
  ["#00B8D9", "#1868DB"],   // cyan + blue
];
const paletteFor = (i: number): [string, string] =>
  SLIDE_PALETTES[i % SLIDE_PALETTES.length];
// Default multi-color ascii field — used for hero / section / outro slides.
const fieldBg: Partial<AsciiProps> = {
  sourceMode: "field",
  colorMode: "source",
  sourceColors: ["#1868DB", "#FCA700", "#AF59E1", "#6A9A23"],
  density: 0.6,
  animationStyle: "wave",
  animationIntensity: 0.5,
  animationRandomness: 0.7,
  characterCycleSpeed: 4,
  speed: 0.6,
  fontWeight: "regular",
  charset: "light",
  vignette: 0.5,
};
// Colored field — uses green phosphor tones on the dark CRT background.
const coloredFieldBg = (_index: number, extra: Partial<AsciiProps> = {}): Partial<AsciiProps> => ({
  ...fieldBg,
  sourceColors: [PHOSPHOR_GREEN, PHOSPHOR_DIM],
  colorMode: "source",
  backgroundColor: PHOSPHOR_BG,
  backgroundMode: "solid-black",
  density: 0.5,
  vignette: 0.55,
  ...extra,
});
// Image-driven phosphor ascii — section headers with a pixel-art reference image.
const phosphorImageAscii = (src: string, extra: Partial<AsciiProps> = {}): Partial<AsciiProps> => ({
  imageSrc: src,
  sourceMode: "image",
  colorMode: "source",
  sourceColors: [PHOSPHOR_GREEN, PHOSPHOR_DIM],
  backgroundColor: PHOSPHOR_BG,
  backgroundMode: "solid-black",
  density: 0.9,
  charset: "light",
  fontWeight: "regular",
  animatedCharacters: true,
  animationIntensity: 0.22,
  animationStyle: "wave",
  characterCycleSpeed: 0.7,
  vignette: 0.5,
  ...extra,
});
// Image-driven ascii — uses green phosphor tones (matching the modal palette).
const coloredImageAscii = (
  src: string,
  _index: number,
  extra: Partial<AsciiProps> = {},
): Partial<AsciiProps> =>
  phosphorImageAscii(src, { ...extra });
// Lobby/overview/summary list of the five section names.
const FIVE_SECTIONS = [
  "Garbage in, garbage out",
  "Quality is a team sport",
  "Strategic alignment matters",
  "Right tool for the job",
  "Get AI to do your dishes",
];
export const SLIDES: Slide[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // 00 · HERO
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "hero",
    type: "hero",
    content: {
      title: "Lessons from\nthe AI frontier",
      subtitle: "Milly Schmidt · Atlassian Design · Web Directions 2026",
    },
    bg: { ascii: { ...fieldBg, density: 0.45, animationIntensity: 0.7, vignette: 0.7 } },
    notes:
      "Hi, I'm Milly. I've been at Atlassian for four years, and I'm now the design manager on Rovo Studio, which is part of the Central AI organisation. We are building AI with AI. This is a talk about what we've actually learned in the last year or so — the good, the awkward, the surprising.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // 01 · OVERVIEW
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "overview",
    type: "overview",
    layout: "full",
    content: { heading: "What we'll cover", bullets: FIVE_SECTIONS },
    bg: { ascii: { ...fieldBg, sourceColors: paletteFor(1), density: 0.4, animationIntensity: 0.4 } },
    notes: "Here's the shape of the next 25 minutes. Five lessons.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // §01 SECTION
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "s1-section",
    type: "section",
    layout: "full",
    label: { num: "01", text: FIVE_SECTIONS[0] },
    content: { heading: "Garbage in,\ngarbage out" },
    bg: { ascii: coloredImageAscii("/garbage.jpg", 2, { vignette: 0.45, density: 0.85, animationStyle: "pulse", animationIntensity: 0.3 }) },
    notes: "Section opener — garbage can image offset right so the heading sits clear on the left.",
  },
  // 1.1 — Org context
  {
    id: "s1-org-context",
    type: "body",
    layout: "split-right",
    label: { num: "01", text: FIVE_SECTIONS[0] },
    content: {
      heading: "Organisational\ncontext is key",
      bullets: [
        "The Teamwork Graph elevates your organisation's shared context",
        "You can spend less time searching and more time making",
        "AI can pull contextually relevant info for you in various surfaces",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredImageAscii("/rovo-dark.png", 3, { vignette: 0.35, density: 0.9, animationStyle: "cascade-top-bottom", animationIntensity: 0.28, characterCycleSpeed: 0.6 }) },
    modal: {
      title: "Teamwork Graph — the connected enterprise",
      tag: "ROVO · GRAPH",
      blocks: [
        {
          kind: "image",
          src: "/twg-dense.png",
          alt: "Teamwork Graph — dense node visualisation",
          caption: "Issues · pages · repos · people · goals — every node connected",
          pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 },
        },
      ],
      footer: "Source: atlassian.com/teamwork-graph",
    },
    notes: "Lead with org context. The graph is unglamorous infrastructure that makes the magic possible.",
  },
  // 1.2 — Personal context (Loom)
  {
    id: "s1-personal-context",
    type: "body",
    layout: "split-left",
    label: { num: "01", text: FIVE_SECTIONS[0] },
    content: {
      heading: "Personal context\nis also critical",
      bullets: [
        "Atlassian is a read/write culture — so we have a lot of Confluence docs",
        "But the real star here is Loom, which allows you to record meetings",
        "Your goals, your priorities and your focus — as well as your thoughts in the moment — can now be fed into the next stage of your designs",
      ],
      modalBullet: 1,
    },
    bg: { ascii: coloredFieldBg(4, { density: 0.45, animationStyle: "wave", animationIntensity: 0.2 }) },
    modal: {
      title: "Loom recorder · Zoom · in-meeting",
      tag: "PERSONAL CONTEXT",
      blocks: [
        {
          kind: "image",
          src: "/loom.png",
          alt: "Loom recorder inside a Zoom meeting",
          caption: "Loom records, transcribes and summarises — building your personal context corpus",
          pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 },
        },
      ],
      footer: "Source: Loom + Zoom integration",
    },
    notes: "Personal context: the org graph gives you shared context. Personal context makes the response feel made for you. Loom is the unlock.",
  },
  // 1.3 — Specificity & iteration
  {
    id: "s1-iteration",
    type: "body",
    layout: "split-right",
    label: { num: "01", text: FIVE_SECTIONS[0] },
    content: {
      heading: "Specificity\nand iteration",
      bullets: [
        "None of this matters if you prompt poorly",
        "Voice is critical for me — I can type fast but I can yap faster",
        "Read the output and critique it. Do the revs.",
      ],
      modalBullet: 1,
    },
    bg: { ascii: coloredFieldBg(5, { density: 0.45, animationStyle: "pulse", animationIntensity: 0.06, speed: 0.3 }) },
    modal: {
      title: "Voice → CLI · live transcription",
      tag: "PROMPTING",
      blocks: [
        {
          kind: "video",
          src: "/rovodev-voice.mov",
          caption: "Voice → CLI: speak naturally, the agent codes in real-time",
          loop: true,
          muted: true,
        },
      ],
      footer: "Source: rovo-dev voice mode",
    },
    notes: "Specificity + iteration.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // §02 SECTION
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "s2-section",
    type: "section",
    layout: "full",
    label: { num: "02", text: FIVE_SECTIONS[1] },
    content: { heading: "Quality is\na team sport" },
    bg: { ascii: coloredImageAscii("/hands-puzzle-dark.jpeg", 6, { vignette: 0.35, density: 1.0, contrast: 1.4, animationStyle: "none", animationIntensity: 0, animatedCharacters: false, characterCycleSpeed: 0 }) },
    notes: "Section opener. Pixel art idea: hands with puzzle pieces.",
  },
  // 2.1 — Lightspeed
  {
    id: "s2-lightspeed",
    type: "body",
    layout: "split-left",
    label: { num: "02", text: FIVE_SECTIONS[1] },
    content: {
      heading: "The industry is\nmoving at lightspeed",
      bullets: [
        "You have to learn to play slowly before you can play fast",
        "We have run 3 AI Builders Weeks, stopping the whole company to learn together",
        "A couple weeks ago we got the whole design org together to learn to prototype in code",
      ],
      modalBullet: 2,
    },
    bg: { ascii: coloredFieldBg(7, { density: 0.5, animationStyle: "cascade-top-bottom", animationIntensity: 0.3 }) },
    modal: {
      title: "AI Builders Weeks — by the numbers",
      tag: "INTERNAL",
      blocks: [
        {
          kind: "image",
          src: "/design-camp.jpeg",
          alt: "Design camp — learning to prototype with AI together",
          caption: "Slowing down to speed up — the whole design org learning together",
          pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 },
        },
      ],
      footer: "Source: Atlassian Design Camp",
    },
    notes: "Industry is fast. Atlassian's response: slow down to speed up.",
  },
  // 2.2 — Enterprise needs safety
  {
    id: "s2-safety",
    type: "body",
    layout: "split-right",
    label: { num: "02", text: FIVE_SECTIONS[1] },
    content: {
      heading: "Enterprise customers\nneed to feel safe",
      bullets: [
        "We damaged trust by moving too fast",
        "Some experiences should be deterministic",
        "B2B is different from B2C",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredImageAscii("/lighthouse-safety.jpg", 8, { vignette: 0.4, density: 0.8, animationStyle: "cascade-top-bottom", animationIntensity: 0.22 }) },
    modal: {
      title: "Rachel Shepard — on emotional context",
      tag: "RESEARCH",
      blocks: [
        { kind: "quote", text: "Until you understand someone's emotional context, you're not designing for them, you're designing at them.", attribution: "Rachel Shepard", image: "/rachel.png" },
      ],
      footer: "Source: hello.atlassian.net · Default-On Trust-Off",
    },
    notes: "Trust takes a long time to build and a moment to lose.",
  },
  // 2.3 — Dogfood
  {
    id: "s2-dogfood",
    type: "body",
    layout: "split-left",
    label: { num: "02", text: FIVE_SECTIONS[1] },
    content: {
      heading: "Eat your own dogfood,\nsee how it tastes",
      bullets: [
        "We are culturally hard-wired to use our own tools — this is good and bad",
        "Spending more time with customers is critically important & helps you identify the gaps",
        "You don't want customers doing your QA",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredImageAscii("/dogfood.png", 9, { vignette: 0.3, density: 1.0, contrast: 1.6, fontSize: 8 }) },
    modal: {
      title: "Studio canvas — agent builder",
      tag: "DOGFOOD",
      blocks: [
        { kind: "video", src: "/design-reviews-agent-studio.mov", caption: "We build Studio. We use Studio. Every gap we feel, our customers feel ten times worse.", loop: true, muted: true },
      ],
      footer: "Source: Atlassian Studio · internal builds",
    },
    notes: "Dogfooding is in our DNA.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // §03 SECTION
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "s3-section",
    type: "section",
    layout: "full",
    label: { num: "03", text: FIVE_SECTIONS[2] },
    content: { heading: "Strategic\nalignment matters" },
    bg: { ascii: coloredFieldBg(10, { density: 0.55, animationStyle: "reveal", animationIntensity: 0.4 }) },
    notes: "Section opener. Pixel art idea: arrows pointing in different directions converging on a point.",
  },
  // 3.1 — Convergent
  {
    id: "s3-convergent",
    type: "body",
    layout: "split-right",
    label: { num: "03", text: FIVE_SECTIONS[2] },
    content: {
      heading: "We noticed a lot of\nconvergent thinking",
      bullets: [
        "Key UIs started to look the same",
        "If you jump to a prototype too fast, you might be converging prematurely",
        "The models reinforce this by outputting 'averaged' ideas",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredFieldBg(0, { density: 0.45, animationStyle: "cascade-left-right", animationIntensity: 0.25 }) },
    modal: {
      title: "Convergent UIs — 'For You' pages",
      tag: "PATTERN ROT",
      blocks: [
        {
          kind: "image-carousel",
          interval: 3000,
          images: [
            { src: "/convergent-1.png" },
            { src: "/convergent-2.png" },
            { src: "/convergent-3.png" },
            { src: "/convergent-4.png" },
            { src: "/convergent-5.png" },
            { src: "/convergent-6.png" },
          ],
        },
      ],
      footer: "Source: competitive scan · 2026",
    },
    notes: "Convergence is the silent killer.",
  },
  // 3.2 — Agentic
  {
    id: "s3-agentic",
    type: "body",
    layout: "split-left",
    label: { num: "03", text: FIVE_SECTIONS[2] },
    content: {
      heading: "Some experiences are\nharder to do agentically",
      bullets: [
        "Chat has been fashionable, but it's not always appropriate",
        "Customers get annoyed when you try to make easy things easier",
        "Different customer archetypes want more or less control",
      ],
      modalBullet: 1,
    },
    bg: { ascii: coloredFieldBg(1, { density: 0.45, animationStyle: "pulse", animationIntensity: 0.3 }) },
    modal: {
      title: "Customer feedback · verbatim",
      tag: "VOC",
      blocks: [
        { kind: "quote", text: "Hindering default actions like basic thing of column deletion. Too frustrating.", attribution: "Customer · enterprise admin" },
      ],
      footer: "Source: in-product feedback · 2026",
    },
    notes: "Chat isn't the answer to everything.",
  },
  // 3.3 — Hard easier
  {
    id: "s3-hard-easier",
    type: "body",
    layout: "split-right",
    label: { num: "03", text: FIVE_SECTIONS[2] },
    content: {
      heading: "Don't make easy things easier;\nmake hard things easier",
      bullets: [
        "Atlassian has many great opportunities for AI — natural language automations, format transfer, large data sets",
        "The most value we can provide to customers is making their hardest tasks easier",
        "Our researcher built a three-agent system to do literature review",
      ],
      modalBullet: 2,
    },
    bg: { ascii: coloredFieldBg(2, { density: 0.45, animationStyle: "wave", animationIntensity: 0.25 }) },
    modal: {
      title: "Literature Review · three-agent pipeline",
      tag: "RESEARCH",
      blocks: [
        {
          kind: "flow",
          stages: [
            { label: "INPUT", sub: "topic · keywords · sources" },
            { label: "SYNTHESIZE", sub: "extract quotes · classify" },
            { label: "AUDIT", sub: "verify · catch hallucinations" },
            { label: "CRITIQUE", sub: "gaps · bias · maturity" },
            { label: "OUTPUT", sub: "verified review + scores" },
          ],
        },
      ],
      footer: "Source: hello.atlassian.net · Literature Review Agent",
    },
    notes: "Hard problems are the unlock.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // §04 SECTION
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "s4-section",
    type: "section",
    layout: "full",
    label: { num: "04", text: FIVE_SECTIONS[3] },
    content: { heading: "Right tool\nfor the job" },
    bg: { ascii: coloredImageAscii("/tools-dark.png", 3, { vignette: 0.35, density: 0.9, animationStyle: "pulse", animationIntensity: 0.3 }) },
    notes: "Section opener. Pixel art idea: flat lay of a set of tools.",
  },
  // 4.1 — Prototype/polish
  {
    id: "s4-prototype-polish",
    type: "body",
    layout: "split-left",
    label: { num: "04", text: FIVE_SECTIONS[3] },
    content: {
      heading: "AI to prototype\nvs AI to polish",
      bullets: [
        "Different tools are suitable at different stages of the process",
        "Generative tools for prototyping",
        "Automated tools for polishing",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredFieldBg(4, { density: 0.45, animationStyle: "cascade-top-bottom", animationIntensity: 0.25 }) },
    modal: {
      title: "Design process · AI tools by stage",
      tag: "PROCESS",
      blocks: [
        {
          kind: "flow",
          stages: [
            { label: "IDEATE", sub: "Rovo Dev prototypes" },
            { label: "REFINE", sub: "Figma screens & specs" },
            { label: "CRITIQUE", sub: "Humans focus here" },
            { label: "BUILD", sub: "Eng collab & pairing" },
            { label: "POLISH", sub: "Designers ship PRs" },
          ],
        },
      ],
      footer: "Source: Atlassian Design · AI tooling map",
    },
    notes: "Stop arguing about which AI tool is best.",
  },
  // 4.2 — Pen
  {
    id: "s4-pen",
    type: "body",
    layout: "split-right",
    label: { num: "04", text: FIVE_SECTIONS[3] },
    content: {
      heading: "Sometimes\nyou need a pen",
      bullets: [
        "Engagement is a useful metric, but mandating AI for everything isn't helpful",
        "Different brains, different problems and different teams should choose the tool that suits the problem space best",
        "I made this deck in Rovo Dev, but had to use my notebook to design it",
      ],
      modalBullet: 2,
    },
    bg: { ascii: coloredFieldBg(5, { density: 0.45, animationStyle: "wave", animationIntensity: 0.25 }) },
    modal: {
      title: "Notebook plan — for this talk",
      tag: "ARTEFACT",
      blocks: [
        { kind: "image", src: "/pen.jpg", alt: "Notebook plan for this talk", caption: "The actual notebook · scrawled before any pixel was placed", pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 } },
      ],
      footer: "Photo: Milly's notebook",
    },
    notes: "Mandates feel awful.",
  },
  // 4.3 — Skill
  {
    id: "s4-skill",
    type: "body",
    layout: "split-left",
    label: { num: "04", text: FIVE_SECTIONS[3] },
    content: {
      heading: "Knowing when to\nleverage AI is a skill",
      bullets: [
        "Identifying opportunities to automate requires understanding the capabilities deeply",
        "It also requires knowing our own capabilities — what tools are connected, what actions are available",
        "Finally, it requires democratisation of AI and automation tooling — available to everyone",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredFieldBg(6, { density: 0.45, animationStyle: "pulse", animationIntensity: 0.3 }) },
    modal: {
      title: "Design's three commitments for AI transformation",
      tag: "ATLASSIAN DESIGN",
      blocks: [
        {
          kind: "list",
          items: [
            { term: "1 · Build prototypes", def: "Technical, AI-powered prototypes that live inside the AI Prototyping Sandbox or your team's repo. Build the muscle and learn the language of engineering." },
            { term: "2 · Push what's possible", def: "Use AI to push how we work, communicate and make decisions faster. Push what's possible with your cross-craft team from inception to live." },
            { term: "3 · Ship to production", def: "Ship changes to production using code. Look for opportunities — big or small — and contribute shared components and patterns." },
          ],
        },
      ],
      footer: "Source: hello.atlassian.net · Path to AI-native",
    },
    notes: "Three skills.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // §05 SECTION
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "s5-section",
    type: "section",
    layout: "full",
    label: { num: "05", text: FIVE_SECTIONS[4] },
    content: { heading: "Get AI to do\nyour dishes" },
    bg: { ascii: coloredImageAscii("/claw-personal-os.jpg", 7, { vignette: 0.45, density: 0.85, animationStyle: "wave", animationIntensity: 0.3 }) },
    modal: {
      title: "Why dishes?",
      tag: "CONTEXT",
      blocks: [
        { kind: "image", src: "/ai-dishes.jpg", alt: "AI doing the dishes", caption: "Let AI handle the tedious work so you can focus on what matters", pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 } },
      ],
    },
    notes: "Section opener. Pixel art idea: a lobster claw.",
  },
  // 5.1 — DS
  {
    id: "s5-design-system",
    type: "body",
    layout: "split-right",
    label: { num: "05", text: FIVE_SECTIONS[4] },
    content: {
      heading: "The power of a\ngood design system",
      bullets: [
        "ADS, our design system, has been incredible leverage",
        "We created an ADS MCP so agents could leverage our design system through various surfaces",
        "Our team now includes Design Technologists, a new role for highly skilled technical designers",
      ],
      modalBullet: 2,
    },
    bg: { ascii: coloredFieldBg(8, { density: 0.45, animationStyle: "cascade-top-bottom", animationIntensity: 0.25 }) },
    modal: {
      title: "Design Technology · priorities",
      tag: "NEW ROLE",
      blocks: [
        {
          kind: "list",
          items: [
            { term: "MCP & integrations", def: "Make ADS available to agents through a standard MCP server" },
            { term: "Living prototypes", def: "Code-based prototypes that look, feel and behave like production" },
            { term: "Shared patterns", def: "Contribute back to the system — every prototype lifts the next" },
            { term: "Cross-craft fluency", def: "Speak engineering and design, translate between them" },
            { term: "Adoption tooling", def: "Lower the floor: codemod, scaffolding, ADS-by-default templates" },
          ],
        },
      ],
      footer: "Source: hello.atlassian.net · Design Technology at Atlassian",
    },
    notes: "Design systems become AI superchargers.",
  },
  // 5.2 — Content
  {
    id: "s5-content-design",
    type: "body",
    layout: "split-left",
    label: { num: "05", text: FIVE_SECTIONS[4] },
    content: {
      heading: "We transformed\ncontent design",
      bullets: [
        "Unsurprisingly, Large Language Models are great at language-oriented design systems",
        "Our well-documented content design standards have been transformed into an agent and an agentic service desk",
        "Our documentation team leverages agents to audit, generate and adjust docs",
      ],
      modalBullet: 2,
    },
    bg: { ascii: coloredFieldBg(9, { density: 0.45, animationStyle: "wave", animationIntensity: 0.25 }) },
    modal: {
      title: "#content-design-help · Slack agent",
      tag: "INTERNAL",
      blocks: [
        { kind: "image", src: "/content-assistant.png", alt: "Content design assistant in Slack", caption: "A Slack agent trained on Atlassian's voice & tone guidelines", pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 } },
      ],
      footer: "Source: Atlassian Slack · #content-design-help",
    },
    notes: "Content design + LLM is a natural fit.",
  },
  // 5.3 — Personal OS
  {
    id: "s5-personal-os",
    type: "body",
    layout: "split-right",
    label: { num: "05", text: FIVE_SECTIONS[4] },
    content: {
      heading: "A personal\noperating system",
      bullets: [
        "I created my own 'second brain' — running entirely through CLI on md files",
        "Managing a team of ten across at least 30 projects + my side quests, it's been invaluable",
        "This OpenClaw philosophy is driving our explorations into Rovo as a second brain",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredImageAscii("/claw-personal-os.jpg", 10, { vignette: 0.35, density: 0.9, animationStyle: "cascade-right-left", animationIntensity: 0.22 }) },
    modal: {
      title: "milly-os :: second brain",
      tag: "PERSONAL OS",
      blocks: [
        {
          kind: "video",
          src: "/personal-os.mov",
          caption: "A personal operating system — running entirely through CLI on markdown files",
          loop: true,
          muted: true,
        },
      ],
      footer: "Source: milly-os · personal · MIT",
    },
    notes: "Personal OS = the second brain.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // IN SUMMARY
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "summary",
    type: "summary",
    layout: "full",
    content: { heading: "In summary", bullets: FIVE_SECTIONS },
    bg: { ascii: { ...fieldBg, sourceColors: paletteFor(0), density: 0.4, animationIntensity: 0.5 } },
    notes: "Recap the five lessons.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // THANK YOU
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "thanks",
    type: "thanks",
    content: { title: "Thank you", subtitle: "Milly Schmidt · millyschmidt.me · atlassian.design\n\ngithub.com/meelijane/aixdesign" },
    modal: {
      title: "The real helpers",
      tag: "BONUS",
      blocks: [
        { kind: "image", src: "/helpers.jpg", alt: "Cats helping write the talk", caption: "The real co-authors", pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 } },
      ],
      footer: "🐱",
    },
    bg: { ascii: { ...fieldBg, density: 0.35, animationIntensity: 0.8 } },
    notes: "Q&A.",
  },
];
