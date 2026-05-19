# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Overview

This is an **Obsidian + Claude Code knowledge work template** — an AI-native knowledge management system that combines Obsidian's bidirectional linking knowledge network with Claude Code's automation capabilities. This is a "knowledge factory operating system," not just a note-taking template.

---

## Core Architecture: 5-Layer Knowledge Pipeline

```
01-INPUT/          ← Raw material inbox (READ-ONLY)
  ├── articles/        Web clippings, papers
  ├── transcripts/     Video/podcast transcripts
  ├── ideas/           Topics and inspiration
  └── 09-archive/      Processed files (automatically moved)

02-PROCESSING/      ← AI processing zone (intermediate outputs)
  ├── research/        Research summaries
  ├── outlines/        Outlines
  └── drafts/          AI first drafts

03-OUTPUT/          ← Formal publication zone
  └── wiki/            Core knowledge network (THE HEART)
      ├── sources/       Source summaries (1:1 mapping)
      ├── entities/      Entities: people/companies/products/tools
      ├── concepts/      Concepts: frameworks/theories/methodologies
      ├── syntheses/     Cross-source comprehensive analysis
      ├── index.md       Global index registry
      └── log.md         Operation log (append-only)

04-FEEDBACK/        ← Feedback layer (drives system evolution)
  ├── metrics/         Data metrics
  ├── comments/        User feedback
  └── retrospectives/  Retrospectives

05-REFERENCE/       ← Long-term reference materials
  └── prompts/         Prompt library

.claude/             ← Claude Code configuration
  ├── CLAUDE.md       This file
  ├── memory/         Persistent memory (auto-maintained)
  └── skills/         Custom skills
      ├── ingest/       Knowledge compilation pipeline
      ├── query/        Knowledge retrieval & QA
      └── lint/         Knowledge base quality inspection
```

---

## Three Core Skills (Always Available)

### 1. `/ingest` — Knowledge Compilation Pipeline

Compiles raw materials from `01-INPUT/` into a structured knowledge network in `03-OUTPUT/wiki/`.

**Usage:**
```bash
/ingest                    # Scan all unarchived files
/ingest 01-INPUT/xxx.md   # Process specific file
```

**What it does automatically:**
1. Memory deduplication check (skip if already processed)
2. Parallel scanning via Explore subagent when files > 3
3. Source file reading and preprocessing
4. Knowledge extraction (Entities + Concepts) and translation
5. Create source summary page in `wiki/sources/`
6. Incrementally update entity/concept pages (never overwrite, only append)
7. Detect and report knowledge conflicts
8. Update `wiki/index.md` and `wiki/log.md`
9. Archive source files + record to Memory

**Hard Constraints (NEVER violate):**
- ✅ `01-INPUT/` is READ-ONLY — never modify source files, only move to archive
- ✅ Pause on conflicts — never self-decide when old/new knowledge contradict
- ✅ Never fabricate — if no content, leave empty, don't guess
- ✅ All pages must have bidirectional links — no orphan pages
- ✅ Log all operations — append-only audit trail

---

### 2. `/query` — Knowledge-Based QA Engine

Answers questions **using only the local knowledge base**, never relying on model memory. All answers include source citations, high-value summaries auto-save as Synthesis.

**Usage:**
```bash
/query 你的问题
```

**Pipeline:**
1. Memory check for similar past questions
2. Always read `wiki/index.md` first to locate relevant pages
3. Deep read + cross-validation across multiple pages
4. Calibration quality self-check
5. Comprehensive answer with double-chain citations
6. Auto-detect Synthesis opportunities (long answers > 3 pages referenced, conflict resolution)
7. Log operation in `wiki/log.md`

**Hard Constraints:**
- ✅ No memory-based answers — must retrieve from knowledge base first
- ✅ No silent answers — explicitly state when knowledge base has no content
- ✅ Clearly distinguish "knowledge base content" vs "general knowledge"
- ✅ Mark conflicts explicitly — don't pick sides when inconsistencies found

---

### 3. `/lint` — Knowledge Base Health Check

Global quality inspection of the knowledge base, like static code analysis for software engineering.

**Usage:**
```bash
/lint     # Run full health check
/health   # Same as above
/scan     # Same as above
```

**Inspection Items:**
- ✅ Index consistency: files ↔ `wiki/index.md` bidirectional matching
- ✅ Bidirectional link health: detect broken links and orphan pages
- ✅ Cognitive conflict review: find self-contradictions in knowledge base
- ✅ Frontmatter specification check
- ✅ Health score calculation (0-100 points)

**Auto-Repairable (one-click):**
- Unsynced indexes (file exists but not registered)
- Frontmatter specification issues
- Add "pending classification" tags to orphan pages

**Manual Repair Required:**
- Broken links (ask user: create new page OR delete reference)
- Knowledge conflicts (user must decide which to keep)
- Unsynced indexes (registered but file doesn't exist)

---

## Common Commands & Workflows

### Daily Knowledge Work
```bash
# 1. Drop articles into 01-INPUT/ then run
/ingest

# 2. Query knowledge base
/query Prompt Engineering best practices?

# 3. Regular quality check
/lint
```

### Git Backup (Recommended)
```bash
git add .
git commit -m "update: knowledge sync YYYY-MM-DD"
git push
```

### Install Additional Skills (Optional)
```bash
/skill install web-access        # Web search/scraping
/skill install article           # WeChat official article writing
/skill install mindmap           # Mind map generation
/skill install code-review       # Code review
/skill install feishu            # Feishu document 2-way sync
```

---

## Knowledge Base File Naming Conventions

| Type | Path | Naming Pattern |
|------|------|---------------|
| Source Summaries | `wiki/sources/` | `摘要-{slug}.md` |
| Entities | `wiki/entities/` | `{EntityName}.md` (PascalCase) |
| Concepts | `wiki/concepts/` | `{ConceptName}.md` (PascalCase, underscores for spaces) |
| Syntheses | `wiki/syntheses/` | `综合-{topic}.md` |

---

## Page Frontmatter Standard

All knowledge pages in `wiki/` must include:
```markdown
---
title: "Page Title"
type: source/entity/concept/synthesis
tags: [category, keywords]
sources: [original file path]
last_updated: YYYY-MM-DD
confidence: high/medium/low
---
```

---

## Automation Configuration (Optional)

In `.claude/settings.json`:
```json
{
  "hooks": {
    "post-tool-call": [
      "if file saved to 01-INPUT/, run /ingest"
    ],
    "cron": [
      "0 9 * * 1: /lint"  // Auto lint every Monday 9 AM
    ]
  }
}
```

---

## Key Principles For This Repository

1. **Incremental Updates Only**: Never overwrite existing knowledge, only append new information. Duplication is better than loss.

2. **Source Files Are Sacred**: Never modify anything in `01-INPUT/` except moving processed files to `09-archive/`.

3. **Human In The Loop**: Knowledge conflicts, broken link resolution, and delete operations always require human confirmation.

4. **Auditable History**: `wiki/log.md` is append-only — never edit or delete historical entries.

5. **No Fabrication**: If the knowledge base has no content on a topic, explicitly say so. Don't supplement with model memory without clearly marking it as external knowledge.

6. **Double Chain Everywhere**: Every new page must be linked from at least one other page and registered in `index.md` — no islands.

---

## Related Documentation

- `README.md` — Project overview and quick start guide
- `.claude/skills/ingest/SKILL.md` — Ingest skill detailed specification
- `.claude/skills/query/SKILL.md` — Query skill detailed specification
- `.claude/skills/lint/SKILL.md` — Lint skill detailed specification
