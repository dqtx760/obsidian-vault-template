---
title: "TheSchema"
type: concept
tags: [概念, 知识管理, 规范]
sources: [01-输入/09-archive/Karpathy的LLM Wiki.md]
last_updated: 2026-05-20
confidence: high
---

## 核心定义

人与 AI 约定的知识加工规范，是 LLM Wiki 框架的三大基石之一。TheSchema 确保 AI 生成的知识符合统一的结构和质量标准。

## 规范内容
1. **目录结构规范**：定义知识库的文件夹组织方式
2. **Front Matter 规范**：统一的 YAML 元数据格式
3. **工作流规范**：定义 Ingest、Query、Lint 的标准流程

## Front Matter 示例
```yaml
---
type: "entity|concept|comparison|source"
tags: []
summary: "一句话说明"
sources: ["raw/xxx.pdf"]
updated: "2026-05-07"
---
```

## 关联连接
- [[LLM_Wiki_Methodology]] — TheSchema 是该框架的三大基石之一
- [[摘要-karpathy-llm-wiki]] — 相关来源摘要
