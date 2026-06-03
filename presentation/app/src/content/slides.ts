/**
 * content/slides.ts
 * Slide content for "Lessons from the AI Frontier" — AIxDesign Sydney 2026.
 *
 * This file is talk-specific. The engine types are imported from ../engine/types.
 * The Slide type, Layout, SlideType etc. are all defined there.
 */
import type { AsciiProps } from "../shaders/ascii";
import type { Slide } from "../engine/types";
export type { SlideType, Layout, Palette, ModalBlock, TerminalLine, ChatMessage, ModalPage, Modal } from "../engine/types";
// ── Palette tokens ──────────────────────────────────────────────────────────
const PHOSPHOR_GREEN = "#7CFFB2";
const PHOSPHOR_DIM = "#3A9460";
const PHOSPHOR_BG = "#04120A";
// A bigger palette to cycle through. Each entry = a pair of colors
// (primary + secondary) used as ascii source colors. The whole presentation
// rotates through this palette so neighbouring slides feel visually distinct.
// const SLIDE_PALETTES: [string, string][] = [
//   ["#1868DB", "#7CFFB2"],   // blue + phosphor
//   ["#FCA700", "#FF4D88"],   // amber + pink
//   ["#AF59E1", "#1868DB"],   // violet + blue
//   ["#6A9A23", "#7CFFB2"],   // moss + phosphor
//   ["#FF4D88", "#FCA700"],   // pink + amber
//   ["#00B8D9", "#7CFFB2"],   // cyan + phosphor
//   ["#AF59E1", "#FCA700"],   // violet + amber
//   ["#1868DB", "#00B8D9"],   // blue + cyan
//   ["#6A9A23", "#FCA700"],   // moss + amber
//   ["#FF4D88", "#AF59E1"],   // pink + violet
//   ["#00B8D9", "#1868DB"],   // cyan + blue
// ];
// const paletteFor = (i: number): [string, string] =>
//   SLIDE_PALETTES[i % SLIDE_PALETTES.length];
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
  colorMode: "monochrome",
  monoColor: PHOSPHOR_GREEN,
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
  colorMode: "monochrome",
  monoColor: PHOSPHOR_GREEN,
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
  "Don't put a bird on it",
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
      subtitle: "Milly Schmidt · Atlassian Design · AI × Design 2026",
    },
    bg: { ascii: { ...fieldBg, sourceColors: [PHOSPHOR_GREEN, PHOSPHOR_DIM], backgroundColor: PHOSPHOR_BG, density: 0.45, animationIntensity: 0.7, vignette: 0.7 } },
    notes: "Hi, I'm Milly.. I've been at Atlassian for four years. design manager on Rovo Studio, Central AI. We are building AI with AI.. This is a talk about what we've actually learned in the last year or so — on both the tooling and the product space.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // 01 · OVERVIEW
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "overview",
    type: "overview",
    layout: "full",
    content: { heading: "What we'll cover", bullets: FIVE_SECTIONS },
    bg: { ascii: { ...fieldBg, sourceColors: [PHOSPHOR_GREEN, PHOSPHOR_DIM], backgroundColor: PHOSPHOR_BG, density: 0.4, animationIntensity: 0.4 } },
    notes: "25 minutes so 5 x 5 roughly. Slides will be available at the end.",
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
    notes: "You may have heard this phrase before. Now I have lived it.",
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
        "The teamwork graph elevates your organisation's shared context",
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
    notes: "The teamwork graph was the star of our recent TEAM conference. All enterprise AI is make or break on its underlying access to data. Relevancy is everything when AI is suggesting.. TWG is hard to imagine, but it's everywhere - in your chat responses, in your briefings, in your suggested edits, in your drafted work items, even sometimes in your meeting scheduling",
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
        "Atlassian is a read/write culture - so we have a lot of Confluence docs",
        "But the real star here is Loom, which allows you to record meetings",
        "Your goals, your priorities and your focus - as well as your thoughts in the moment - can now be fed into the next stage of your designs.",
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
    notes: "If the TWG connects all the info in the cloud that is made by your org.... The personal graph is really all the info that's in your head. As a read/write culture we do write a lot, but not EVERYTHING. It's amazing how much rich context you don't capture that only happens verbally. It's also a huge deal how much stuff you probably don't want to put on Confluence - e.g. your personal growth plan or your feedback for this person etc. Maybe it's there but it's locked down.. This is what people talk about when they think they've unlocked \"sentient chatgpt\" - it's essentially the context that can be extracted from you organically.",
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
        "Voice is critical for me - I can type fast but I can yap faster",
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
    notes: "Specificity makes a huge difference. For me, voice allows me to explain naturally, in an unstructured way. Rovo is excellent at bringing that messy thought dump into a structured artifact. I often use Rovo to write prompts to create agents, for example.",
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
    bg: { ascii: coloredImageAscii("/hands-puzzle-dark.jpeg", 6, { vignette: 0.35, density: 1.0, contrast: 1.4, animationIntensity: 0, animatedCharacters: false, characterCycleSpeed: 0 }) },
    notes: "As all the roles have blurred together (pm doing design, design doing eng, etc) there has been a focus on shipping. but we are increasingly finding quality needs to be aligned across crafts too.",
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
    notes: "Although our AI transformation has been rapid. We are also taking time out to learn new things regularly. A couple of weeks ago I flew to Sydney to teach 200 designers how to open PRs and vibe code. Our builders weeks have really helped the rising tide lift all boats. But AI skills are only part of this - it's important to keep our customers in mind too.",
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
    notes: "We build software for enterprise customers. Riley's talk will go really deep here. But we are holding tension between the need to ship fast for industry and our customers sometimes telling us to slow tf down. Decisions about AI have a lot of industry momentum but our customers don't want to turn on something half baked",
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
        "We are culturally hard-wired to use our own tools - this is good and bad",
        "Spending more time with customers is critically important & helps you identify the gaps",
        "You don't want customers doing your QA",
      ],
      modalBullet: 0,
    },
    bg: { ascii: coloredImageAscii("/dogfood.png", 9, { vignette: 0.3, density: 1.0, contrast: 1.6 }) },
    modal: {
      title: "Studio canvas — agent builder",
      tag: "DOGFOOD",
      blocks: [
        { kind: "video", src: "/design-reviews-agent-studio.mov", caption: "We build Studio. We use Studio. Every gap we feel, our customers feel ten times worse.", loop: true, muted: true },
      ],
      footer: "Source: Atlassian Studio · internal builds",
    },
    notes: "Dogfooding is in our DNA. We are culturally hard-wired to use our own tools - this is good and bad. Spending more time with customers is critically important & helps you identify the gaps. You don't want customers doing your QA.",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // §03 SECTION
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "s3-section",
    type: "section",
    layout: "full",
    label: { num: "03", text: FIVE_SECTIONS[2] },
    content: { heading: "Don't put a\nbird on it" },
    bg: { ascii: coloredFieldBg(10, { density: 0.55, animationStyle: "reveal", animationIntensity: 0.4 }) },
    notes: "One great way to increase quality is to make it a clear goal every craft is working towards. But as a 15,000 person company, teams will still diverge and duplicate work all the time",
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
        'The models reinforce this by outputting "averaged" ideas',
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
    notes: "What's the most obvious drawback of designing too fast? Premature convergence. I noticed a bunch of our key screens started to look basically the same. We also heard users finding them confusing - why can't I create a Confluence page from Studio?. The speed of the process + the nature of the tools (which already output \"averaged\" ideas)",
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
        { kind: "quote", text: "Hindering default actions like basic thing of column deletion.\nToo frustrating.", attribution: "Customer · enterprise admin" },
      ],
      footer: "Source: in-product feedback · 2026",
    },
    notes: "A big example of this premature convergence was the chat pattern. Example: hub builder, which is a website builder - chat was less fun than just direct selection of elements. We also know that our customers find chat/AI sometimes gets in the way. Example: turn by turn information gathering vs all in one go. It's a huge customer base and we have to support their varying preferences.",
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
        "The problem space Atlassian plays in has many great opportunities for AI - natural language automations, format transfer, large data sets",
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
          kind: "pipeline",
          input: "You provide: Topic + Keywords + Sources (optional)",
          output: "Verified Literature Review with confidence ratings",
          stages: [
            { heading: "Stage 1: Research_Synthesizer", sub: "→ \"State of the Research\"", body: "Reads all sources, extracts direct quotes, classifies evidence" },
            { heading: "Stage 2: Integrity_Auditor", sub: "→ Integrity Audit Report", body: "Independently verifies every quote, checks Jira statuses, catches hallucinations, validates search completeness" },
            { heading: "⚠ Quality Gate", body: "If Quote Accuracy < 80%, report flagged as unreliable" },
            { heading: "Stage 3: Insight_Critic", sub: "→ Gap Analysis & Critique", body: "Finds contradictions, sample bias, assigns Research Maturity Scores per theme, identifies what's missing" },
          ],
        },
      ],
      footer: "Source: hello.atlassian.net · Literature Review Agent",
    },
    notes: "Hard problems are the unlock. Atlassian has many great opportunities for AI - natural language automations, format transfer, large data sets. The most value we can provide to customers is making their hardest tasks easier. Our researcher built a three-agent system to do literature review.",
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
    notes: "Match the tool to the job. AI is one tool among many. One great way to increase quality is to make it a clear goal every craft is working towards. But as a 15,000 person company, teams will still diverge and duplicate work all the time.",
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
    notes: "Stop arguing about which AI tool is best. Different tools are suitable at different stages of the process. Generative tools for prototyping, automated tools for polishing.",
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
        "I made this deck in Rovodev, but had to use my notebook to design it",
      ],
      modalBullet: 2,
    },
    bg: { ascii: coloredFieldBg(5, { density: 0.45, animationStyle: "wave", animationIntensity: 0.25 }) },
    modal: {
      title: "Notebook plan — for this talk",
      tag: "ARTEFACT",
      blocks: [
        { kind: "image", src: "/pen.jpg", alt: "Notebook plan for this talk", caption: "The actual notebook · scrawled before any pixel was placed", dark: true },
      ],
      footer: "Photo: Milly's notebook",
    },
    notes: "We have had some token leaderboards go around, but ultimately have moved away from this. As much as we want to see the stats reveal that AI usage is increasing.... Different people think differently and different tools are needed for different tasks. Personal reflection on AI tools - life drawing example",
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
        "It also requires knowing our own capabilities - what tools are connected, what actions are available",
        "Finally, it requires democratisation of AI and automation tooling - available to everyone.",
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
            { term: "1 · Build prototypes", def: "Technical, AI-powered prototypes that live inside the AI Prototyping Sandbox or your team's repo.\n\nBuild the muscle and learn the language of engineering." },
            { term: "2 · Push what's possible", def: "Use AI to push how we work, communicate and make decisions faster.\n\nPush what's possible with your cross-craft team from inception to live." },
            { term: "3 · Ship to production", def: "Ship changes to production using code.\n\nLook for opportunities — big or small — and contribute shared components and patterns." },
          ],
        },
      ],
      footer: "Source: hello.atlassian.net · Path to AI-native",
    },
    notes: "As a technical person (I was a software eng before I was a designer) I think I have underestimated this bit. The instinct for understanding opportunities for automation is hard to teach. You also get it honed from experience. That means everyone has to be experimenting and building their intuitive understanding of the capabilities - which can be challenging from an org rollout perspective and the needs of security and trust, but also can be challenging when the tools are constantly evolving. I am finding myself revisiting things that didn't work and finding they suddenly are now possible, because stuff is shipping so fast. This kind of motion is very different to the way designers used to work -  I know Figma, I use Figma. It's closer to the metal.",
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
    notes: "This is a reference to a now very old meme that I think about a lot.",
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
    notes: "Our award-winning design system has been a huge part of our success with design adoption of AI. Being able to leverage our design system in replit, cursor, figma make - and not just the designs, but the CODE. Our design technologists have unlocked so much amazing stuff for us, including developing prototyping repos and skills like \"polish\" and \"tokenize\"",
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
        "Our documentation team leverage agents to audit, generate and adjust docs",
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
    notes: "Content design + LLM is a natural fit. Unsurprisingly, Large Language Models are great at language-oriented design systems. Our well-documented content design standards have been transformed into an agent and an agentic service desk. Our documentation team now uses agents to audit, generate and adjust docs.",
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
        'I created my own "second brain" - running entirely through CLI on md files',
        "Managing a team of ten across at least 30 projects at a time + my side quests, it's been invaluable",
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
      pages: [
        {
          title: "milly-os :: personal graph",
          tag: "PERSONAL OS · GRAPH",
          blocks: [
            { kind: "image", src: "/os-graph.png", alt: "Personal knowledge graph", caption: "My personal knowledge graph — every project, person, and decision connected" },
          ],
          footer: "Source: milly-os · personal graph",
        },
      ],
    },
    notes: "In some ways this has been actually the biggest unlock for me, as a manager. Story: Brendan asked me if I had \"set up my AI assistant\" a few months ago. It's all just folders of markdown files, but it's highly linked - as you can see in this graph generated by Obsidian. This is my biggest and most used project - literally every day, ingesting the trancripts of every meeting, it's connected to Slack, the TWG as well as the cache of private md files on my desktop. I will be using this system to do my own performance review documentation in a few weeks",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // IN SUMMARY
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "summary",
    type: "summary",
    layout: "full",
    content: { heading: "In summary", bullets: FIVE_SECTIONS },
    bg: { ascii: { ...fieldBg, sourceColors: [PHOSPHOR_GREEN, PHOSPHOR_DIM], backgroundColor: PHOSPHOR_BG, density: 0.4, animationIntensity: 0.5 } },
    notes: "I have built a number of other \"personal apps\" with productivity (and fun) in mind. Meeting manager - opens my zoom window and the relevant Confluence page simultaneously using window tiling. Time overview - stats about how much I've travelled and how much time I've spent in meetings over my four year tenure. TEAM companion - a small web app to manager my shifts on the booth and review the TEAM conference agenda at the same time. an OKR visualiser that shows how any piece of work maps to relevant OKRs. An agent that manages our design review process. An agent that triages incoming UX feedback into work items. An automation that generates my team's weekly meeting agenda notes.. This slide deck!",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // REFERENCES
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "references",
    type: "references",
    layout: "full",
    content: {
      heading: "Further reading",
      references: [
        { label: "Atlassian Design System", url: "atlassian.design" },
        { label: "Building the Context Engine for the AI Era", url: "atlassian.com/blog/ai-at-work" },
        { label: "Design Technologists: The Role That Turns Creativity into Code", url: "atlassian.com/blog/how-we-build" },
        { label: "Designing Dependable AI Products", url: "atlassian.com/blog/how-we-build" },
        { label: "AI Doesn't Reduce Work — It Intensifies It", url: "hbr.org" },
        { label: "Harness Design for Long-Running Apps", url: "anthropic.com/engineering" },
        { label: "Dictation: The Death of Prompt Engineering", url: "sarahandkate.substack.com" },
      ],
    },
    bg: { ascii: coloredFieldBg(20, { density: 0.3, animationIntensity: 0.2 }) },
    notes: "References for further reading. The URL is the best way to share the slides — it's all custom built. aixdesign.millyschmidt.me",
  },
  // ═══════════════════════════════════════════════════════════════════════
  // THANK YOU
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "thanks",
    type: "thanks",
    content: { title: "Thank you", subtitle: "Milly Schmidt · millyschmidt.me · atlassian.design\n\naixdesign.millyschmidt.me\ngithub.com/meelijane/aixdesign" },
    modal: {
      title: "The real helpers",
      tag: "BONUS",
      blocks: [
        { kind: "image", src: "/helpers.jpg", alt: "Cats helping write the talk", caption: "The real co-authors", pixel: { pixelSize: 2, levels: 8, threshold: 0.03, fit: "cover", contrast: 1.2, brightness: 1.0 } },
      ],
      footer: "🐱",
    },
    bg: { ascii: { ...fieldBg, sourceColors: [PHOSPHOR_GREEN, PHOSPHOR_DIM], backgroundColor: PHOSPHOR_BG, density: 0.35, animationIntensity: 0.8 } },
    notes: "The url is the best way to capture slides. It's all custom.",
  },
];
