
AI 时代最大的讽刺：我们拥有了最强大的知识处理工具，却仍在用最原始的方式管理知识。

前 Tesla AI 总监 Karpathy 给出了他的答案——**LLM Wiki**。

这套框架近期在 GitHub 上引发广泛关注。仔细研读后，我发现它的核心价值不在于技术实现，而在于一套关于**知识组织的理念与行为准则**——门槛极低，却能带来质的飞跃。

![image.png](https://gitee.com/da-qiang-classmate/typora/raw/master/image/20260507230429547.png)

### 核心框架

#### 三种文件：知识库的基石

| 文件类型             | 作用            | 示例                    |
| ---------------- | ------------- | --------------------- |
| **Raw Resource** | 存放原始资料        | PDF、视频、网页剪藏           |
| **Wiki**         | AI 主导生成的知识节点  | 实体页、概念页、对比页           |
| **TheSchema**    | 人与 AI 约定的加工规范 | 目录结构、Front Matter、工作流 |

> **核心洞察**：原始资料是唯一事实来源，AI 的任务是把资料**编译**成可复用的知识网络。

---

#### 三种日常操作

**1. Ingest（摄取）**
- 把新资料喂给 AI → AI 提取实体/概念 → 新增或修改 Wiki → 更新 Index 和 Log

**2. Query（问答）**
- 基于 Wiki 而非原始资料提问 → 效率更高 → 回答有价值可生成新 Wiki

**3. Lint（审查）**
- 让 AI 定期做体检：是否有矛盾？是否有被推翻的旧表述？是否有孤立页面？

---

#### 三种查询提效工具

| 工具        | 作用                            |
| --------- | ----------------------------- |
| **Index** | 所有 Wiki 的一句话摘要，方便 AI 快速定位     |
| **Log**   | 记录 AI 每次操作，让它知道你研究了什么         |
| **RAG**   | Wiki >1000 页时，用 Qmd 等工具进行混合检索 |

附：QMD原理详细解读
https://zhuanlan.zhihu.com/p/2016471943256254194


### 我的 Obsidian 实践

#### 模板示范

```
obsidian-vault/
├── 01-INPUT/                  ← 原材料入口，低摩擦记录
│   ├── articles/                文章
│   ├── transcripts/             转录稿
│   ├── ideas（选题）/            选题灵感
│   ├── sources（素材）/          素材收集
│   ├── 剪藏/                    网页剪藏
│   ├── 周报和复盘/              复盘记录
│   ├── 文章草稿/                写作草稿
│   ├── 模板/                    笔记模板
│   ├── 研究报告/                研究资料
│   └── 项目资料/                项目相关
├── 02-PROCESSING/             ← AI 处理区，研究摘要、选题分析、中间稿
│   ├── research/
│   ├── outlines/
│   ├── drafts（AI初稿）/
│   └── reviews/
├── 03-OUTPUT/                 ← 正式作品区，可发布内容
│   ├── newsletters/
│   ├── scripts/
│   └── wiki/                    知识 Wiki
├── 04-FEEDBACK/               ← 反馈层，追踪内容效果，驱动系统进化
│   ├── metrics/
│   ├── comments/
│   ├── retrospectives/
│   └── ARCHIVE归档/
├── 05-REFERENCE/              ← 长期参考资料
│   └── 提示词/                  AI 提示词库
├── AGENTS                     ← Newtype-os记忆文件（硬链接）
├── CLAUDE                     ← Claude code记忆文件（硬链接）
├── QWEN                       ← qwen code记忆文件（硬链接）
├── TheSchema                  ← 核心规范文档
└── commands/                  ← 自定义命令
```

> 💡 说明：CLAUDE、QWEN、AGENTS 实际上是同一个文件的硬链接（TheSchema），让不同的 AI Agent 都能读取到同一份规范文档。

#### yaml属性示例

```yaml
---
type: "entity|concept|comparison|source"
tags: []
summary: "一句话说明"
sources: ["raw/xxx.pdf"]
updated: "2026-05-07"
---
```

#### 实践建议

建议建 3 个 skill：

**1. ingest** — 将 Raw/ 目录下的原始资料编译到 Wiki/ 中

也可以直接在 Claudian 插件中对话：
```
请根据 @wiki/TheSchema 的规范，针对我 01_Raw/ 文件夹下的所有文件夹下全部文档进行分析拆解并创建出相应的wiki页面以及建立他们之间的链接关系
```

或：
```
请基于提供的资料，生成 02_Wiki/ 下的结构化知识条目，并根据主题归入对应的分类目录；若知识库中没有匹配的分类，请自动创建新分类。条目需保持独立、标题清晰，格式符合 Wiki 规范
```

**2. lint** — 知识库全局健康度检查

**3. query** — 基于本地 Wiki 知识库回答用户提问

---

### 三个容易被忽视的盲点

#### 1. 原始资料可能更适合入门

Wiki 是原子化、结构化的，**适合回顾和总结**。但初学者应该先完整学习原始资料（PDF 的章节结构、视频的循序渐进），再来看 Wiki 串联知识点。

#### 2. AI 生成的 Wiki 需要验收

不要无脑囤积。检查链接是否有上下文（"详见 XXX"却没说为什么相关）、内容是否准确。**持续迭代 Schema 才能产生真正价值。**

#### 3. 现在创建的内容是给 AI 看的

- Index 和 Log 的设计初衷就是给 AI 用
- 用 `type` 属性区分"人写的内容"和"AI 生成的内容"
- Summary 字段方便 AI 检索

---

### 资源汇总

#### Obsidian实例

| 模板                         | 作者           | 链接                                                        |
| -------------------------- | ------------ | --------------------------------------------------------- |
| obsidian-vault-template    | 我自己创建        | https://github.com/dqtx760/obsidian-vault-template        |
| karpathy-llm-wiki-vault    | 内含 3 个 skill | https://github.com/jason-effi-lab/karpathy-llm-wiki-vault |
| llm-wiki-obsidian-blink    | Blink 老师     | https://github.com/iBlinkQ/llm-wiki-obsidian-blink        |
| obsidian-ai-vault-template | 志辉           | https://github.com/iamzhihuix/obsidian-ai-vault-template  |

#### 一键 Wiki

> 💡 这里与 Karpathy 原方法略有不同：原方法是"摄入新资料后编译"，这里是"对已发布的博客内容进行编译"。


前提需安装 Newtype-os。比如我对我博客编译是这样的，终端 `nt` 启动 Newtype-os：

```bash
/wiki 根据 post 文件夹内容进行编译
```

- **本地体验**：安装 [Newtype-os](https://www.dqtx.cc/posts/aihacks/newtype-os/) 后，在终端执行上述命令
- **在线预览**：访问 [dqtx.cc/wiki](https://www.dqtx.cc/wiki/) 免安装查看我的博客编译

---

Karpathy 的 LLM Wiki 框架，本质是把知识管理从"每次查询时重新派生"变成"编译一次，保持最新"。

这才是真正的**可复利**知识层。

**工具会变，但这套方法论值得长期践行!**
