# Lessons from the AI Frontier
## Talk content — canonical source of truth

> Edit this file first. Then ask Rovo Dev to sync slides.ts to match.
> Format per slide: heading, body text, speaker notes, image description.

_25 minutes. No self-intro needed — will be introduced. Talk delivered via custom mini-site._


---

## HERO

**Slide text:**
> Lessons from the AI frontier
> Milly Schmidt · Atlassian Design · Web Directions 2026

**Speaker notes:**
Hi, I'm Milly. I've been at Atlassian for four years, and I'm now the design manager on Rovo Studio, which is part of the Central AI organisation. We are building AI with AI. This is a talk about what we've actually learned in the last year or so — the good, the awkward, the surprising.

**Image:** Animated ASCII field in pink, blue, amber, purple — full bleed background.

---

## Overview

> Gargbage in, garbage out
> Quality is a team sport
> Don't put a bird on it
> Right tool for the job
> Get AI to do your dishes

---

## Gargbage in, garbage out __section header__
**Image:** pixel art of a garbage can, arrow pointing to computer, arrow pointing to another garbage can with a sparkle emoji 

---

### Three ingredients to avoid slop

> Organisational context is key
- The teamwork graph elevates your organisation's shared context  [modal]
- You can spend less time searching and more time making 
- AI can pull contextually relevant info for you in various surfaces

[modal content -> animation of the graph]

> Personal context is also critical 
- Atlassian is a read/write culture - so we have a lot of Confluence docs
- But the real star here is Loom, which allows you to record meetings [modal]
- Your goals, your priorities and your focus

[modal content -> Loom recorder in a Zoom meeting]

> Specificity and iteration 
- None of this matters if you prompt poorly
- Voice is critical for me - I can type fast but I can yap faster [modal]
- Read the output and critique it. Do the revs.

[modal content -> voice in CLI (animated)]

---

## Quality is a team sport __section header__
**Image:**  hands with pieces of the puzzle, pixel art style

--- 

### Don't panic; organise

> The industry is moving at lightspeed
- You have to learn to play slowly before you can play fast
- We have run 3 AI Builders Weeks, stopping the whole company to learn together
- A couple weeks ago we got the whole design org together to learn to prototype in code [modal]

[modal content -> builders week photos]

> Enterprise customers need to feel safe
- We damaged trust by moving too fast [modal]
- Some experiences should be deterministic
- B2B is different from B2C 

[modal content -> "Until you understand someone’s emotional context, you’re not designing for them, you’re designing at them." -Rachel Shepard]

> Eat your own dogfood, see how it tastes
- We are culturally hard-wired to use our own tools - this is good and bad [modal]
- Spending more time with customers is critically important - and helps you idenitify the gaps
- You don't want customers doing your QA 

[modal content -> screenshot of studio]

---

## Strategic alignment matters __section header__
**Image:** animation of a bunch of arrows pointing in different directions, that then point towards the same point pixel art style

---

###

> We noticed a lot of convergent thinking
- Key UIs started to look the same [modal]
- If you jump to a prototype too fast, you might be converging prematurely
- The models reinforce this by outputting "averaged" ideas

[modal content -> Many "for you" pages looking the same]

> Some experiences are harder to do agentically
- Chat has been fashionable, but it's not always appropriate
- Customers get annoyed when you try to make easy things easier [modal]
- Different customer archetypes want more or less control

[modal content -> "Hindering default actions like basic thing of column deletion. Too frustrating” - Customer quote]

> Don't make easy things easier; make hard things easier
- The problem space Atlassian plays in has many great opportunities for AI - natural language automations, format transfer, large data sets
- The most value we can provide to customers is making their hardest tasks easier
- Our researcher built a three-agent system to do literature review [modal]

[modal content -> 

You provide: Topic + Keywords + Sources (optional)
       ↓
Stage 1: Research_Synthesizer → "State of the Research"
       │   Reads all sources, extracts direct quotes, classifies evidence
       ↓
Stage 2: Integrity_Auditor → Integrity Audit Report
       │   Independently verifies every quote, checks Jira statuses,
       │   catches hallucinations, validates search completeness
       ↓
   QUALITY GATE: If Quote Accuracy < 80%, report flagged as unreliable
       ↓
Stage 3: Insight_Critic → Gap Analysis & Critique
       │   Finds contradictions, sample bias, assigns Research
       │   Maturity Scores per theme, identifies what's missing
       ↓
[Final: Verified Literature Review with confidence ratings]

]

---

## Right tool for the job __section header__
**Image:** pixel art of a flat lay of a set of tools

---

### Work is diverse; your tools should be too

> AI to prototype vs AI to polish
- Different tools are suitable at different stages of the process [modal]
- Generative tools for prototyping
- Automated tools for polishing

[modal content -> diagram of the design process and where different AI tools are used]

> Sometimes you need a pen 
- Engagement is a useful metric, but mandating AI for everything isn't helpful
- Different brains, different problems and different teams should choose the tool that suits the problem space best
- I made this deck in Rovodev, but had to use my notebook to design it [modal]

[modal content -> image of notebook plan for this talk]

> Knowing when to leverage AI is a skill
- Identifying opportunities to automate requires understanding the capabilities deeply [modal]
- It also requires knowing our own capabilities - what tools are connected, what actions are available
- Finally, it requires democratisation of AI and automation tooling - available to everyone.

[modal content -> Design's three commitments for AI transformation
 1 Build technical, AI‑powered prototypes that live inside the 🏝️ AI Prototyping Sandbox or your team's repo.
Build the muscle and learn the language of engineering to extend your skills.

2 Use AI to push what is possible for how we work, communicate in novel ways and make decisions faster. 
Push what is possible with your cross-craft teams from inception to live.

3 Ship changes to production using code. 
Look for opportunities to ship changes to apps, tools and systems, big or small and contribute shared components/patterns.
]

---

## Get AI to do your dishes __section header__
**Image:** pixel art of a lobster claw

---

### A powerful automation layer has been transformational

> The power of a good design system
- ADS, our design system, has been incredible leverage
- We created an ADS MCP so agents could leverage our design system through various surfaces
- Our team now includes Design Technologists, a new role for highly skilled technical designers [modal]

[modal content -> design tech prios]

> We transformed content design
- Unsurprisingly, Large Language Models are great at language-oriented design systems
- Our well-documented content design standards have been transformed into an agent and an agentic service desk
- Our documentation team leverage agents to audit, generate and adjust docs [modal]

[modal content -> Slack for content assistant]

> A personal operating system
- I created my own "second brain" - running entirely through CLI on md files [modal]
- Managing a team of ten across at least 30 projects at a time + my side quests, it's been invaluable
- This OpenClaw philosophy is driving our explorations into Rovo as a second brain

[modal content -> screenshot of my personal os]

---

## In summary

> Gargbage in, garbage out
> Quality is a team sport
> Don't put a bird on it
> Right tool for the job
> Get AI to do your dishes

---

> References (not a slide)

https://hello.atlassian.net/wiki/spaces/~712020da27561b9bb14249879a9abe6a41ad1c/pages/6698141159/Literature+Review+Agent+Setup+Guide+README
https://hello.atlassian.net/wiki/spaces/XDO/blog/2026/04/30/6947637720/The+Path+to+AI-native+Our+Design+Commitments
https://hello.atlassian.net/wiki/spaces/~712020ba168fbad22848eab3a2730df156e4f8/pages/6394347884/Default-On+Trust-Off
https://hello.atlassian.net/wiki/spaces/DST/blog/2026/03/10/6396240641/Teach+your+agents+about+the+Atlassian+Design+System+with+the+new+ADS+Remote+MCP+server
https://hello.atlassian.net/wiki/spaces/DST/blog/2026/02/17/6385528678/Design+Technology+at+Atlassian

## Thank you

**Slide text:**
> Thank you
> Milly Schmidt · millyschmidt.me · atlassian.design

**Image:** Animated ASCII field, full bleed.

