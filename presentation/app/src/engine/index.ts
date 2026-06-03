/**
 * engine/index.ts
 * Public API for the slide deck engine.
 * Import from here to use the engine in your presentation.
 *
 * @example
 * ```tsx
 * import { parseMarkdown, darkTheme } from "./engine";
 * import talkMd from "./content/talk.md?raw";
 *
 * const slides = parseMarkdown(talkMd);
 * // <Presentation slides={slides} theme={darkTheme} />
 * ```
 */

export type {
  Slide,
  SlideType,
  Layout,
  Palette,
  Theme,
  Modal,
  ModalBlock,
  ModalPage,
  TerminalLine,
  ChatMessage,
} from "./types";

export { parseMarkdown } from "./markdown";

export {
  darkTheme,
  lightTheme,
  phosphorTheme,
  defaultTheme,
  THEMES,
} from "./themes";
