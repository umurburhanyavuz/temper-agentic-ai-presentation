# Live Demo Scripts

Demos for each pillar. Mix of Gemini web (accessible to all) and conceptual walkthroughs (for connected tool demos).

---

## Pre-Presentation Setup Checklist

- [ ] Pre-create Gemini Gems (Meeting Processor, Status Report Writer)
- [ ] Prepare sample data: meeting transcript, CSV, raw Jira-style updates
- [ ] Take screenshots of Claude Code connected to Notion + Jira via MCP (if you have access)
- [ ] Take screenshots of Google Workspace Studio agent setup
- [ ] Have all sample inputs in a text file for quick copy-paste
- [ ] Take backup screenshots of every demo output
- [ ] Test on conference wifi — have mobile hotspot ready

---

## Demo 1: Opening — The Manual Glue Work [Section 1]

**Purpose:** Make the pain tangible before showing the solution.

**What to show:**
Open these side by side (or tab-switch quickly):
1. Jira board → find completed tickets
2. Notion page → where you'd normally write the update
3. Slack → where you'd post the summary
4. Gmail → where you'd send the report

**What to say:**
"This is what most of us do every week. We are the integration layer. We read from here, write there, copy here, paste there. What if AI could be the glue?"

---

## Demo 2: Gemini Reads Your Google Workspace [Pillar 1]

**Where:** gemini.google.com (logged into Temper Google account)

**Purpose:** Show that Gemini already has access to Workspace data — no setup needed.

### Prompt 1 — Email Summary
```
Look at my recent emails from this week. Summarize the key threads and flag anything that seems to need a response from me.
```

### Prompt 2 — Document Search
```
Find the most recent document in my Drive related to [a real project name]. Summarize its key points.
```

### Prompt 3 — Spreadsheet Analysis
Upload the `demo-data.csv` file:
```
Analyze this shift data. What are the top 3 trends? Any concerning patterns? What should we do about them?
```

**What to highlight:**
"I didn't export anything. I didn't copy-paste. Gemini went and got the data itself. This is what 'connected' means."

---

## Demo 3: The Context Difference [Pillar 3]

**Where:** gemini.google.com — regular chat first, then a pre-built Gem

**Purpose:** Show that context dramatically changes output quality.

### Step 1 — No context
Open a fresh Gemini chat:
```
Summarize these updates for a status report:
- TEMP-1234 payment refactoring merged
- TEMP-1245 notification system 70% done
- profile page blocked on design
- fixed 3 backlog bugs
- need to start analytics dashboard next week
```

**Point out:** "It works, but it's generic. It doesn't know our format, our teams, or our priorities."

### Step 2 — With context (pre-built Gem)
Open your pre-built "Status Report Writer" Gem with rich instructions:

**Gem instructions (create before talk):**
```
You are a status report writer for Temper's engineering team.

Our teams: Platform, Growth, Worker Experience, Client Experience.
Sprint cycle: 2 weeks, ending on Fridays.
Current quarter priority: Payment flow optimization and onboarding redesign.

When given raw updates, produce a report with:
1. Completed This Week (past tense, grouped by team if possible)
2. In Progress (with % or status)
3. Blocked / At Risk (bold, include why and what's needed to unblock)
4. Next Week (priorities)

Rules:
- Flag anything that doesn't align with quarterly priorities
- Keep each item to one line
- Bold blockers and risks
- If a ticket ID is mentioned (TEMP-xxxx), include it
```

Paste the same input.

**What to highlight:**
"Same input, same AI, completely different output. The only difference? Context. This is context engineering."

---

## Demo 4: Human in the Loop — Walkthrough [Pillar 2]

**Where:** Slides / visual walkthrough (not a live tool demo)

**Purpose:** Make the concept visual and concrete.

**What to show:**
A flow diagram (pre-made slide or whiteboard drawing):

```
AUTOMATED              AUTOMATED              HUMAN GATE            AUTOMATED
    │                      │                      │                     │
    ▼                      ▼                      ▼                     ▼
[AI reads Jira]  →  [AI drafts report]  →  [You review in   →  [Report sent
                                            Slack/email]         to leadership]
```

**Walk through it:**
1. "Step 1: AI connects to Jira, reads all tickets that moved this sprint. Automatic."
2. "Step 2: AI drafts a summary in your team's format. Automatic."
3. "Step 3: You get a draft in Slack or email. You read it — takes 2 minutes. You fix a nuance, approve. This is the human gate."
4. "Step 4: Report goes out. Automatic."

**Then show the trust gradient:**
"Month 1: you review everything. Month 3: you spot-check. Month 6: it runs on its own and you review a weekly digest. Trust is earned, not given."

---

## Demo 5: Building a Gem Live [Interactive]

**Where:** gemini.google.com → Gems → Create

**Purpose:** Show the audience how easy it is, then have them do it.

### Live Build
1. "Let me build a Gem right now. I'll call it 'Meeting Action Items.'"
2. Type instructions on screen:
```
You are a meeting notes processor for Temper.

Given raw meeting notes, extract:
1. Key Decisions — what was decided
2. Action Items — table with Task, Owner, Deadline
3. Open Questions — unresolved topics

Rules:
- If no deadline mentioned, write "TBD"
- If no owner clear, write "Unassigned"
- Be concise, use tables
```
3. Save it
4. Test with sample input:
```
Product sync today. We decided to go with the card layout for worker profiles but only show ratings after 10 completed shifts. Carlos will build the API endpoint, needs spec from Anna by Wednesday. QA timeline is unclear, need to check with the QA team. Also discussed push notification opt-in rates dropping 15% since January, marketing will investigate.
```
5. Show the output

**What to highlight:**
"That took 2 minutes to build. I'll use this after every meeting for the rest of the year. That's context engineering at its simplest — write your instructions once, benefit forever."

---

## Demo 6 (Optional): MCP Concept Demo

**Where:** Screenshot or pre-recorded short clip

**Purpose:** Show what "connected" looks like for technical tools

If you have Claude Code set up with Notion MCP + Atlassian MCP:
- Screenshot showing Claude Code reading a Notion page
- Screenshot showing Claude Code reading Jira tickets
- Screenshot showing it cross-referencing both

If not, use the MCP architecture diagram:
```
                    ┌─────────────┐
                    │   AI Agent  │
                    │ (Claude /   │
                    │  Gemini)    │
                    └──────┬──────┘
                           │ MCP Protocol
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Notion  │ │   Jira   │ │  Google  │
        │   MCP    │ │   MCP    │ │Workspace │
        └──────────┘ └──────────┘ └──────────┘
```

**What to say:**
"MCP is the standard that makes this possible. Notion has one, Atlassian has one, Google Workspace has native integration. One AI, many data sources, one protocol."

---

## Backup Plan

| Situation | Fallback |
|-----------|----------|
| Gemini is slow/down | Use pre-taken screenshots, walk through them |
| Workspace data access doesn't work | Use the CSV upload demo instead |
| Audience can't access Gems | Show them regular Gemini chat with detailed prompts — same concept, just not saved |
| Time runs short | Skip Demo 6 (MCP concept), go straight to closing |
