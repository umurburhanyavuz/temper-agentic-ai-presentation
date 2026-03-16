# Speaker Notes & Talking Points

---

## Section 1: Opening — The Problem [0:00 - 5:00]

### The Setup
- Don't start with "AI is amazing." Start with pain.
- "Raise your hand if you use more than 5 tools every day." (Everyone)
- "Now raise your hand if you enjoy copying data from one tool to another." (Nobody)
- "You are the integration layer. Every time you copy from Jira to Notion, paste into Slack, reformat for an email — you're doing work that a machine should do."

### The Thesis
- "What I want to show you today is not 'AI will replace you.' It's the opposite. AI should handle the boring glue work so you can do the thinking, the deciding, the creative parts."
- "But here's the key: we don't just throw AI at everything and hope. We need three things to make it work reliably."

### Preview the Pillars
- "First: connections — AI needs to read your tools, not just your copy-paste."
- "Second: human in the loop — you stay in control of what matters."
- "Third: context engineering — giving AI enough knowledge to actually be useful."

---

## Section 2: Pillar 1 — Connections [5:00 - 17:00]

### Opening the Section
- "Let me ask a simple question: if AI can't see your Jira tickets, can it write your sprint summary? No. It can only work with what you copy-paste into it."
- "That's the difference between a chatbot and an agent. A chatbot waits for you to feed it. An agent goes and gets what it needs."

### MCP Explanation
- Keep it simple. The audience doesn't need to know the technical details.
- "There's a new standard called MCP — Model Context Protocol. Think of it like USB-C for AI. One cable, many devices. One protocol, many tools."
- "Notion has one. Atlassian — that's Jira and Confluence — has one. Google Workspace has native integration. These aren't future promises. They exist today."

### Tools Landscape
- Don't deep-dive into any single tool. Show the landscape:
- "Gemini is what we all have access to. It connects to your Google Workspace natively."
- "Claude Code and Gemini CLI are terminal tools that developers can use — they support MCP, so they can connect to Notion, Jira, and more simultaneously."
- "Cursor is an AI code editor — same concept, different interface."
- "Google Workspace Studio lets you build no-code agents that connect to Jira, Salesforce, and external APIs."

### Key Message
"The tools exist. The connections exist. The question isn't 'can we connect AI to our tools?' — it's 'what should we automate, and how do we do it safely?'"

**Transition:** "And that brings us to pillar two: staying in control."

---

## Section 3: Pillar 2 — Human in the Loop [17:00 - 27:00]

### Opening the Section
- Start with a provocative question: "Should we let AI send emails to our clients automatically? Should it close Jira tickets? Should it post in Slack on your behalf?"
- Pause. Let the room react.
- "Some of you said yes, some said no. The right answer is: it depends. And that's exactly why human in the loop matters."

### The Spectrum
- "On one end: you do everything manually. That's where most of us are today."
- "On the other end: AI does everything automatically. That's scary — and it should be."
- "The sweet spot is in the middle: semi-autonomous. AI does the heavy lifting, you approve the important parts."

### Walking Through Examples
For each example, make it relatable:
- Status report: "How many of you write status reports? Imagine AI drafts it from Jira, you spend 2 minutes reviewing, done."
- Candidate email: "Recruiters — imagine AI writes the first draft based on the CV, you add the personal touch, send."
- Incident triage: "Engineers — imagine AI reads the logs and suggests severity, on-call confirms with one click."

### The Trust Gradient
This is the most important concept in this section:
- "You don't give a new hire full access on day one. Same with AI."
- "Month 1: AI drafts, you review everything."
- "Month 3: AI drafts, you spot-check."
- "Month 6: AI handles it, you review a weekly digest."
- "Trust is earned. Automation is gradual."

### Where to Place Human Gates
Give a simple rule:
- "If it goes outside the company — human reviews."
- "If it involves money or compliance — human approves."
- "If it's internal and low-stakes — let it fly."

**Transition:** "So we know AI needs connections, and we know we need human checkpoints. The third piece is what makes AI actually good at its job."

---

## Section 4: Pillar 3 — Context Engineering [27:00 - 37:00]

### Opening the Section
- "Have you ever asked AI a question and gotten a terrible answer? Then asked the same question differently and gotten a great one?"
- "The difference isn't the AI. It's the context."
- "Prompt engineering was the 2023 buzzword. Context engineering is the 2025-2026 reality."

### The Evolution
- "Prompt engineering: you write a clever question. You get a clever answer. Then you close the tab and it's gone."
- "Context engineering: you build a system. Instructions, knowledge, memory, tool access. It persists. It improves. It's shareable."
- "Prompt engineering is a conversation. Context engineering is an investment."

### The 4 Layers
Walk through each layer with a concrete example:
1. **Instructions:** "You are a status report writer for Temper. Use this format." — This is what Gemini Gems do.
2. **Knowledge:** "Our teams are Platform, Growth, and Worker Experience. Our quarterly priority is payment optimization." — This is what makes output relevant.
3. **Memory:** "Last sprint we decided to postpone the settings redesign." — This is what makes output consistent over time.
4. **Tools:** "Connected to Jira, Notion, and Sheets." — This is what makes output data-driven.

### The Live Demo
Show the context difference — basic prompt vs. context-rich Gem. Same input, dramatically different output. This is the most impactful demo in the presentation.

### Sustainability
- "Here's the most important point about context: if it's in your head, it dies with you."
- "Write it down. In a Gem. In a CLAUDE.md file. In a team doc. Structured, versioned, shareable."
- "When a new person joins the team and their AI assistant immediately knows your conventions, your format, your priorities — that's sustainable context."
- "When someone leaves and their Gems and prompts stay — that's knowledge preservation."

### Growing Context
- "Start small. Just write the instructions. Three lines."
- "Next week, add your team's conventions."
- "Next month, add historical decisions."
- "The context compounds. Every addition makes every future interaction better."

**Transition:** "Let me put all three pillars together."

---

## Section 5: Putting It Together + Closing [37:00 - 45:00]

### The Full Picture
- "Connections give AI access to your data."
- "Human in the loop keeps you in control."
- "Context engineering makes the output actually good."
- "All three together: reliable automation you can trust."

### Practical First Steps
Make it actionable:
1. "This week: try a Gemini Gem for one repetitive task. Just write the instructions, test it, iterate."
2. "This month: write down your team's conventions. Format, terminology, priorities. This is context."
3. "This quarter: design one workflow with a human checkpoint. Map out: what's automatic, where do you review?"
4. "Share everything in #ai-workflows. Let's learn from each other."

### Closing Words
- "The future of work isn't 'AI replaces humans.' It's 'AI handles the parts you don't want to do, and you handle the parts that matter.'"
- "The tools are here. The connections exist. What's missing is you deciding what to automate."
- "Start small. Build trust. Grow context. Stay in control."
- "Thank you."

---

## Emergency Talking Points

| Situation | What to Say |
|-----------|-------------|
| Gemini is down | "Live tech — it happens. Here's what it produced earlier." (backup screenshots) |
| Output is bad | "This is actually a perfect example of why context matters. Watch what happens when I use the Gem with better instructions." (turns the failure into a teaching moment) |
| Audience is very non-technical | Lean harder on Gemini web demos, skip CLI/MCP details, focus on Gems and the conceptual frameworks |
| Audience is very technical | Go deeper on MCP architecture, mention n8n, show CLAUDE.md examples, talk about API-level integration |
| "We don't have budget for these tools" | "Gemini is already included in our Workspace subscription. Gems are free. Context engineering is free — it's just writing things down. You can start today with zero budget." |
| "Is this safe? What about data privacy?" | "Great question. Gemini for Workspace doesn't train on your business data. Always check with your lead before pasting sensitive data. Human in the loop is exactly about this — you always review before anything goes external." |
| "Will AI take our jobs?" | "AI is terrible at judgment, relationships, creativity, and strategy. It's great at summarizing, formatting, data crunching, and drafting. Those aren't your job — they're the things that get in the way of your job." |
