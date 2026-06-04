# Slide Deck Engine — Refactor Plan

A staged plan to migrate `presentation/app/` from a single monolithic React component + one giant CSS file into a properly architected, themeable slide deck engine using CSS Modules.

## Why Refactor

The current codebase has accumulated technical debt:

- **`App.tsx` is ~1,170 lines** — orchestration, slide rendering, modal layer, illustrations, and helpers all in one file. Hard to reason about and extend.
- **`App.css` is ~2,090 lines** — global selectors with deep specificity chains. The recent theme work led to `!important` ladders and styles leaking between themes (phosphor green appearing in dark/light, mono fonts in serif themes).
- **Theme system half-built** — `Theme` type + `themeVars` injection works for colours, but font/palette behaviour can't be cleanly switched because everything is global.

## Goals

1. **Component-scoped styles** via CSS Modules — no more specificity wars
2. **Clean theme switching** with no style leakage between themes
3. **Component-per-file architecture** — each major piece (Slide, Modal, Background, etc.) in its own file
4. **Engine/content separation preserved** — keep the `engine/` and `content/` split established earlier
5. **No regression** in the existing AIxDesign talk presentation

## Setting Up the New Repo

Before starting the refactor, fork the codebase into a new repo to protect the talk site:

### Option A — Finder copy (recommended for clean break)

1. In Finder, duplicate the `aixdesign` workspace folder → rename to `slide-deck-engine`
2. In the new folder, delete `.git/` to remove history
3. Open Terminal in the new folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — forked from aixdesign presentation"
   ```
4. Create a new repo on GitHub (`slide-deck-engine` or similar)
5. Push:
   ```bash
   git remote add origin git@github.com:meelijane/slide-deck-engine.git
   git push -u origin main
   ```
6. The original `aixdesign` repo stays untouched

### Option B — Git remote split

```bash
cd aixdesign
git checkout main  # or whichever branch is your stable talk version
cp -R . /path/to/slide-deck-engine
cd /path/to/slide-deck-engine
rm -rf .git
git init
# ...as above
```

## Architecture After Refactor

```
src/
  engine/                       # Public API of the engine
    types.ts                    # Slide, Theme, ModalBlock types
    themes.ts                   # darkTheme, lightTheme, phosphorTheme
    markdown.ts                 # parseMarkdown()
    index.ts                    # Re-exports
    SKILL.md                    # Rovo Dev skill doc

  components/                   # All React components
    Presentation.tsx            # Top-level orchestration (was App.tsx)
    Slide.tsx                   # Single slide wrapper
    SlideContent.tsx            # Switches on slide.type
    slides/                     # Per-type renderers
      HeroSlide.tsx
      SectionSlide.tsx
      BodySlide.tsx
      OverviewSlide.tsx
      ThanksSlide.tsx
      ReferencesSlide.tsx
    Background.tsx              # Bg layers (ASCII, image, pattern)
    Modal.tsx                   # Modal layer
    ModalBlock.tsx              # Switches on block.kind
    blocks/                     # Per-kind block renderers
      ImageBlock.tsx
      VideoBlock.tsx
      QuoteBlock.tsx
      CodeBlock.tsx
      GraphBlock.tsx
      TerminalBlock.tsx
      FlowBlock.tsx
      ChatBlock.tsx
      GridBlock.tsx
      ImageGridBlock.tsx
      ImageCarouselBlock.tsx
      PipelineBlock.tsx
    overlays/
      Settings.tsx              # Theme picker
      Overview.tsx              # All-slides grid
      Notes.tsx                 # Inline notes
      Preloader.tsx             # Loading screen
    ui/
      Label.tsx                 # Slide label badge
      Progress.tsx              # Slide counter
      Hint.tsx                  # Bottom hint bar
      ModalHint.tsx             # "MORE — press →" indicator

  styles/                       # CSS Modules (one per component group)
    tokens.module.css           # Theme variable definitions
    Presentation.module.css     # Root container, fade
    Slide.module.css            # Slide layouts, text panels
    SlideContent.module.css     # Hero/section/body content styles
    Background.module.css       # Bg layers, vignette
    Modal.module.css            # Modal frame, blocks
    Settings.module.css         # Settings panel
    Overview.module.css         # Overview grid
    Notes.module.css            # Notes overlays
    UI.module.css               # Labels, progress, hints

  shaders/                      # Unchanged
    ascii.tsx
    pixel.tsx
    pattern.tsx

  content/
    slides.ts                   # AIxDesign talk content (or any other deck)
    talk.md                     # Markdown source

  hooks/                        # Extracted custom hooks
    useKeyboard.ts
    usePreloader.ts
    usePresenterSync.ts         # iframe state sync via localStorage
    useUrlHash.ts               # URL ↔ slide index

  utils/
    collectAssets.ts            # Asset URL collection for preloader

  App.tsx                       # Thin entry — <Presentation slides={SLIDES} theme={...} />
  main.tsx                      # React entry
```

## Theme System Design

CSS variables are the unit of theming. Each theme is a class on the root element that defines its own variable scope.

```css
/* tokens.module.css */
.root {
  --font-mono: "Space Mono", monospace;
  --font-serif: "Averia Serif Libre", serif;
}
.themePhosphor {
  --bg: #04120A;
  --fg: #e8e8f0;
  --accent: #7CFFB2;
  --phosphor: #7CFFB2;
  --font-heading: var(--font-serif);
  --font-ui: var(--font-mono);
}
.themeDark {
  --bg: #0f0e0c;
  --fg: #e8e4dc;
  --accent: #c9a96e;
  --phosphor: var(--accent);  /* remap so .phosphor references don't leak green */
  --font-heading: var(--font-serif);
  --font-ui: var(--font-serif);
}
.themeLight { /* ... */ }
```

Component CSS only reads variables — never hardcodes colours:

```css
/* SlideContent.module.css */
.heroTitle {
  font-family: var(--font-heading);
  color: var(--fg);
}
```

Behaviour flags (`bgStyle`, `asciiImages`, `modalStyle`) move to data attributes on the root for clean CSS selectors:

```tsx
<div className={`${styles.root} ${styles[`theme${capitalize(theme.name)}`]}`}
     data-bg-style={theme.bgStyle}
     data-modal-style={theme.modalStyle}>
```

```css
/* Background.module.css */
.bgImage[data-mode="ascii"] { /* render via ASCII shader, handled in JSX */ }
[data-bg-style="ascii"] .bgImage { filter: invert(1); }
```

---

## Subtasks (in suggested order)

Each task should be a separate commit. Build + verify visually after each major group.

### Phase 1 — Setup & Foundation (1 subagent)

1. **T1: Set up new repo** (manual, see "Setting Up the New Repo" above)
2. **T2: Create folder structure** — `components/`, `styles/`, `hooks/`, `utils/`, plus subfolders
3. **T3: Extract custom hooks** from `App.tsx`:
   - `useKeyboard.ts` (already-defined hook)
   - `usePreloader.ts` (already-defined hook)
   - `usePresenterSync.ts` (iframe state effect)
   - `useUrlHash.ts` (URL ↔ index effect)
4. **T4: Extract utils**:
   - `collectAssets.ts` (the asset URL collector)
5. **T5: Create `tokens.module.css`** with all three themes defined as CSS variable scopes
6. **T6: Verify build + manual smoke test** — old App.tsx still uses old App.css, but hooks/utils are now imports

### Phase 2 — Background & Shaders (1 subagent)

7. **T7: Create `Background.tsx`** — takes `slide` and `theme`, renders ASCII / image / pattern / vignette
8. **T8: Create `Background.module.css`** — all background-related styles, scoped
9. **T9: Wire into App.tsx** — replace inline JSX with `<Background slide={slide} theme={theme} />`
10. **T10: Build + verify** — all themes' backgrounds render correctly

### Phase 3 — Slide & SlideContent (1 subagent)

11. **T11: Extract slide-type renderers** to `components/slides/*.tsx` (Hero, Section, Body, Overview, Thanks, References, Summary)
12. **T12: Create `Slide.tsx`** wrapper — layout class, text panel container
13. **T13: Create `SlideContent.tsx`** dispatcher — calls the right slide-type renderer
14. **T14: Create `Slide.module.css`** and `SlideContent.module.css`
15. **T15: Wire into App.tsx**; verify visually

### Phase 4 — Modal & Blocks (1 subagent)

16. **T16: Extract block renderers** to `components/blocks/*.tsx` (one per `ModalBlock["kind"]`)
17. **T17: Extract illustrations** (`GraphIllustration`, `TerminalIllustration`, etc.) — they can either stay as helpers in `Modal.tsx` or move to their own files
18. **T18: Create `Modal.tsx`** + `ModalBlock.tsx` dispatcher
19. **T19: Create `Modal.module.css`** with `data-modal-style` selectors for phosphor/dark/light variants
20. **T20: Wire into App.tsx`; verify each block type renders correctly across themes

### Phase 5 — Overlays & UI (1 subagent)

21. **T21: Extract overlays** — `Settings.tsx`, `Overview.tsx`, `Notes.tsx`, `Preloader.tsx`
22. **T22: Extract UI components** — `Label.tsx`, `Progress.tsx`, `Hint.tsx`, `ModalHint.tsx`
23. **T23: Create matching CSS modules** for each
24. **T24: Wire into App.tsx`; verify visually

### Phase 6 — Cleanup & Verification

25. **T25: Slim App.tsx down to `<Presentation>`** — should be ~20 lines
26. **T26: Move composition into `Presentation.tsx`** — handles state, keyboard, theme, renders other components
27. **T27: Delete `App.css`** — only `index.css` should remain for global resets/fonts
28. **T28: Run full presentation in all three themes** — verify no leaking, no specificity bugs
29. **T29: Update `SKILL.md`** to reflect new architecture
30. **T30: Update `README.md`** with new structure

### Phase 7 — New Features Enabled by Refactor (future)

- **Mobile layout** — components can have their own responsive styles
- **More themes** — sepia, high-contrast, brand themes — each is just a new theme class
- **Markdown-first workflow** — parser already exists, hook it up as the primary source
- **Visual essay mode** — separate `<Essay>` component using same slide content with vertical scroll layout

## Working with Subagents

This plan is structured so each phase can be assigned to a single subagent with a clear deliverable:

**Agent instruction template:**
> You're refactoring a React + Vite slide deck app from one big file (`App.tsx` + `App.css`) into CSS Modules + component-per-file architecture. Read `REFACTOR-PLAN.md` for full context. Your task is **Phase N** (tasks Tx–Ty). For each task: create the file(s), implement, run `npm run build`, and commit with a descriptive message. After all tasks in your phase: run the dev server and verify visually that the deck still works in all three themes (dark, light, phosphor). If anything regresses, fix before completing. Report back with: commits made, any issues encountered, screenshots/notes.

**Safe parallelism:** Phases 2, 3, 4, 5 can be done in parallel IF they don't touch overlapping code. Recommended sequence: Phase 1 first (foundation), then 2+3+4+5 in parallel, then 6+7 last.

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Component extraction breaks styling | Build + manual test after each phase |
| CSS Modules class collisions | Each module owns a flat namespace; use clear names |
| Theme variable leakage | Scope all colour use to `var(--*)`, never hardcode |
| Modal styling regressions | Test all 13 block types in all 3 themes |
| Lost git history | Use `git mv` where possible; document moves in commit messages |

## Definition of Done

- ✅ `App.tsx` < 50 lines
- ✅ `App.css` deleted
- ✅ Each major component in its own file
- ✅ Each component has a co-located `.module.css`
- ✅ All three themes (dark, light, phosphor) render cleanly with no style leakage
- ✅ All slide types render correctly
- ✅ All 13 modal block types render correctly across all themes
- ✅ Keyboard shortcuts work
- ✅ URL hash navigation works
- ✅ Speaker notes window works
- ✅ Settings panel works
- ✅ Overview works
- ✅ Build passes with zero TypeScript errors
- ✅ SKILL.md updated to reflect new structure
