# Obsidian 知识库模板

一个开箱即用的 Obsidian 知识库模板，基于 [LLM Wiki 方法论](https://github.com/ karpathy/llm-wiki) 构建。

## 目录结构

```
writing-system/
  01-INPUT/
    articles/
    transcripts/
    ideas/
  02-PROCESSING/
    research/
    outlines/
    drafts/
    reviews/
  03-OUTPUT/
    newsletters/
    scripts/
    wiki/
  04-FEEDBACK/
    metrics/
    comments/
    retrospectives/
```


`01-INPUT` 是原材料入口，不要求完美，只要求低摩擦。

`02-PROCESSING` 是 AI 处理区，用来放研究摘要、选题分析、文章结构和中间稿。

`03-OUTPUT` 是正式作品区，存放可发布内容。

`04-FEEDBACK` 是很多人忽略的一层。没有反馈，系统就不会进化。每次发布之后，哪些标题有效，哪些段落被引用，哪些观点引发讨论，都应该进入这里

`05-REFERENCE` 存放长期参考资料，比如人物、工具、概念、框架。

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
- **记录想法**：放到 `01_输入/随记/`
- **整理知识**：放到 `02_知识库/`

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

## 三层架构

```
01_输入/     ← 原始资料，唯一事实来源
02_知识库/  ← 整理后的知识网络（Wiki）
03_输出/    ← 已发布的内容（可选）
```

> **注意**：LLM 只读不改 01_输入，知识的整理和链接在 02_知识库 完成。

## 常见问题

### Q1：如何让 AI 帮我整理知识？

把资料放到 `01_输入/` 目录，然后让 AI 读取并整理到 `02_知识库/`。

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
