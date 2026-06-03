/**
 * engine/markdown.ts
 * Parses a markdown string into Slide[] for the deck engine.
 *
 * ## Format
 *
 * Slides are separated by `---` (horizontal rule).
 * Each slide can have optional YAML-like frontmatter between `+++` fences.
 *
 * ### Frontmatter fields
 * ```
 * +++
 * type: hero | section | body | overview | summary | thanks | references
 * layout: full | split-left | split-right | deco | bare
 * palette: color | phosphor
 * id: my-slide-id
 * label: "1.1 · My Section"
 * bg-image: /path/to/image.jpg
 * notes: Speaker notes go here
 * +++
 * ```
 *
 * ### Body content (after frontmatter)
 *
 * - `# Title` → content.title (hero) or content.heading (body/section)
 * - `## Subtitle` → content.subtitle
 * - `> Quote text` → content.quote
 * - `*Attribution*` after a quote → content.attribution
 * - `- bullet` → content.bullets[]
 * - Plain paragraph text → content.body
 * - `[NOTES]: # (Speaker note text)` → notes (alternative to frontmatter)
 *
 * ### Example
 * ```markdown
 * +++
 * type: hero
 * layout: full
 * id: hero
 * +++
 * # My Talk Title
 * ## A subtitle or conference name
 *
 * ---
 *
 * +++
 * type: section
 * layout: full
 * palette: phosphor
 * label: "1 · First Section"
 * notes: Talk about the first section here
 * +++
 * # Section One
 * What this section is about
 *
 * ---
 *
 * +++
 * type: body
 * layout: full
 * +++
 * # Slide Heading
 * - Bullet one
 * - Bullet two
 * - Bullet three [modal]
 * ```
 */

import type { Slide, SlideType, Layout, Palette } from "./types";

// ── Frontmatter parsing ──────────────────────────────────────────────────────

type Frontmatter = {
  type?: SlideType;
  layout?: Layout;
  palette?: Palette;
  id?: string;
  label?: string;
  "label-num"?: string;
  "label-text"?: string;
  "bg-image"?: string;
  notes?: string;
  "modal-bullet"?: string;
};

function parseFrontmatter(raw: string): Frontmatter {
  const fm: Frontmatter = {};
  for (const line of raw.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim() as keyof Frontmatter;
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    (fm as Record<string, string>)[key] = value;
  }
  return fm;
}

// ── Body content parsing ─────────────────────────────────────────────────────

type ParsedBody = {
  title?: string;
  subtitle?: string;
  heading?: string;
  secondary?: string;
  body?: string;
  bullets?: string[];
  modalBullet?: number;
  quote?: string;
  attribution?: string;
  footer?: string;
  notes?: string;
};

function parseBody(raw: string): ParsedBody {
  const result: ParsedBody = {};
  const lines = raw.split("\n");
  const bullets: string[] = [];
  let modalBullet: number | undefined;
  let inQuote = false;
  let quoteLines: string[] = [];
  let bodyLines: string[] = [];
  let secondaryLines: string[] = [];
  let footerLine: string | undefined;
  let notesLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Notes via markdown comment syntax: [NOTES]: # (text)
    const notesMatch = line.match(/^\[NOTES\]:\s*#\s*\((.+)\)$/);
    if (notesMatch) {
      notesLines.push(notesMatch[1]);
      continue;
    }

    // H1 → title (hero) or heading (other types)
    if (line.startsWith("# ")) {
      const text = line.slice(2).trim();
      if (!result.title && !result.heading) {
        // We'll resolve title vs heading based on slide type later
        result.title = text;
        result.heading = text;
      }
      continue;
    }

    // H2 → subtitle or secondary
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      if (!result.subtitle) {
        result.subtitle = text;
        result.secondary = text;
      }
      continue;
    }

    // H3 → footer
    if (line.startsWith("### ")) {
      footerLine = line.slice(4).trim();
      continue;
    }

    // Blockquote → quote
    if (line.startsWith("> ")) {
      inQuote = true;
      quoteLines.push(line.slice(2).trim());
      continue;
    }

    // Attribution after quote: *text* or _text_
    if (inQuote && (line.startsWith("*") || line.startsWith("_"))) {
      result.attribution = line.replace(/^\*|_|\*$|_$/g, "").trim();
      inQuote = false;
      result.quote = quoteLines.join(" ");
      quoteLines = [];
      continue;
    }

    // If we were in a quote and hit something else, close it
    if (inQuote && quoteLines.length > 0) {
      result.quote = quoteLines.join(" ");
      quoteLines = [];
      inQuote = false;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      let text = line.slice(2).trim();
      const isModal = text.includes("[modal]");
      if (isModal) {
        text = text.replace("[modal]", "").trim();
        modalBullet = bullets.length;
      }
      bullets.push(text);
      continue;
    }

    // Secondary paragraph (starts with ~~ or is after a blank line following content)
    if (line.startsWith("~~ ")) {
      secondaryLines.push(line.slice(3).trim());
      continue;
    }

    // Everything else → body text
    bodyLines.push(line);
  }

  // Flush quote if unclosed
  if (quoteLines.length > 0) {
    result.quote = quoteLines.join(" ");
  }

  if (notesLines.length > 0) {
    result.notes = notesLines.join(" ");
  }

  if (bullets.length > 0) {
    result.bullets = bullets;
    if (modalBullet !== undefined) result.modalBullet = modalBullet;
  }

  if (bodyLines.length > 0) {
    result.body = bodyLines.join("\n");
  }

  if (secondaryLines.length > 0) {
    result.secondary = secondaryLines.join("\n");
  }

  if (footerLine) {
    result.footer = footerLine;
  }

  return result;
}

// ── Slug / ID generation ─────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

// ── Main parser ──────────────────────────────────────────────────────────────

/**
 * Parse a markdown string into an array of Slide objects.
 *
 * @param markdown - The full markdown content of the deck
 * @returns Slide[] ready to pass to <Presentation slides={...} />
 */
export function parseMarkdown(markdown: string): Slide[] {
  // Split on `---` slide separators (must be on its own line)
  const blocks = markdown.split(/^---$/m).map((b) => b.trim()).filter(Boolean);

  const slides: Slide[] = [];
  let slideIndex = 0;

  for (const block of blocks) {
    // Extract frontmatter between +++ fences
    let fmRaw = "";
    let bodyRaw = block;

    const fmMatch = block.match(/^\+\+\+([\s\S]*?)\+\+\+([\s\S]*)$/);
    if (fmMatch) {
      fmRaw = fmMatch[1].trim();
      bodyRaw = fmMatch[2].trim();
    }

    const fm = parseFrontmatter(fmRaw);
    const body = parseBody(bodyRaw);

    // Determine type, defaulting based on position/content
    const type: SlideType = fm.type ?? (slideIndex === 0 ? "hero" : "body");
    const layout: Layout = fm.layout ?? "full";
    const palette: Palette | undefined = fm.palette as Palette | undefined;

    // Generate a stable ID
    const id = fm.id ?? slugify(body.heading ?? body.title ?? `slide-${slideIndex}`);

    // Build label if specified
    let label: Slide["label"] | undefined;
    if (fm.label) {
      const parts = fm.label.split("·").map((s) => s.trim());
      label = { num: parts[0] ?? "", text: parts[1] ?? fm.label };
    } else if (fm["label-num"] && fm["label-text"]) {
      label = { num: fm["label-num"], text: fm["label-text"] };
    }

    // Resolve title vs heading based on type
    const isHero = type === "hero" || type === "thanks";
    const rawContent: Record<string, unknown> = {
      ...(isHero
        ? { title: body.title, subtitle: body.subtitle ?? body.secondary }
        : { heading: body.heading ?? body.title, secondary: body.secondary ?? body.subtitle }),
      body: body.body,
      bullets: body.bullets,
      modalBullet: body.modalBullet,
      quote: body.quote,
      attribution: body.attribution,
      footer: body.footer,
    };

    // Strip undefined values from content
    const cleanContent = Object.fromEntries(
      Object.entries(rawContent).filter(([, v]) => v !== undefined)
    ) as Slide["content"];

    const slide: Slide = {
      id,
      type,
      layout,
      ...(palette ? { palette } : {}),
      ...(label ? { label } : {}),
      content: Object.keys(cleanContent ?? {}).length > 0 ? cleanContent : undefined,
      ...(fm["bg-image"] ? { bg: { image: fm["bg-image"] } } : {}),
      notes: fm.notes ?? body.notes,
    };

    slides.push(slide);
    slideIndex++;
  }

  return slides;
}
