# Slide-by-Slide Outline

Target: 20-22 slides. Visual-heavy, minimal text per slide.

---

## Slide 1 — Title
**Agentic AI at Work: Connect, Automate, Stay in Control**
Temper Summit 2026 | [Your Name]

---

## Slide 2 — The Daily Reality
Visual: icons of Slack, Jira, Notion, Gmail, Mixpanel, Miro, Google Sheets scattered around

> "How many of these do you touch every day?"

---

## Slide 3 — The Glue Work
Visual: arrows between tool icons, a person in the middle manually moving data

> "You are the integration layer. You copy, paste, reformat, summarize, and relay — between tools that don't talk to each other."

---

## Slide 4 — The Promise
> "What if AI could do this glue work — but you still approve every important step?"

Three pillars preview:
1. **Connections** — AI that reads your tools
2. **Human in the Loop** — You stay in control
3. **Context Engineering** — AI that remembers and improves

---

## Slide 5 — Chatbot vs Agent
**"AI without data access is just a chatbot"**

Visual: **Chatbot** on the left, **Agent** on the right

| Chatbot | Agent |
|---------|-------|
| You ask, it answers | It goes and does |
| Knows only what you paste in | Connected to your tools — reads live data |
| A smart librarian — knows the recipe | A head chef — checks the fridge, goes to the store, bakes the cake |
| A tourist asking for directions | A local guide who takes you there, books the table, handles the tip |

**This is the most important distinction in the entire talk.**
The difference isn't intelligence — it's access and autonomy. A chatbot can tell you how to do something. An agent actually does it.

---

## Slide 6 — Copy-Paste is Not a Workflow
Show the manual flow:
Meeting notes → manually extract action items → manually create Jira tickets → manually update Notion → manually message Slack

Each arrow = your time

---

## Slide 7 — Connecting AI to Your Tools
**"An agent is only as good as what it can reach"**

Start broad: the concept of connections
- Today you are the connector between your tools — you copy, paste, reformat
- What if AI could read and write to those tools directly?
- That's what "connections" mean — giving AI access to the systems you already use

Then introduce the standard:
- **MCP** = Model Context Protocol
- Think of it as **USB-C for AI** — one standard plug, many devices
- An open protocol that lets any AI tool talk to any data source
- You can use existing connections (Notion, Jira, Google) — or build your own

Visual: MCP in the center, tool logos connected to it

---

## Slide 8 — What's Connected Today
| Tool | MCP Server | Status |
|------|-----------|--------|
| Notion | Official Notion MCP | Available |
| Jira & Confluence | Atlassian Remote MCP | Available |
| Google Workspace | Native Gemini integration + MCP extensions | Available |
| Asana | MCP server | Available |
| Mixpanel | Via API / custom MCP | Possible |
| Miro | Via API / custom MCP | Possible |

---

## Slide 9 — The AI Tools Landscape
| Tool | What It Is | Best For |
|------|-----------|----------|
| **Gemini** (web) | Chat + Gems in browser | Everyone — quick tasks, reusable workflows |
| **Gemini CLI** | Terminal AI agent | Developers — agentic coding |
| **Claude Code** | Terminal AI agent with MCP | Developers — multi-tool automation |
| **Cursor** | AI-powered code editor | Developers — coding with full context |
| **Workspace Studio** | No-code AI agents | Teams — automated Workspace flows |

All of these can connect to your tools. Different entry points, same concept.

---

## Slide 10 — Demo: AI Connected to Your Tools
*Live demo or screenshots showing:*
- Gemini reading from Google Docs/Sheets
- Claude Code pulling data from Notion + Jira simultaneously
- The "before" (manual) vs "after" (connected)

---

## Slide 11 — Pillar 2: Human in the Loop
**"Should AI do everything automatically?"**

Visual: spectrum bar
```
Manual ◄─────────────────────────────► Fully Autonomous
                    ▲
              Sweet Spot:
           Semi-Autonomous
```

---

## Slide 12 — The Semi-Autonomous Sweet Spot
**AI does the heavy lifting. You approve the critical steps.**

Visual: flow diagram
```
[AI collects data] → [AI drafts output] → [HUMAN REVIEWS] → [Action taken]
```

The checkpoint icon = trust + control

---

## Slide 13 — Example: Status Report with Human Gate
```
Jira data ──► AI summarizes ──► Draft report ──► YOU REVIEW ──► Send to leadership
     ↑                                              ↑
  Automatic                                    Human gate
```

"AI saves you 40 minutes. You spend 2 minutes reviewing. Trust is maintained."

---

## Slide 14 — Example: Support Ticket Triage
```
Incoming ticket ──► AI categorizes ──► AI suggests response ──► HUMAN APPROVES ──► Response sent
                                                                      ↑
                                                              High-priority:
                                                              always human
```

---

## Slide 15 — When to Use Human Gates
| Scenario | Automation Level | Why |
|----------|-----------------|-----|
| Internal data summaries | Mostly autonomous | Low risk, internal only |
| Client-facing emails | Human reviews | Reputation risk |
| Financial decisions | Human approves | Compliance |
| Code deployment | Human approves | Production risk |
| Internal Slack updates | Fully autonomous | Low stakes |

Key: **Start supervised. Automate gradually as trust builds.**

---

## Slide 16 — Pillar 3: What Is Context?
**"Context is everything AI knows when it's working for you"**

Start with what context is — BEFORE introducing context engineering:
- Context = the information available to AI at the moment it generates a response
- You are already managing context manually — every time you paste text into a chat, you're giving it context
- The goal: automate this, make it persistent, and make it richer

Key things to know about context:
- It has a limit (a "context window") — you can't dump everything in
- Quality matters more than quantity — relevant context beats more context
- You can see how much context is being used in most tools
- Without enough context, AI hallucinates. With the right context, it's remarkably accurate.

---

## Slide 17 — Prompt Engineering → Context Engineering

**Where you are now:**
> "Write me a summary of the meetings I had last week."
You paste in notes, you get a generic summary back.

**Where we are going:**
> "Write me a summary of last week's meetings, extract the action points I need to do, put them on Asana or Notion, and — using your knowledge of the team and department setup — find the relevant people to tag on each task so I can easily identify who I need to work with to get the best results."

| Prompt Engineering | Context Engineering |
|-------------------|---------------------|
| One-off question | Persistent system |
| You paste everything in | AI already has access to your tools and knowledge |
| Dies when you close the tab | Persists across sessions |
| Individual | Shareable across team |

**Context engineering is prompt engineering that scales.**

---

## Slide 18 — The 4 Layers of Context
Visual: stacked layers diagram

```
┌─────────────────────────────────┐
│  TOOLS — what AI can access     │  Notion, Jira, Sheets, Asana, APIs
├─────────────────────────────────┤
│  MEMORY — what AI remembers     │  Past decisions, preferences, history
├─────────────────────────────────┤
│  KNOWLEDGE — what AI knows      │  Processes, conventions, team structure
├─────────────────────────────────┤
│  INSTRUCTIONS — how AI behaves  │  Role, tone, format, rules, guardrails
└─────────────────────────────────┘
```

**Tools** = live connections to your systems (reads docs, tickets, sheets in real time)
**Knowledge** = what AI knows about your team, processes, conventions (not live data — structured understanding)

"The richer these layers, the better your output."

---

## Slide 20 — Practical Context Examples
| Layer | Example |
|-------|---------|
| Instructions | Gem: "You are a status report writer for Temper. Use this format..." |
| Knowledge | Team conventions, glossary, department structure, priorities |
| Memory | AI remembers your previous decisions, your preferred format |
| Tools | Connected to Jira, Notion, Google Sheets, Asana — reads live data, accesses docs |

Show: a Gem with basic instructions vs. one with all 4 layers

---

## Slide 21 — Building Sustainable Context
**"If it's in your head, it dies with your access."**

- Write it down in structured formats (markdown, docs)
- Keep it versioned and shareable
- Start small — instructions first, then add layers
- Iterate — refine based on what works

Examples:
- `CLAUDE.md` — project instructions file that persists
- Gemini Gem instructions — reusable across sessions
- Team knowledge base — shared context for everyone

---

## Slide 22 — The Full Picture
Visual: three pillars holding up "Reliable AI Automation"

```
        ┌──────────────────────────────┐
        │   Reliable AI Automation     │
        └──────────────────────────────┘
               ▲        ▲        ▲
        ┌──────┐  ┌─────┐  ┌────────┐
        │Connec│  │Human│  │Context │
        │tions │  │  in │  │Engineer│
        │      │  │ the │  │  ing   │
        │      │  │Loop │  │        │
        └──────┘  └─────┘  └────────┘
```

"Connected data + human oversight + rich context = automation you can trust."

---

## Slide 23 — Start This Week
1. **Try a Gem** — build one reusable AI assistant for a weekly task
2. **Add context** — write down your team's conventions and feed them to AI
3. **Design a checkpoint** — pick one workflow and decide where a human should review
4. **Share** — post your workflow in #ai-workflows on Slack

---

## Slide 24 — Resources
- Notion MCP: developers.notion.com/docs/mcp
- Atlassian MCP: atlassian.com/blog/announcements/remote-mcp-server
- Context Engineering guide: anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Google Workspace Studio: (internal link / admin)
- Gemini Gems: gemini.google.com → Gems

---

## Slide 25 — Q&A
**Questions?**
