/**
 * Skill 注册表 — 按实际工作流分类
 * 点击按钮 → 复制命令到剪贴板 → 去 Claude 终端粘贴执行
 */

export type SkillGroup = 'new' | 'write' | 'design' | 'query' | 'organize';

export interface SkillDef {
  id: string;
  name: string;
  icon: string;
  command: string;
  group: SkillGroup;
  description: string;
}

export const SKILLS: SkillDef[] = [
  // ===== 新建 =====
  { id: 'daily-log',  name: '日记',   icon: '📅', command: 'DAILY_NOTE_AUTO',  group: 'new',      description: '自动创建并打开今日日记' },
  { id: 'new-note',   name: '笔记',   icon: '📄', command: 'NEW_NOTE_AUTO',   group: 'new',      description: '新建空白笔记' },

  // ===== 文案 =====
  { id: 'hotspot',    name: '查热点',   icon: '🔥', command: '/aihot',                     group: 'write', description: '查看热点趋势' },
  { id: 'topic-gen',  name: '选题生成', icon: '💡', command: '/huashu-topic-gen',          group: 'write', description: '基于素材生成选题角度' },
  { id: 'write',      name: '写文章',   icon: '✍️', command: '/khazix-writer',             group: 'write', description: '通用写作' },
  { id: 'tutorial',   name: '写教程',   icon: '📖', command: '/daqiang-tutorial',           group: 'write', description: '教程类专用写作' },
  { id: 'traffic',    name: '引流文案', icon: '🎯', command: '/article-traffic-writer',     group: 'write', description: '引流型文案' },
  { id: 'humanize',   name: '去AI味',   icon: '🤖', command: '/humanizer',                  group: 'write', description: '降低 AI 痕迹' },
  { id: 'proofread',  name: '审校',     icon: '📝', command: '/huashu-proofreading',        group: 'write', description: '三遍审校降 AI 味' },
  { id: 'title',      name: '标题',     icon: '🏷️', command: '/Title',                      group: 'write', description: '生成文章标题' },
  { id: 'x-post',     name: '短文案',   icon: '✂️', command: '/x-post',                     group: 'write', description: '生成 X / 即刻短文案' },

  // ===== 制图 =====
  { id: 'illustrate', name: '配图',   icon: '📸', command: '/baoyu-article-illustrator', group: 'design', description: '自动文内配图' },
  { id: 'cover',      name: '封面',   icon: '🖼️', command: '/article-cover-16x9',        group: 'design', description: '生成 16:9 封面图' },
  { id: 'card',       name: '卡片',   icon: '🃏', command: '/card',                      group: 'design', description: '生成分享卡片' },
  { id: 'rednote',    name: '小红书',  icon: '📕', command: '/guizang-social-card-skill', group: 'design', description: '小红书 / 社交卡片' },
  { id: 'ppt',        name: 'PPT',    icon: '📊', command: '/beautiful-slides',           group: 'design', description: '生成演示幻灯片' },

  // ===== 查询 =====
  { id: 'query',      name: '查知识库', icon: '🔍', command: 'QUERY_AUTO',  group: 'query',   description: '输入关键词检索 Library' },

  // ===== 整理 =====
  { id: 'ingest',     name: 'Library编译', icon: '📥', command: "/up-Library-ingest", group: 'organize', description: '素材提炼到 Library/' },
  { id: 'wiki-sync',  name: 'Wiki编译',    icon: '🌐', command: "/up-blog-Wiki",      group: 'organize', description: '同步 posts 到 wiki/' },
  { id: 'index-sync', name: 'index编译',   icon: '📋', command: "/up-index",          group: 'organize', description: '同步 index.md 索引' },
  { id: 'full-sync',  name: '全量同步',    icon: '🔄', command: "/Update",            group: 'organize', description: '同时更新 index+Library+wiki' },
];

export const GROUP_LABELS: Record<SkillGroup, string> = {
  new: '新建',
  write: '文案',
  design: '制图',
  query: '查询',
  organize: '整理',
};
