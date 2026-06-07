/**
 * 内容目录路径常量
 * 基于 D:\project2026\fuwari\src\content 的实际结构
 */

// 输入层
export const INPUT_ROOT = '01-输入';
export const INPUT_FOLDERS = {
  clippings: '01-输入/01-Clipings',
  getNotes: '01-输入/02-get笔记',
  wechat: '01-输入/03-微信',
  topics: '01-输入/04-选题',
  scripts: '01-输入/05-口喷稿',
  weread: '01-输入/06-微信读书',
  daily: '01-输入/07-Daily',
};
export const INPUT_ARCHIVE = '01-输入/archive';

// 知识库层
export const LIBRARY_ROOT = 'Library';
export const LIBRARY_FOLDERS = {
  concepts: 'Library/concepts',
  entities: 'Library/entities',
  sources: 'Library/sources',
  syntheses: 'Library/syntheses',
};

// 博客文章层
export const POSTS_ROOT = 'posts';
export const POSTS_CATEGORIES = {
  aihacks: 'posts/AIHacks',
  software: 'posts/Software',
  technical: 'posts/Technical',
  workflow: 'posts/Workflow',
};

// 博客索引层
export const WIKI_ROOT = 'wiki';

// 动态内容
export const MEMORIA_ROOT = 'Memoria';

// 收件箱目录（用于统计）
export const INBOX_FOLDERS = [
  INPUT_FOLDERS.clippings,
  INPUT_FOLDERS.getNotes,
  INPUT_FOLDERS.wechat,
  INPUT_FOLDERS.topics,
  INPUT_FOLDERS.scripts,
  INPUT_FOLDERS.weread,
];

// 收件箱目录显示名
export const INBOX_FOLDER_LABELS: Record<string, string> = {
  [INPUT_FOLDERS.clippings]: '网页剪藏',
  [INPUT_FOLDERS.getNotes]: 'Get笔记',
  [INPUT_FOLDERS.wechat]: '微信收藏',
  [INPUT_FOLDERS.topics]: '选题素材',
  [INPUT_FOLDERS.scripts]: '口喷稿',
  [INPUT_FOLDERS.weread]: '微信读书',
};
