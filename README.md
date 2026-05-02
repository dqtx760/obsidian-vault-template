# Obsidian 知识库模板

一个开箱即用的 Obsidian 知识库模板，基于 [LLM Wiki 方法论](https://github.com/karpathy/llm-wiki) 构建。

## 目录结构

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
└── commands/                  ← 自定义命令
```

## 快速开始

### 1. 克隆到本地

```bash
git clone https://github.com/dqtx760/obsidian-vault-template.git 你的仓库名字
```

### 2. 用 Obsidian 打开

```bash
cd 你的仓库名字
# 直接用 Obsidian 打开当前目录
```

### 3. 开始使用

- **写日记**：每天自动生成今日笔记
- **记录想法**：放到 `01-INPUT/ideas（选题）/`
- **整理知识**：放到 `03-OUTPUT/wiki/`

## 核心配置

### 已启用的插件

- [x] 日记 (Daily Notes)
- [x] 模板 (Templates)
- [x] 数据视图 (Dataview)
- [x] 超级笔记 (Supercharged Links)

### 自定义快捷命令

| 命令 | 快捷键 |
|------|--------|
| 快速切换 | Ctrl+O |
| 今日日记 | Ctrl+Shift+D |
| 插入模板 | Ctrl+T |

## 五层架构

```
01-INPUT/       ← 原始资料，唯一事实来源
02-PROCESSING/  ← AI 处理区，研究摘要和中间稿
03-OUTPUT/      ← 正式作品和知识 Wiki
04-FEEDBACK/    ← 反馈追踪，驱动系统进化
05-REFERENCE/   ← 长期参考资料
```

> **注意**：LLM 只读不改 01-INPUT，知识的整理和链接在 03-OUTPUT/wiki 完成。

## 常见问题

### Q1：如何让 AI 帮我整理知识？

把资料放到 `01-INPUT/` 目录，然后让 AI 读取并整理到 `03-OUTPUT/wiki/`。

### Q2：如何备份？

```bash
git add .
git commit -m "更新"
git push
```

### Q3：如何同步到手机？

推荐使用 iCloud、OneDrive 或坚果云同步整个仓库文件夹。

## 关于

基于大强同学的 Obsidian 使用实践构建。

| 平台 | 链接 |
|------|------|
| 🌐官网 | [dqtx.cc](https://www.dqtx.cc/) |
| 📺B站 | [大强同学_](https://space.bilibili.com/491358682) |
| 📕小红书 | [大强同学](https://www.xiaohongshu.com/user/profile/5ce0d3a7000000001202e31b) |
