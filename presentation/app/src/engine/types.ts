/**
 * engine/types.ts
 * Core type definitions for the slide deck engine.
 * These are engine-level types — no talk-specific content lives here.
 */
import type { AsciiProps } from "../shaders/ascii";
import type { PixelProps } from "../shaders/pixel";

export type SlideType =
  | "hero"
  | "section"
  | "overview"
  | "body"
  | "summary"
  | "thanks"
  | "references";

export type Layout =
  | "full"
  | "split-left"
  | "split-right"
  | "deco"
  | "bare";

export type Palette = "color" | "phosphor";

export type ModalBlock =
  | { kind: "image"; src: string; alt?: string; caption?: string; pixel?: Partial<PixelProps>; dark?: boolean }
  | { kind: "video"; src: string; caption?: string; loop?: boolean; muted?: boolean }
  | { kind: "text"; body: string | string[] }
  | { kind: "quote"; text: string; attribution?: string; image?: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "list"; items: { term: string; def: string }[] }
  | { kind: "code"; lang?: string; body: string }
  | { kind: "graph"; caption?: string; nodes?: number; edges?: number }
  | { kind: "terminal"; title?: string; lines: TerminalLine[]; cursor?: boolean }
  | { kind: "flow"; stages: { label: string; sub?: string; color?: string }[] }
  | { kind: "chat"; channel?: string; messages: ChatMessage[] }
  | { kind: "grid"; columns?: number; cards: { title: string; lines?: string[] }[] }
  | { kind: "image-grid"; columns?: number; images: { src: string; caption?: string }[] }
  | { kind: "image-carousel"; images: { src: string; caption?: string }[]; interval?: number }
  | { kind: "pipeline"; input: string; output: string; stages: { heading: string; sub?: string; body: string }[] };

export type TerminalLine =
  | { type: "prompt"; user?: string; cmd: string }
  | { type: "out"; text: string }
  | { type: "comment"; text: string }
  | { type: "blank" };

export type ChatMessage = {
  author: string;
  badge?: string;
  text: string;
  time?: string;
};

export type ModalPage = {
  title?: string;
  tag?: string;
  blocks: ModalBlock[];
  footer?: string;
};

export type Modal = {
  title: string;
  tag?: string;
  blocks: ModalBlock[];
  footer?: string;
  todo?: boolean;
  pages?: ModalPage[];
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
    modalBullet?: number;
    quote?: string;
    attribution?: string;
    footer?: string;
    references?: { label: string; url: string }[];
  };
  bg?: {
    image?: string;
    ascii?: Partial<AsciiProps>;
  };
  modal?: Modal;
  notes?: string;
};

/**
 * Theme configuration — controls colours and visual style of the presentation.
 * Pass a Theme to the <Presentation> component to customise the look.
 */
export type Theme = {
  /** Display name for the theme */
  name: string;
  /** Main background colour */
  bg: string;
  /** Primary foreground / text colour */
  fg: string;
  /** Primary accent colour (headings, highlights) */
  accent1: string;
  /** Secondary accent colour (bullets, secondary text) */
  accent2: string;
  /** Dim / muted colour (labels, hints) */
  dim: string;
  /** Phosphor / terminal green (used in phosphor palette slides) */
  phosphor: string;
  /** Phosphor palette background */
  phosphorBg: string;
  /** Default slide palette */
  defaultPalette: "color" | "phosphor";

  /**
   * Background style for slides without an explicit bg image.
   * - "ascii"  — render ASCII art shader (phosphor theme default)
   * - "noise"  — subtle CSS grain/noise texture (dark/light theme default)
   * - "solid"  — flat background colour only
   */
  bgStyle: "ascii" | "noise" | "solid";

  /**
   * Primary font stack for headings and body text.
   * - "mono"  — Space Mono / monospace (phosphor theme)
   * - "serif" — Averia Serif Libre / serif (dark/light theme)
   * - "sans"  — Inter / system sans-serif
   */
  fontStack: "mono" | "serif" | "sans";

  /**
   * Whether slides should show ASCII art in the background when a bg image is provided.
   * true = render image through ASCII shader (phosphor)
   * false = render image directly with gradient/blur overlay (dark/light)
   */
  asciiImages: boolean;

  /**
   * Modal colour scheme.
   * - "phosphor" — dark green terminal modal (default for phosphor theme)
   * - "dark"     — dark neutral modal
   * - "light"    — light/white modal
   */
  modalStyle: "phosphor" | "dark" | "light";
};
