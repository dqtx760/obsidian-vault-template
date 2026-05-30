# Obsidian + Claude Code 知识工作模板

一个开箱即用的 AI 原生知识管理模板，融合 Obsidian 的双链知识网络与 Claude Code 的自动化能力。

> **定位升级**：这不再是一个"笔记模板"，而是一套**知识工厂操作系统**。Claude Code 会像你的数字同事一样，自动帮你摄取资料、整理知识、巡检质量、回答问题。

## ✨ 核心能力（来自 Claude Code）

| 能力                   | 说明                                              |
| -------------------- | ----------------------------------------------- |
| 🛠️ **Tool 工具系统**    | 100+ 内置工具，直接操作文件、搜索代码、运行命令，无需复制粘贴               |
| 🔗 **Hooks 钩子机制**    | 事件驱动自动化：文件变更时自动 ingest、定时巡检、commit 触发 lint      |
| 🎯 **Skill 技能引擎**    | 三个核心技能 `/ingest` `/query` `/lint`，可扩展到 50+ 官方技能 |
| 🧠 **Subagent 子智能体** | Explore 子智能体深度扫描代码库，Plan 子智能体做架构设计              |
| 💾 **Memory 记忆系统**   | 跨会话记住你的偏好、知识框架、历史决策，越用越懂你                       |
| ⚡ **MCP 开放协议**       | 可对接飞书/钉钉、数据库、微信、RSS，打破信息孤岛                      |
| 🔄 **Loop 循环执行**     | 定时抓取资讯、定期健康巡检、异步任务监控                            |
| 📊 **Task 任务管理**     | 自动追踪复杂任务进度，断点续做不丢上下文                            |

---

## 📁 目录结构

```
obsidian-vault/
├── 01-输入/                   ← 原材料入口，低摩擦记录
│   ├── 网页剪藏/                文章剪藏
│   ├── 语音转文稿/              播客/视频转录稿
│   ├── 选题/                   选题灵感
│   ├── 素材/                   素材收集
│   ├── 研究报告/               研究资料
│   ├── 项目资料/               项目相关资料
│   ├── 周报和复盘/             周报与复盘记录
│   ├── 模板/                   笔记模板
│   └── 09-archive/            已处理归档（禁止读取）
├── 02-处理中/                ← AI 处理区，中间产物
│   ├── research/                研究摘要
│   ├── outlines/                大纲
│   ├── drafts/                  AI 初稿
│   └── reviews/                 评审稿
├── 03-输出/                  ← 正式作品区
│   └── wiki/                    知识 Wiki（核心知识网络）
│       ├── sources/               来源摘要（1 源文件 → 1 source）
│       ├── entities/              实体（人/公司/产品/工具）
│       ├── concepts/              概念（框架/理论/方法论）
│       ├── syntheses/             综合分析（高价值总结）
│       ├── index.md               全局索引
│       └── log.md                 操作日志（Append-only）
├── 04-反馈/                 ← 反馈层，驱动系统进化
│   ├── metrics/                 数据指标
│   ├── comments/                用户反馈
│   └── retrospectives/          复盘
│   └── ARCHIVE归档/            历史归档
├── 05-参考/                ← 长期参考资料
│   ├── 提示词/                 AI 提示词库
│   ├── Obsidian指南/            Obsidian 使用技巧
│   └── Claude code安装/        Claude Code 安装配置
├── .claude/                    ← Claude Code 配置（魔法所在 ✨）
│   ├── CLAUDE.md                全局行为规范
│   ├── skills/                  自定义技能
│   │   ├── ingest/                资料摄取 → 知识编译
│   │   ├── query/                 知识检索 → 问答综合
│   │   └── lint/                  质量巡检 → 健康维护
│   ├── agents/                  Agent 配置
│   └── commands/                自定义命令
├── .claudian/                  ← Claudian 插件配置
└── .obsidian/                 ← Obsidian 配置与插件
```

---

## 🚀 快速开始

### 1. 克隆到本地

```bash
git clone https://github.com/dqtx760/obsidian-vault-template.git 你的知识库名字
```

### 2. 用 Claude Code 打开

```bash
cd 你的知识库名字
claude .
```

### 3. 开始工作

| 你需要做的             | Claude Code 会帮你做的      |
| ----------------- | ---------------------- |
| 把文章丢进 `01-INPUT/` | `/ingest` → 自动整理到 wiki |
| 有问题想问             | `/query 问题` → 基于知识库回答  |
| 每周一               | 自动运行 `/lint` 检查知识库健康   |

---

## 🎯 三个核心技能

### `/ingest` — 知识编译流水线

把原始资料自动编译成结构化知识：

```bash
/ingest                    # 扫描所有未归档文件
/ingest 01-INPUT/xxx.md   # 处理指定文件
```

**自动完成：**
1. 读取并翻译源文件
2. 提炼核心实体/概念
3. 创建来源摘要页面
4. 增量更新实体/概念页面
5. 检测并报告知识冲突
6. 更新全局索引和日志
7. 源文件自动归档

### `/query` — 基于记忆的问答

只使用你的本地知识库回答，绝不凭模型记忆胡说：

```bash
/query 5C Framework 和其他提示框架的区别？
/query 我之前对 Context Engineering 的决策是什么？
```

**特色：**
- 所有回答都带有双链引用来源
- 高价值总结自动固化为 synthesis
- 知识库无内容时明确声明，不编造

### `/lint` — 知识库健康体检

定期巡检知识图谱质量，像代码 lint 一样：

```bash
/lint     # 运行完整健康检查
```

**检测项：**
- ✅ 绿灯：双向链接完整性
- ⚠️ 黄灯：孤儿页面、未同步索引
- ❌ 红灯：死链、未解决的知识冲突

---

## 🔧 自动化配置（可选）

在 `.claude/settings.json` 中配置 Hooks 实现真正的自动化：

```json
{
  "hooks": {
    "post-tool-call": [
      // 每次保存文章后自动 ingest
      "if file saved to 01-INPUT/, run /ingest"
    ],
    "cron": [
      // 每周一 9:00 自动运行 lint
      "0 9 * * 1: /lint"
    ]
  }
}
```

---

## 🧩 推荐 Skill 扩展（按需安装）

```bash
/skill install web-access        # 联网搜索/抓取
/skill install article           # 公众号文章写作
/skill install mindmap           # 思维导图生成
/skill install code-review       # 代码评审
/skill install feishu            # 飞书文档双向同步
```

---

## ❓ 常见问题

### Q1：和普通 Obsidian 有什么区别？

普通 Obsidian 是你手动整理笔记的编辑器。这个模板 + Claude Code 是**你和 AI 一起维护的知识工厂**——你负责输入原料，AI 负责加工、整理、质检。

### Q2：AI 会改坏我的笔记吗？

不会。三大安全机制：
1. **Ingest 只读不改**：01-INPUT 的源文件永远只读，AI 只在 03-OUTPUT 新增
2. **增量更新策略**：已有页面只追加新信息，不覆盖原有内容
3. **冲突人工确认**：发现知识冲突时立即暂停，等你决策

### Q3：如何备份？

```bash
git add .
git commit -m "update: 知识更新"
git push
```

### Q4：Claude Code 怎么安装？

访问 [claude.ai/code](https://claude.ai/code) 下载，支持 Windows/Mac/Linux。

---

## 📢 关于

基于大强同学的 AI 原生知识管理实践构建。

| 平台 | 链接 |
|------|------|
| 🌐官网 | [dqtx.cc](https://www.dqtx.cc/) |
| 📺B站 | [大强同学_](https://space.bilibili.com/491358682) |
| 📕小红书 | [大强同学](https://www.xiaohongshu.com/user/profile/5ce0d3a7000000001202e31b) |
