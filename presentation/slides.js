// ── Talk content ───────────────────────────────────────────────────────────
// Lessons from the AI Frontier — Milly Schmidt
// AIxDesign Melbourne, 2026 · 25 minutes
//
// Edit this file to update the talk. Add as many slides as needed.
// Each slide has: id, type, label, content (type-specific), notes (speaker notes)
//
// Types: hero | section | quote | bullets | body | split
// ──────────────────────────────────────────────────────────────────────────

const SLIDES = [

  // ── HERO ──────────────────────────────────────────────────────────────────
  {
    id: 'hero',
    type: 'hero',
    bg: { src: '../references/ascii-art.gif', animated: true },
    content: {
      title: ['LESSONS', 'FROM THE', '<em>AI FRONTIER</em>'],
      sub: 'Milly Schmidt · Atlassian · AIxDesign Melbourne',
      deco: `
┌─────────────────────────────────┐
│  AI × DESIGN                    │
│  ──────────────────────────     │
│  25 minutes. No slides.         │
│  Well — almost no slides.       │
└─────────────────────────────────┘`.trim(),
    },
    notes: 'Wait for intro to finish. Pause. Look at the room. Start with silence.',
  },

  // ── OPENING ───────────────────────────────────────────────────────────────
  {
    id: 'opening-honest',
    type: 'quote',
    label: { num: '00', text: 'Opening' },
    content: {
      quote: 'I was not an AI booster from the start.',
      body: 'Not a conversion story dressed up as enthusiasm. Genuine scepticism — about the hype, about what was actually being promised, about whether any of it was real.',
    },
    notes: 'Let this breathe. Don\'t rush past the scepticism — the audience needs to know this isn\'t a pitch.',
  },

  {
    id: 'opening-claude',
    type: 'body',
    label: { num: '00', text: 'Opening' },
    content: {
      heading: 'The thing that changed my mind',
      body: 'It wasn\'t a demo. It wasn\'t a white paper.\n\nIt was Claude Opus. The jump in capability was undeniable — the first time I felt like I was talking to something that could actually <strong>reason.</strong>\n\nThat changed the frame for me.',
    },
    notes: 'Be specific here — what did it actually feel like? Give a concrete example if you have one.',
  },

  {
    id: 'opening-point',
    type: 'quote',
    label: { num: '00', text: 'Opening' },
    content: {
      quote: 'You don\'t have to have been enthusiastic from day one. But you do have to engage with the actual material.',
      body: 'Not the marketing version of it.',
    },
    notes: 'This is the thesis. Slow down. Which brings me to the chair...',
  },

  // ── POINT 1: KNOW YOUR MATERIAL ───────────────────────────────────────────
  {
    id: 'p1-chair',
    type: 'section',
    bg: { src: '../references/ascii-art.png' },
    label: { num: '01', text: 'Know your material' },
    content: {
      title: 'THE CHAIR<br>DESIGNER<br>WHO\'D NEVER<br>TOUCHED<br><em>WOOD</em>',
    },
    notes: 'Big pause before this slide. Let the title land.',
  },

  {
    id: 'p1-bent-ply',
    type: 'body',
    label: { num: '01', text: 'Know your material' },
    content: {
      heading: 'Bent ply',
      body: 'A designer working in bent ply who\'s never actually bent the wood — doesn\'t know how far it flexes, what weight it holds, where it cracks.\n\nThe design looks right on screen. It just <em>can\'t exist in the world.</em>',
    },
    notes: 'This is the setup. The next slide is the payoff — designing AI features in Figma without touching the material.',
  },

  {
    id: 'p1-figma-box',
    type: 'body',
    label: { num: '01', text: 'Know your material' },
    content: {
      heading: 'Designing inside a magic box we\'d never opened',
      body: 'When we were designing AI features <em>in Figma</em>, AI stayed abstract. You spec a behaviour, engineering builds it, you never develop real intuition for what it can or can\'t do.',
    },
    notes: 'This should feel like a confession, not a criticism.',
  },

  {
    id: 'p1-what-changes',
    type: 'bullets',
    label: { num: '01', text: 'Know your material' },
    content: {
      heading: 'When designers actually use the tools',
      bullets: [
        { text: 'You stop promising things the model can\'t deliver', colour: 'magenta' },
        { text: 'You make better calls about how to present uncertainty', colour: 'cyan' },
        { text: 'You understand <em>why</em> something behaves the way it does', colour: 'amber' },
      ],
    },
    notes: 'Each bullet is a real lesson learned. Don\'t rush — these are the substance.',
  },

  {
    id: 'p1-trust',
    type: 'quote',
    label: { num: '01', text: 'Know your material' },
    content: {
      quote: 'This isn\'t just a craft point. It\'s a trust point.',
      body: 'AI features designed by people who understand the material are better. More honest. More trustworthy for customers.\n\n<em>The bent ply designer has to know how far the wood bends before they draw the curve.</em>',
    },
    notes: 'Land this. Pause after "trust point."',
  },

  // ── POINT 2: PROTOTYPE → PRODUCT ──────────────────────────────────────────
  {
    id: 'p2-section',
    type: 'section',
    label: { num: '02', text: 'The prototype is getting closer to the product' },
    content: {
      title: 'THE PROTOTYPE<br>IS GETTING<br>CLOSER TO<br><em>THE PRODUCT</em>',
    },
    notes: 'Energy shift here — this section is more optimistic.',
  },

  {
    id: 'p2-evolution',
    type: 'bullets',
    label: { num: '02', text: 'The prototype is getting closer to the product' },
    content: {
      heading: 'From Figma → code',
      bullets: [
        { text: '<strong>Figma</strong> — beautiful, systematic — but rigid. Now genuinely hitting its limits.', colour: 'magenta' },
        { text: '<strong>Figma Make / Replit</strong> — more flexibility, but you lose real component behaviour.', colour: 'cyan' },
        { text: '<strong>Rovo Dev in code</strong> — live components, real AI, real design system. The gap closes.', colour: 'amber' },
      ],
    },
    notes: 'Walk through each step. Be concrete about the Figma ceiling — memory, speed, complexity.',
  },

  {
    id: 'p2-ads',
    type: 'body',
    label: { num: '02', text: 'The prototype is getting closer to the product' },
    content: {
      heading: 'Rovo Dev + ADS',
      body: 'Bring in actual live coded components from the real design system. Invoke real AI. The prototype starts <strong>converging with the thing that ships.</strong>\n\nThe translation cost drops. Discoveries in the prototype are much more likely to be real discoveries about the actual product.',
    },
    notes: 'This is a good place to show the workflow if you have a quick demo.',
  },

  {
    id: 'p2-caveat',
    type: 'body',
    label: { num: '02', text: 'The prototype is getting closer to the product' },
    content: {
      heading: 'Important caveat',
      body: 'The whiteboard, Figma, pen and paper — <em>these aren\'t dead.</em>\n\nNot everything should be a code prototype. The point is having access to a new tool for the right moments — particularly when you need live AI behaviour, real component fidelity, or you\'re hitting Figma\'s technical ceiling.',
    },
    notes: 'Don\'t let this sound like a pitch for code. It\'s about having the right tool.',
  },

  // ── POINT 3: SHOW DON'T TELL ──────────────────────────────────────────────
  {
    id: 'p3-section',
    type: 'section',
    label: { num: '03', text: 'Show, don\'t tell' },
    content: {
      title: 'SHOW,<br>DON\'T<br><em>TELL</em>',
    },
    notes: 'Shorter section — 4 minutes. Keep energy up.',
  },

  {
    id: 'p3-confluence',
    type: 'quote',
    label: { num: '03', text: 'Show, don\'t tell' },
    content: {
      quote: 'Death by Confluence doc is real.',
      body: 'A prototype that actually runs — that you can click through, that invokes real AI — changes the conversation immediately.\n\nStakeholders stop debating what something <em>might</em> feel like and start reacting to what it actually does.',
    },
    notes: 'The audience will feel this immediately. Don\'t explain it too much.',
  },

  {
    id: 'p3-ma',
    type: 'body',
    label: { num: '03', text: 'Show, don\'t tell' },
    content: {
      heading: 'The <em>ma</em> — the pause',
      body: 'The ability to spin something up fast can collapse the space for intentional thinking.\n\n<em>Ma</em> (間) — the pause, the gap — is where design judgment lives. Moving from idea to prototype in hours is powerful, but it can create a bias toward solutions before the problem is fully understood.\n\nWe\'re still figuring out how to protect that reflective space.',
    },
    notes: 'Say "ma" clearly. It\'s a Japanese concept — the meaningful pause. You might want to write it on the screen somehow.',
  },

  // ── POINT 4: BLURRING THE EDGES ───────────────────────────────────────────
  {
    id: 'p4-section',
    type: 'section',
    label: { num: '04', text: 'Blurring the edges' },
    content: {
      title: 'BLURRING<br>THE<br><em>EDGES</em>',
    },
    notes: 'Slower, more considered section. This is the most honest and uncertain part.',
  },

  {
    id: 'p4-new-dynamic',
    type: 'body',
    label: { num: '04', text: 'Blurring the edges' },
    content: {
      heading: 'What happens to craft roles when everyone can do a bit of everything',
      body: 'Designers can finesse things right in production. PMs can mock up a concept. Engineers can contribute to the design conversation much earlier.\n\nMore people at more stages — that\'s <strong>mostly a good thing.</strong>',
    },
    notes: 'Emphasise "mostly." Don\'t oversell it.',
  },

  {
    id: 'p4-tensions',
    type: 'bullets',
    label: { num: '04', text: 'Blurring the edges' },
    content: {
      heading: 'But it creates real tension',
      bullets: [
        { text: 'Who owns what, and when?', colour: 'magenta' },
        { text: 'Where does "PM prototyping" end and "design" begin?', colour: 'cyan' },
        { text: 'How do you avoid double-up work and territorial friction?', colour: 'amber' },
      ],
    },
    notes: 'These are live tensions at Atlassian right now. Be honest about that.',
  },

  {
    id: 'p4-answer',
    type: 'body',
    label: { num: '04', text: 'Blurring the edges' },
    content: {
      heading: 'The answer isn\'t to rebuild the walls',
      body: 'Make the new boundaries <strong>explicit, per project.</strong>\n\nA real conversation at the start of each piece of work: who\'s doing what, at which stage, and what does handoff look like?\n\nThis is an area we\'re actively working through. It would be dishonest to present it as solved.',
    },
    notes: 'The honesty is the point here. Don\'t try to wrap it up neatly.',
  },

  // ── POINT 5: ENTERPRISE TRUST ─────────────────────────────────────────────
  {
    id: 'p5-section',
    type: 'section',
    label: { num: '05', text: 'Trust is built in the details' },
    content: {
      title: 'TRUST IS<br>BUILT IN<br><em>THE DETAILS</em>',
    },
    notes: 'Reference Rachel Sheppard\'s trust report. Set up the enterprise context — this audience may not all be enterprise, but they\'ll know customers who are.',
  },

  {
    id: 'p5-micro',
    type: 'quote',
    label: { num: '05', text: 'Trust is built in the details' },
    content: {
      quote: 'Trust accumulates across a thousand micro-interactions.',
      body: 'Every small moment of polish either adds to or subtracts from it. For enterprise customers, that erosion is existential.\n\nDeath by a thousand cuts goes both ways.',
    },
    notes: 'AI design camp insight — name it. Trust is invisible when it\'s working.',
  },

  {
    id: 'p5-enterprise-needs',
    type: 'bullets',
    label: { num: '05', text: 'Trust is built in the details' },
    content: {
      heading: 'What enterprise customers actually need',
      bullets: [
        { text: 'Admin controls — how do I turn this off? Gate the rollout?', color: 'magenta' },
        { text: 'Data privacy — does our information leave our environment?', color: 'cyan' },
        { text: 'Training data clarity — what was the model trained on?', color: 'amber' },
        { text: 'PII protection — how do I know our data is safe?', color: 'magenta' },
        { text: 'Output review — nothing goes to production without a human check', color: 'cyan' },
        { text: 'Cost transparency — what is this actually costing us?', color: 'amber' },
      ],
    },
    notes: 'These aren\'t nice-to-haves. They are the product. Say that.',
  },

  {
    id: 'p5-tension',
    type: 'body',
    label: { num: '05', text: 'Trust is built in the details' },
    content: {
      heading: 'An unsolved tension',
      body: 'The industry moves so fast that expectations and available technology shift within <em>days</em>.\n\nEnterprise customers need thoughtfulness, transparency, and control. Those things take time.\n\nHow do you balance that speed with the responsibility to get it right?\n\nI don\'t have a perfect answer. But naming it is the first step — and it\'s something we as designers have a particular responsibility to hold.',
    },
    notes: 'This is honest. Don\'t try to resolve it — the honesty is the point. This is what makes the talk feel real rather than a highlights reel.',
  },

  // ── POINT 6: AI DOES THE DISHES ───────────────────────────────────────────
  {
    id: 'p6-section',
    type: 'section',
    label: { num: '06', text: 'AI does the dishes' },
    content: {
      title: 'AI DOES<br>THE<br><em>DISHES</em>',
    },
    notes: 'Shift in tone here — more expansive, more hopeful. This is the "so what do we do with all this" section.',
  },

  {
    id: 'p6-art',
    type: 'quote',
    label: { num: '06', text: 'AI does the dishes' },
    content: {
      quote: 'AI does the dishes. We make the art.',
      body: 'The coordination overhead, the stakeholder reporting, the administrative bureaucracy — the stuff that takes time away from creative work. That\'s what the machine is for.\n\nThe creative synthesis, the judgment, the taste — that still happens in people\'s heads.',
    },
    notes: 'Let this land. It\'s the most quotable line in the talk.',
  },

  {
    id: 'p6-milly-os',
    type: 'body',
    label: { num: '06', text: 'AI does the dishes' },
    content: {
      heading: 'The personal operating system',
      body: 'Building a second brain — a personal AI layer that handles the clunky old UIs, the coordination overhead, the things that eat your day.\n\nThe vision: spend your day in conversation, drawing, strategising, doing creative work. Set the tools overnight on execution. Come back and iterate.\n\n<em>Humans in the loop. Not handing it over.</em>',
    },
    notes: 'Reference your own Millie OS work here. This is personal and specific — it\'ll land well.',
  },

  {
    id: 'p6-uber',
    type: 'body',
    label: { num: '06', text: 'AI does the dishes' },
    content: {
      heading: 'The Uber CEO moment',
      body: 'The Uber CEO recently said they\'re not finding a lot of value in AI coding.\n\nThis probably says more about <em>how their team is using the tool</em> than about the tool itself.\n\nYou can give designers — or engineers — AI tools and still not get an improvement. The tool doesn\'t do the thinking for you.',
    },
    notes: 'Don\'t be dismissive of the concern — acknowledge it\'s a real pattern. The point is it\'s a people/process problem, not a technology problem.',
  },

  // ── POINT 6: HUMANS IN THE LOOP ───────────────────────────────────────────
  {
    id: 'p7-section',
    type: 'section',
    label: { num: '07', text: 'Humans in the loop' },
    content: {
      title: 'HUMANS<br>IN THE<br><em>LOOP</em>',
    },
    notes: 'This is the anchor. Everything else has been building to this.',
  },

  {
    id: 'p7-slop',
    type: 'quote',
    label: { num: '07', text: 'Humans in the loop' },
    content: {
      quote: 'If you don\'t review what comes out of the machine, it is slop.',
      body: 'Full stop.',
    },
    notes: 'Say this plainly. No softening. The bluntness is the point.',
  },

  {
    id: 'p7-loops',
    type: 'body',
    label: { num: '07', text: 'Humans in the loop' },
    content: {
      heading: 'Continuous loops, not one-way handoffs',
      body: 'Humans reviewing, iterating, redirecting. Not giving the word to AI — <strong>a conversation.</strong>\n\nThe quality, the nuance, the polish, the standards — that\'s what we still need humans for.\n\nAI amplifies human judgment. It doesn\'t replace it.',
    },
    notes: 'This reframes what AI is. It\'s an amplifier, not a replacement.',
  },

  {
    id: 'p7-relevance',
    type: 'quote',
    label: { num: '07', text: 'Humans in the loop' },
    content: {
      quote: 'We are not going to design ourselves out of relevance.',
      body: 'We are going to use these tools to be more present in the work that actually matters — the creative decisions, the craft judgment, the thing that only a person who has actually used the material can do.',
    },
    notes: 'This is the rallying cry. Make eye contact with the room.',
  },

  // ── CLOSE ─────────────────────────────────────────────────────────────────
  {
    id: 'close-section',
    type: 'section',
    label: { num: '08', text: 'Close' },
    content: {
      title: 'DESIGNERS<br>IN THE<br><em>MATERIAL</em>',
    },
    notes: 'Slower. This is the landing.',
  },

  {
    id: 'close-model',
    type: 'body',
    label: { num: '08', text: 'Close' },
    content: {
      heading: 'The traditional model',
      body: 'Designers hand off, engineering builds, something ships that\'s close to but not exactly the design.\n\nThe gap is accepted as a cost of doing business.',
    },
    notes: 'Say this matter-of-factly. Everyone in the room knows this is true.',
  },

  {
    id: 'close-direction',
    type: 'body',
    label: { num: '08', text: 'Close' },
    content: {
      heading: 'The direction we\'re moving',
      body: 'Designers present <strong>right at the end</strong>, in the actual material, catching what only a designer would catch — and increasingly able to <em>fix</em> it themselves.\n\nNot just identifying issues but resolving them. Polish, fit, finish, judgment — applied to the real thing.',
    },
    notes: 'This is the hopeful note. Linger on "the real thing."',
  },

  {
    id: 'close-craft',
    type: 'quote',
    label: { num: '08', text: 'Close' },
    content: {
      quote: 'That\'s where the craft relocates.',
      body: 'Not away from quality, but closer to it. From the idealised upstream version of the thing, to the actual thing, right before it meets a customer.',
    },
    notes: 'Pause after this. Let it sit.',
  },

  {
    id: 'close-final',
    type: 'hero',
    content: {
      title: ['PUT YOUR', 'HANDS IN', '<em>THE CLAY</em>'],
      sub: 'Understand what the material can actually do — not the marketing version.\nClose the gap between what you design and what ships.\nThat\'s the job now.',
      deco: `
┌──────────────────────────────────┐
│  Thank you                       │
│  ──────────────────────────      │
│  @millyodesign                   │
│  Atlassian                       │
└──────────────────────────────────┘`.trim(),
    },
    notes: 'Stop talking. Let the slide breathe. Take questions.',
  },

];
