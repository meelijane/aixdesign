/**
 * engine/themes.ts
 * Built-in themes for the slide deck engine.
 * Pass any Theme to <Presentation theme={...} /> to customise the look.
 */
import type { Theme } from "./types";

/**
 * Dark theme — serif typography, noise texture background, no ASCII art.
 * Clean and editorial. Images rendered directly with gradient overlay.
 */
export const darkTheme: Theme = {
  name: "dark",
  bg: "#0f0e0c",
  fg: "#e8e4dc",
  accent1: "#c9a96e",
  accent2: "#a07840",
  dim: "#4a4540",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "color",
  bgStyle: "noise",
  fontStack: "serif",
  asciiImages: false,
  modalStyle: "dark",
};

/**
 * Light theme — same as dark but inverted. Serif font, noise texture, clean modals.
 */
export const lightTheme: Theme = {
  name: "light",
  bg: "#f5f2eb",
  fg: "#1a1714",
  accent1: "#8b5e1a",
  accent2: "#c9893a",
  dim: "#a09880",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "color",
  bgStyle: "noise",
  fontStack: "serif",
  asciiImages: false,
  modalStyle: "light",
};

/**
 * Phosphor theme — ASCII art, terminal green accents, monospace font.
 * The full-featured original aesthetic.
 */
export const phosphorTheme: Theme = {
  name: "phosphor",
  bg: "#04120A",
  fg: "#e8e8f0",
  accent1: "#7CFFB2",
  accent2: "#3A9460",
  dim: "#2a5a3a",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "color",
  bgStyle: "ascii",
  fontStack: "mono",
  asciiImages: true,
  modalStyle: "phosphor",
};

/** All built-in themes, keyed by name for easy lookup */
export const THEMES: Record<string, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  phosphor: phosphorTheme,
};

export { darkTheme as defaultTheme };
