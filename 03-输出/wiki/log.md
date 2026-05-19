# Wiki 操作日志

---

## [2026-05-20] cleanup | 清理无对应来源的知识库页面

### 清理原因
- 原知识库中存在大量从其他模板复制的内容，无对应的原始资料
- 按照「原始资料是唯一事实来源」的原则，清理无对应来源的页面

### 删除内容统计

**来源摘要（7 个）：**
- 摘要-5c-prompt-contracts-paper
- 摘要-ai-prompt-engineering-2025-2026-espo
- 摘要-anthropic-prompting-best-practices
- 摘要-complete-prompt-engineering-guide-2025
- 摘要-gemini-api-prompting-strategies
- 摘要-google-prompt-engineering-whitepaper
- 摘要-prompt-engineering-2025-guide-promptbuilder

**实体页面（4 个）：**
- Anthropic
- Claude
- Gemini
- Google

**概念页面（5 个）：**
- 5C_Framework
- Chain_of_Thought
- Context_Engineering
- Few_Shot_Prompting
- Prompt_Engineering

**综合分析（1 个）：**
- 5c-prompt-markdown-note-taking

### 清理后状态
- 保留内容：全部基于 `Karpathy的LLM Wiki.md` 生成
- 总页面数：9 个（不含 index/log）
  - 来源摘要：1 个
  - 概念页面：3 个
  - 实体页面：5 个

---

## [2026-05-20] ingest | 摄入 Karpathy LLM Wiki 方法论文章

### 处理文件
- `01-输入/网页剪藏/Karpathy的LLM Wiki.md`

### 创建的来源摘要（1 个）
| 文件 | 描述 |
|------|------|
| [[摘要-karpathy-llm-wiki]] | Karpathy LLM Wiki 方法论完整解读 |

### 创建的概念页面（3 个）
| 页面 | 类型 | 核心内容 |
|------|------|----------|
| [[LLM_Wiki_Methodology]] | 方法论 | Karpathy 提出的知识管理完整框架 |
| [[Knowledge_Compilation]] | 核心理念 | 知识编译：从原始资料到结构化知识网络 |
| [[TheSchema]] | 规范 | 人与 AI 约定的知识加工规范 |

### 创建的实体页面（5 个）
| 页面 | 描述 |
|------|------|
| [[Andrej_Karpathy]] | 前 Tesla AI 总监，LLM Wiki 提出者 |
| [[Tesla]] | Tesla 公司 |
| [[Obsidian]] | 双链知识管理与笔记软件 |
| [[Newtype_os]] | 支持一键 Wiki 编译的 AI 操作系统 |
| [[GitHub]] | 代码托管平台，LLM Wiki 相关模板托管 |

### 更新文件
- [[index.md]] — 重新组织了总目录结构
- log.md — 记录本次操作（本条目）

### 核心洞察
1. **知识编译理念**：原始资料是唯一事实来源，AI 的任务是把资料"编译"成可复用的知识网络
2. **三种文件类型**：Raw Resource（只读）、Wiki（AI 生成）、TheSchema（约定规范）
3. **三种操作流程**：Ingest → Query → Lint，与本仓库的三个核心 Skill 完美对应
4. **内容是给 AI 看的**：Index 和 Log 的设计初衷就是给 AI 用，这解释了为什么需要严格的格式规范

### 归档操作
源文件已移动至 `01-输入/09-archive/Karpathy的LLM Wiki.md`

---

## [2026-05-20] refactor | 知识库架构升级

### 架构变更说明
**升级前**：模板复制的混合内容知识库
**升级后**：基于 Karpathy LLM Wiki 方法论的纯净知识体系

### 核心变更点
1. **路径统一**：所有英文路径改为中文（01-输入、02-处理中、03-输出、04-反馈、05-参考）
2. **索引重构**：index.md 改为 4 分类体系（Concepts / Entities / Sources / Syntheses）
3. **全局清理**：删除所有无对应原始资料的页面，保证知识库纯净性
4. **路径修正**：所有 SKILL.md 配置文件路径与实际目录结构对齐

### 更新的配置文件
| 文件 | 变更类型 | 核心内容 |
|------|------|------|
| CLAUDE.md | 重构 | 全局行为规范与中文路径对齐 |
| .claude/skills/ingest/SKILL.md | 升级 | 路径修正：01-输入/、03-输出/wiki/ |
| .claude/skills/query/SKILL.md | 升级 | 路径修正：03-输出/wiki/ |
| .claude/skills/lint/SKILL.md | 升级 | 路径修正：03-输出/wiki/ |

### 架构升级的核心决策
1. **纯净知识库原则**：无对应原始资料的内容一律不保留
2. **中文路径优先**：所有目录使用中文命名，符合用户使用习惯
3. **五层架构**：01-输入 → 02-处理中 → 03-输出 → 04-反馈 → 05-参考
4. **增量而非覆盖**：所有页面更新采用增量合并策略，保护已有知识投资

### 📋 下一步行动
1. 新增资料放入 `01-输入/` 对应子目录
2. 运行 `/ingest` 进行知识编译
3. 运行 `/lint` 进行知识库健康检查

---
