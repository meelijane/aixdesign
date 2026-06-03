/**
 * engine/themes.ts
 * Built-in themes for the slide deck engine.
 * Pass any Theme to <Presentation theme={...} /> to customise the look.
 */
import type { Theme } from "./types";

/**
 * Dark theme — deep navy/black background with purple/violet accents.
 * This is the default theme, matching the original AIxDesign talk aesthetic.
 */
export const darkTheme: Theme = {
  name: "dark",
  bg: "#0a0a0f",
  fg: "#e8e8f0",
  accent1: "#7c6af7",
  accent2: "#a78bfa",
  dim: "#4a4a6a",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "color",
};

/**
 * Light theme — clean white background with blue accents.
 */
export const lightTheme: Theme = {
  name: "light",
  bg: "#f8f8fc",
  fg: "#1a1a2e",
  accent1: "#4f46e5",
  accent2: "#7c3aed",
  dim: "#9090a8",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "color",
};

/**
 * Phosphor theme — full green-on-black terminal aesthetic throughout.
 */
export const phosphorTheme: Theme = {
  name: "phosphor",
  bg: "#04120A",
  fg: "#7CFFB2",
  accent1: "#7CFFB2",
  accent2: "#3A9460",
  dim: "#1e4a30",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "phosphor",
};

/** All built-in themes, keyed by name for easy lookup */
export const THEMES: Record<string, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  phosphor: phosphorTheme,
};

export { darkTheme as defaultTheme };
