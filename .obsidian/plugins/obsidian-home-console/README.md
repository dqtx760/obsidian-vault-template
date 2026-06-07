# Home Console — Obsidian 插件

内容创作控制台：以内容流水线为核心的仪表盘，一键触发 AI 技能。

## 适配体系

基于四层内容体系：

```
01-输入/  →  Library/  →  posts/  →  wiki/
 (素材)      (知识库)     (文章)     (索引)
```

## 功能

### 统计栏
- 📥 收件箱: 01-输入/ 下未归档素材数
- 📝 草稿: posts/ 中 `draft: true` 的文章
- ✅ 本周发布: 本周已发布文章
- 📚 Library: 知识库总页面数
- 🔗 死链: wiki/ 中无效引用

### Skill 按钮栏
22 个按钮，分 4 组：
- **每日运转** (5): 任务、想法、选题、灵感、日志
- **知识管理** (7): 编译素材、查知识库、体检、全量同步等
- **内容生产** (8): 写文章、去AI味、配图、打包等
- **数据分析** (2): 热点雷达、视频数据分析

点击按钮 → 复制 `claude '命令'` 到剪贴板 → 去 Claude Code 执行。

### Tab 面板
- **📥 输入池**: 收件箱统计 + 最新输入列表
- **📚 知识库**: Library 概览 + 分类分布 + 健康告警
- **✍️ 创作台**: 草稿列表 + 分类分布 + 发布概况
- **🌐 发布看板**: 发布统计 + 标签云 + Wiki 状态

## 安装

### 开发模式
1. 复制本文件夹到 `.obsidian/plugins/home-console/`
2. 重启 Obsidian
3. 设置 → 第三方插件 → 启用 Home Console

### 构建
```bash
npm install
npm run build
```

## 依赖

- Obsidian 1.5.0+
- 桌面端（依赖终端执行 Claude CLI）
- 推荐安装 Obsidian Terminal 插件

## 文件结构

```
obsidian-home-console/
├── manifest.json
├── package.json
├── src/
│   ├── main.ts                 # 插件入口
│   ├── HomeConsoleView.ts      # 主视图
│   ├── modules/
│   │   ├── StatsBar.ts         # 统计栏
│   │   ├── SkillBar.ts         # Skill 按钮栏
│   │   ├── TabPanel.ts         # Tab 容器
│   │   ├── InputPool.ts        # Tab1: 输入池
│   │   ├── LibraryHealth.ts    # Tab2: 知识库
│   │   ├── WritingDesk.ts      # Tab3: 创作台
│   │   └── PublishBoard.ts     # Tab4: 发布看板
│   ├── skills/
│   │   ├── SkillRegistry.ts    # 22 个 Skill 定义
│   │   └── SkillRunner.ts      # 执行器（剪贴板/终端）
│   ├── data/
│   │   └── StatsCollector.ts   # 统计数据收集
│   └── utils/
│       ├── PathConstants.ts    # 目录路径常量
│       ├── DateUtils.ts        # 日期工具
│       └── CacheManager.ts     # 缓存管理
└── styles/
    └── console.css             # 暗色主题样式
```
