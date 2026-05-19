---
title: "LLM Wiki Methodology"
type: concept
tags: [概念, 知识管理, 方法论]
sources: [01-输入/09-archive/Karpathy的LLM Wiki.md]
last_updated: 2026-05-20
confidence: high
---

## 核心定义

由 Andrej Karpathy 提出的知识管理方法论，核心是将知识管理从"每次查询时重新派生"转变为"编译一次，保持最新"的模式，构建真正的**可复利知识层**。

## 核心框架

### 三种文件类型（知识库的基石）
| 文件类型 | 作用 | 示例 |
|---------|------|------|
| **Raw Resource** | 存放原始资料（唯一事实来源） | PDF、视频、网页剪藏 |
| **Wiki** | AI 主导生成的知识节点 | 实体页、概念页、对比页 |
| **TheSchema** | 人与 AI 约定的加工规范 | 目录结构、Front Matter、工作流 |

### 三种日常操作
1. **Ingest（摄取）**：把新资料喂给 AI → AI 提取实体/概念 → 新增或修改 Wiki → 更新 Index 和 Log
2. **Query（问答）**：基于 Wiki 而非原始资料提问 → 效率更高 → 回答有价值可生成新 Wiki
3. **Lint（审查）**：让 AI 定期做体检：是否有矛盾？是否有被推翻的旧表述？是否有孤立页面？

### 三种查询提效工具
| 工具 | 作用 |
|------|------|
| **Index** | 所有 Wiki 的一句话摘要，方便 AI 快速定位 |
| **Log** | 记录 AI 每次操作，让它知道你研究了什么 |
| **RAG** | Wiki > 1000 页时，用 Qmd 等工具进行混合检索 |

## 三个容易被忽视的盲点

1. **原始资料可能更适合入门**：Wiki 是原子化、结构化的，适合回顾和总结。但初学者应该先完整学习原始资料，再来看 Wiki 串联知识点。

2. **AI 生成的 Wiki 需要验收**：不要无脑囤积。检查链接是否有上下文（"详见 XXX"却没说为什么相关）、内容是否准确。持续迭代 Schema 才能产生真正价值。

3. **现在创建的内容是给 AI 看的**：Index 和 Log 的设计初衷就是给 AI 用；用 `type` 属性区分"人写的内容"和"AI 生成的内容"；Summary 字段方便 AI 检索。

## 实践建议

建议建立 3 个核心 Skill：
- **ingest** — 将 Raw 目录下的原始资料编译到 Wiki 中
- **lint** — 知识库全局健康度检查
- **query** — 基于本地 Wiki 知识库回答用户提问

## 关联连接
- [[Andrej_Karpathy]] — 本方法论的提出者
- [[Knowledge_Compilation]] — 知识编译的核心理念
- [[TheSchema]] — 人与 AI 约定的加工规范
- 本仓库实现三个核心技能：Ingest、Query、Lint
- [[摘要-karpathy-llm-wiki]] — 相关来源摘要
