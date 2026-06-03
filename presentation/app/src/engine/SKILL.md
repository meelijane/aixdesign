---
name: slide-deck-creator
description: Use when creating a new slide deck presentation using the slide-deck engine from the meelijane/aixdesign repo. Covers markdown format, theme config, slide types, layouts, and how to wire everything together.
---

# Slide Deck Creator

A React + Vite engine for building beautiful full-screen presentations with ASCII art backgrounds, speaker notes, and rich modal content. Slides are authored in markdown and rendered at runtime.

## Quick Start

1. Write your talk in `src/content/talk.md`
2. Run `npm run dev` in `presentation/app/`
3. Open `http://localhost:5173` (slides) and `http://localhost:5173/notes.html` (speaker notes)

---

## Markdown Format

Slides are separated by `---`. Each slide has optional frontmatter in `+++` fences.

```markdown
+++
type: hero
layout: full
id: hero
notes: Speaker notes go here
+++
# Talk Title
## Subtitle or conference name

---

+++
type: section
layout: full
palette: phosphor
label: "1 · First Section"
notes: Intro to this section
+++
# First Section

---

+++
type: body
layout: full
palette: phosphor
label: "1.1 · First Point"
notes: Talk about the first point here
+++
# The Heading
- Bullet one
- Bullet two
- Bullet three [modal]
```

### Frontmatter Fields

| Field | Values | Notes |
|-------|--------|-------|
| `type` | `hero`, `section`, `body`, `overview`, `summary`, `thanks`, `references` | Defaults to `hero` for first slide, `body` for rest |
| `layout` | `full`, `split-left`, `split-right`, `deco`, `bare` | Defaults to `full` |
| `palette` | `color`, `phosphor` | `phosphor` = green terminal aesthetic |
| `id` | string | URL hash ID — auto-generated from title if omitted |
| `label` | `"1 · Section Name"` | Shown in slide corner |
| `bg-image` | `/path/to/image.jpg` | Background image (also rendered as ASCII art) |
| `notes` | string | Speaker notes text |

### Body Syntax

```markdown
# Heading          → title (hero/thanks) or heading (body/section)
## Subtitle        → subtitle (hero) or secondary text (body)
### Footer         → footer text
> Quote text       → blockquote
*Attribution*      → quote attribution (must follow a blockquote)
- Bullet [modal]   → [modal] marks which bullet triggers the modal overlay
~~ Secondary text  → secondary paragraph
[NOTES]: # (text)  → alternative speaker notes syntax
```

---

## Themes

Pass a `Theme` to the `<App>` component in `main.tsx`:

```tsx
import { darkTheme } from "./engine";
<App theme={darkTheme} />
```

### Built-in Themes

| Name | Description |
|------|-------------|
| `darkTheme` | Deep navy/black with purple accents (default) |
| `lightTheme` | White background with blue accents |
| `phosphorTheme` | Full green-on-black terminal aesthetic |

### Custom Theme

```ts
import type { Theme } from "./engine";

const myTheme: Theme = {
  name: "ocean",
  bg: "#0a1628",
  fg: "#e0f0ff",
  accent1: "#38bdf8",
  accent2: "#7dd3fc",
  dim: "#334d6e",
  phosphor: "#7CFFB2",
  phosphorBg: "#04120A",
  defaultPalette: "color",
};
```

---

## Layouts

| Layout | Description |
|--------|-------------|
| `full` | Full-screen ASCII background, text floats with soft radial gradient glow |
| `split-right` | Text left, ASCII/image fades in from right |
| `split-left` | Text right, ASCII/image fades in from left |
| `deco` | Similar to full, slight position variation |
| `bare` | No background treatment |

---

## Slide Types

| Type | Purpose | Key content |
|------|---------|-------------|
| `hero` | Opening title | `title`, `subtitle` |
| `section` | Section divider | `heading`, `secondary` |
| `body` | Main content | `heading`, `bullets`, `body`, `quote` |
| `overview` | Talk map / agenda | `heading`, `bullets` |
| `summary` | Closing recap | Same as body |
| `thanks` | Thank you slide | `title`, `subtitle` |
| `references` | Further reading | Define in `slides.ts` (needs `content.references[]`) |

---

## Wiring Markdown in App.tsx

To use markdown as the source of truth instead of `slides.ts`:

```tsx
import { parseMarkdown } from "./engine";
import talkMd from "./content/talk.md?raw";
import { SLIDES as TS_SLIDES } from "./content/slides";

// Use markdown-parsed slides:
const SLIDES = parseMarkdown(talkMd);

// Or mix — use TS_SLIDES for complex slides with modals, markdown for simple ones:
const SLIDES = [...parseMarkdown(talkMd), ...TS_SLIDES];
```

---

## Modals

Modals are triggered by the bullet marked `[modal]`. They're defined in TypeScript in `content/slides.ts` because they contain rich structured content. Add a `modal` property to a `Slide` object.

### Modal Block Types

| Kind | Description |
|------|-------------|
| `image` | Single image with optional pixel/CRT shader |
| `video` | Looping video |
| `text` | Body text or paragraphs |
| `quote` | Blockquote with attribution |
| `bullets` | Simple bullet list |
| `list` | Definition list (term + definition) |
| `code` | Code block with syntax highlighting |
| `graph` | Animated SVG node-graph |
| `terminal` | Terminal / CLI mock with prompt/output lines |
| `flow` | Stage-to-stage flow diagram |
| `chat` | Slack-style chat thread |
| `grid` | Grid of UI cards |
| `image-grid` | Grid of images with pixel shader |
| `image-carousel` | Auto-scrolling image carousel |
| `pipeline` | Pipeline diagram with input/stages/output |

Multi-page modals: add a `pages` array to cycle through with arrow keys.

---

## File Structure

```
presentation/app/src/
  engine/
    types.ts      ← All types: Slide, Theme, ModalBlock, etc.
    themes.ts     ← darkTheme, lightTheme, phosphorTheme
    markdown.ts   ← parseMarkdown() — converts .md to Slide[]
    index.ts      ← Public API (import from here)
    SKILL.md      ← This file
  content/
    slides.ts     ← TypeScript slide definitions (complex slides with modals)
    talk.md       ← Markdown source (simple slides)
  shaders/
    ascii.tsx     ← ASCII art WebGL shader
    pixel.tsx     ← Pixel/CRT WebGL shader (used in modals)
  App.tsx         ← Presentation engine
  App.css         ← All styles
```

---

## Speaker Notes

Open `http://localhost:5173/notes.html` in a second window/screen. Shows:
- **Top row:** slide preview + slide title/bullets
- **Bottom row:** speaker notes in large text

Notes sync automatically via `localStorage` as you navigate slides.

---

## Common Patterns

### Section with phosphor palette
```markdown
+++
type: section
layout: full
palette: phosphor
label: "2 · My Section"
notes: Intro talking points here
+++
# My Section Title
```

### Split slide with image
```markdown
+++
type: body
layout: split-right
bg-image: /my-image.jpg
notes: The image fades in from the right
+++
# My Heading
- Point one
- Point two
```

### Quote slide
```markdown
+++
type: body
layout: full
+++
# Quote Slide

> The best way to predict the future is to invent it.
*Alan Kay*
```
