---
name: jacob-log
description: >-
  Use this skill when the user wants to research, draft, format, and publish/organize technical posts or study notes directly into the Jacob-log (morethan-log) Notion database.
---

# Jacob-log Post Publishing & Management Skill

This skill defines the standard procedure for drafting, structuring, formatting, and publishing technical blog posts directly to **Jacob-log** (powered by `morethan-log` Notion database).

---

## 🎯 Core Principles

1. **Schema & Properties Compliance**:
   Every post in Jacob-log must adhere to the `morethan-log` database properties:
   - `title` (Title): Post title
   - `date` (Date): `YYYY-MM-DD` (e.g. today's date in KST)
   - `type` (Select): `Post` (or `Paper`, `Page`)
   - `status` (Select): `Public` (or `Private`, `PublicOnDetail`)
   - `category` (Multi-select / Select): e.g. `AI / ML`, `Engineering`, `Data Science`
   - `tags` (Multi-select): Keyword tags (e.g., `DeepSeek`, `Agent`, `Architecture`)
   - `summary` (Rich Text): 1-2 sentence core overview

2. **Visual & Structural Clarity**:
   - Incorporate **Mermaid diagrams** (Architecture flows, sequence diagrams) where relevant.
   - Include code blocks with language tags (`bash`, `python`, `typescript`, `json`).
   - Clean headings (`#`, `##`, `###`), callout quotes, and comparison tables.

---

## 🛠️ Execution Workflow

### 1. Verification of Notion Database Access
- Target Database ID: `16cbde17d0178094a457fa2288254f55` (from `site.config.js`)
- Ensure integration `agy_notion` has connection access to the Notion Database.

### 2. Creation via Notion API / MCP
- Create page under database with property values.
- Populate body blocks (Headings, Paragraphs, Code Blocks, Callouts).
