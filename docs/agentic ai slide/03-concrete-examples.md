# Concrete Examples — Full Detail

Examples organized by the three pillars, showing real Temper-relevant workflows.

---

## PILLAR 1: DATA CONNECTIONS

### Example 1: AI That Reads Your Jira and Notion

**The Pain:**
Every week you open Jira, scan through tickets, switch to Notion, update the project page, then write a summary for Slack. You are the human API between these tools.

**The Connected Version:**
AI agent (via Claude Code or Gemini CLI) connects to both Jira and Notion via MCP:
1. Reads all tickets moved to "Done" this sprint from Jira
2. Reads the project roadmap page from Notion
3. Generates a sprint summary that references both sources
4. Drafts a Slack message (you review before sending)

**What Makes This Work:**
- Jira MCP server (Atlassian's official remote MCP) gives AI read access to your projects
- Notion MCP server gives AI read/write access to your pages
- Both connected simultaneously — AI cross-references in real time

**Impact:**
- 30-45 min manual work → 5 min review
- No information lost between tools
- Consistent format every time

---

### Example 2: Gemini + Google Workspace (Native)

**The Pain:**
You get 50 emails, 10 are important, 3 need action. You manually scan, prioritize, and act.

**The Connected Version:**
Gemini already has native access to your Gmail, Google Docs, Sheets, and Drive:
1. "Summarize my unread emails from this week and flag anything that needs a response"
2. "Find the latest version of the Q1 report in my Drive and summarize the key metrics"
3. "Look at this Sheet and tell me which regions are underperforming"

**What Makes This Work:**
- No setup needed — Gemini's Workspace integration is built-in
- Works in the browser, accessible to everyone

**Impact:**
- Email triage: 20 min → 2 min
- Document search: 10 min → instant
- Data analysis: hours → minutes

---

### Example 3: Multi-Tool Data Collection for Decision Making

**The Pain:**
Before a product decision, you need data from Mixpanel (user behavior), Jira (technical complexity), Notion (past decisions), and Google Sheets (business metrics). Collecting this takes half a day.

**The Connected Version:**
AI agent connected to all sources pulls relevant data:
1. Mixpanel: "What's the conversion rate for the onboarding flow in the last 30 days?"
2. Jira: "How many open bugs are related to onboarding?"
3. Notion: "What decisions have we made about onboarding in the last 6 months?"
4. Sheets: "What's the revenue impact of onboarding completion rates?"

Produces a decision brief in minutes.

**What Makes This Work:**
- Each tool connected via its own MCP server or API
- AI acts as the aggregation layer — no manual switching between tabs

**Impact:**
- Half a day of research → 15 min of AI collection + 15 min of human review
- Better decisions because no data source is forgotten

---

## PILLAR 2: HUMAN IN THE LOOP

### Example 4: Status Report with Human Gate

**Flow:**
```
[Jira: completed tickets] ──► [AI: drafts report] ──► [YOU: review & edit] ──► [Send to leadership]
         Automatic                  Automatic               HUMAN GATE              Action
```

**Why the human gate matters:**
- AI might misinterpret a ticket's impact
- You know context AI doesn't — politics, priorities, sensitivities
- 2 minutes of review prevents a misleading report

**The rule:** AI does 90% of the work. You provide the 10% that requires judgment.

---

### Example 5: Candidate Outreach with Approval

**Flow:**
```
[CV uploaded] ──► [AI: analyzes fit] ──► [AI: drafts email] ──► [RECRUITER: personalizes & sends]
   Automatic          Automatic              Automatic                HUMAN GATE
```

**Why the human gate matters:**
- Every candidate deserves a personal touch
- AI might miss cultural nuances or specific role requirements
- The recruiter's judgment on tone and timing is irreplaceable

**The pattern:** AI prepares, human personalizes.

---

### Example 6: Incident Response Triage

**Flow:**
```
[Alert fires] ──► [AI: reads logs + Slack thread] ──► [AI: drafts severity assessment] ──► [ON-CALL: confirms severity] ──► [Auto-routes to team]
   Automatic              Automatic                           Automatic                         HUMAN GATE              Automatic
```

**Why the human gate matters:**
- Misclassifying severity = waking up the wrong team or missing a critical issue
- On-call engineer has context AI doesn't (recent deploys, known issues)
- The gate is fast (30 seconds) but prevents expensive mistakes

---

### Example 7: The Trust Gradient

Start with more human gates, remove them as trust builds:

**Month 1:** AI drafts → human reviews everything → human sends
**Month 3:** AI drafts → human spot-checks 30% → auto-sends the rest
**Month 6:** AI drafts and sends automatically → human reviews weekly summary

"You don't hand over the keys on day one. You build trust incrementally."

---

## PILLAR 3: CONTEXT ENGINEERING

### Example 8: Basic Gem vs. Context-Rich Gem

**Basic (just instructions):**
```
"Summarize this meeting."
```
Output: generic, misses team-specific terminology, wrong format.

**Context-rich (all 4 layers):**
```
Instructions: "You are a meeting notes processor for Temper's product team."
Knowledge: "Our sprint cycles are 2 weeks. We use Jira for tickets prefixed TEMP-.
            Our teams are: Platform, Growth, Worker Experience, Client Experience."
Memory: "Last sprint's key decision was to prioritize the new onboarding flow."
Tools: Connected to Jira (reads ticket context), Notion (reads project pages)
```
Output: uses correct terminology, references real tickets, fits the team's format, builds on previous context.

**The difference is dramatic** — same AI, wildly different quality.

---

### Example 9: CLAUDE.md — Persistent Project Context

For technical teams using Claude Code:

```markdown
# Project Context

## Architecture
- iOS app: Swift, TCA/ComposableArchitecture
- Shared module: Kotlin Multiplatform
- Backend: [your stack]

## Conventions
- Branch naming: feature/TEMP-1234-description
- Commit style: conventional commits
- PR template: summary + test plan

## Common Commands
- Build: ./gradlew allshared:spmDevBuild
- Test: make test app=temper-worker

## Team Glossary
- "Flex worker" = temporary worker on the platform
- "Shift" = a single work assignment
- "Fill rate" = percentage of posted shifts that get filled
```

This file lives in the project. Every time AI works on this project, it reads this context first. New team members' AI assistants immediately understand the project.

---

### Example 10: Growing Context Over Time

**Week 1:** Write basic instructions for a Gem
```
"Summarize Jira tickets for my weekly report."
```

**Week 2:** Add format preferences
```
"Use bullet points. Group by team. Bold any blockers."
```

**Week 4:** Add team knowledge
```
"Our teams are Platform, Growth, and Worker Experience.
Platform tickets are infrastructure. Growth tickets are experiments.
Worker Experience tickets are app features."
```

**Week 8:** Add historical context
```
"Q1 priority was onboarding redesign.
Q2 priority is payment flow optimization.
Flag any tickets that don't align with quarterly priorities."
```

**The context compounds.** Each addition makes every future interaction better.

---

### Example 11: Shareable Context — Team-Wide Benefits

**The problem with individual prompts:**
- Person A has great prompts, Person B starts from scratch
- When Person A leaves, their "AI knowledge" leaves too
- No consistency across the team

**The solution — shared context artifacts:**
- Gemini Gems can be shared with teammates
- CLAUDE.md files live in the repo — anyone who clones gets the context
- Team knowledge bases (Notion/Docs) can be fed to AI as context
- Convention documents serve double duty: human reference + AI context

"Write it down once. Everyone benefits — including AI."
