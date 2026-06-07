/**
 * Tab2: 知识库
 * 展示 Library 状态和健康度
 */

import type { StatsData } from '../data/StatsCollector';
import type { StatsCollector } from '../data/StatsCollector';
import { relativeTime } from '../utils/DateUtils';

const CATEGORY_LABELS: Record<string, string> = {
  concepts: '概念/方法论',
  entities: '工具/人物/产品',
  sources: '素材摘要',
  syntheses: '综合分析',
};

export function renderLibraryHealth(
  container: HTMLElement,
  stats: StatsData,
  collector: StatsCollector
): void {
  container.empty();
  container.addClass('hc-tab-content');

  const grid = container.createDiv({ cls: 'hc-grid-2col' });

  // 左列: Library 概览 + 分类分布
  const leftCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderLibraryOverview(leftCol, stats);
  renderCategoryBreakdown(leftCol, stats);

  // 右列: 快捷入口 + 最新页面 + 健康告警
  const rightCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderQuickLinks(rightCol);
  renderLatestPages(rightCol, collector);
  renderHealthAlerts(rightCol, stats);
}

/** Library 概览卡片 */
function renderLibraryOverview(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: 'Library 概览' });

  const grid = card.createDiv({ cls: 'hc-stat-grid' });

  const statItems = [
    { label: '总页面', value: stats.libraryPages, icon: '📚' },
    { label: 'concepts', value: stats.libraryBreakdown['concepts'] || 0, icon: '💡' },
    { label: 'entities', value: stats.libraryBreakdown['entities'] || 0, icon: '📦' },
    { label: 'sources', value: stats.libraryBreakdown['sources'] || 0, icon: '📄' },
    { label: 'syntheses', value: stats.libraryBreakdown['syntheses'] || 0, icon: '🔗' },
  ];

  for (const item of statItems) {
    const cell = grid.createDiv({ cls: 'hc-stat-cell' });
    cell.createSpan({ cls: 'hc-stat-cell-icon', text: item.icon });
    cell.createSpan({ cls: 'hc-stat-cell-value', text: String(item.value) });
    cell.createSpan({ cls: 'hc-stat-cell-label', text: item.label });
  }
}

/** 分类分布条形图 */
function renderCategoryBreakdown(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '分类分布' });

  const bars = card.createDiv({ cls: 'hc-card-bars' });
  const breakdown = stats.libraryBreakdown;
  const maxCount = Math.max(...Object.values(breakdown), 1);

  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    const count = breakdown[key] || 0;
    const pct = (count / maxCount) * 100;

    const row = bars.createDiv({ cls: 'hc-bar-row' });
    row.createSpan({ cls: 'hc-bar-label', text: label });

    const barTrack = row.createDiv({ cls: 'hc-bar-track' });
    const barFill = barTrack.createDiv({ cls: 'hc-bar-fill hc-bar-library' });
    barFill.style.width = `${pct}%`;

    row.createSpan({ cls: 'hc-bar-value', text: String(count) });
  }
}

/** 最新知识页面 */
function renderLatestPages(container: HTMLElement, collector: StatsCollector): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '最新知识页面' });

  const files = collector.getLatestLibraryFiles(8);
  const list = card.createDiv({ cls: 'hc-card-list' });

  for (const file of files) {
    const item = list.createDiv({ cls: 'hc-list-item hc-list-file' });
    const name = file.path.split('/').pop()?.replace('.md', '') || file.name;

    // 根据路径判断分类
    const category = file.path.includes('/concepts/') ? 'concepts'
      : file.path.includes('/entities/') ? 'entities'
      : file.path.includes('/sources/') ? 'sources'
      : 'syntheses';

    item.createSpan({
      cls: `hc-tag hc-tag-${category}`,
      text: CATEGORY_LABELS[category]?.split('/')[0] || category,
    });
    item.createSpan({ cls: 'hc-list-label', text: name });
    item.createSpan({
      cls: 'hc-list-time',
      text: relativeTime(new Date(file.stat.mtime)),
    });

    item.addEventListener('click', () => {
      const event = new CustomEvent('hc:open-file', { detail: file.path });
      document.dispatchEvent(event);
    });
    item.addClass('hc-clickable');
  }
}

/** 快捷入口 */
function renderQuickLinks(container: HTMLElement): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '快捷入口' });

  const links = [
    { label: '📑 Library 索引', path: 'Library/index.md' },
    { label: '📋 Library 日志', path: 'Library/log.md' },
  ];

  const list = card.createDiv({ cls: 'hc-card-list' });

  for (const link of links) {
    const item = list.createDiv({ cls: 'hc-list-item hc-clickable' });
    item.createSpan({ cls: 'hc-list-label', text: link.label });
    item.createSpan({ cls: 'hc-list-time', text: '→' });
    item.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('hc:open-file', { detail: link.path }));
    });
  }
}

/** 健康告警 */
function renderHealthAlerts(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '健康告警' });

  const list = card.createDiv({ cls: 'hc-card-list' });

  // 死链
  const deadLinkItem = list.createDiv({ cls: 'hc-list-item' });
  deadLinkItem.createSpan({ cls: 'hc-list-icon', text: stats.deadLinks > 0 ? '🔴' : '🟢' });
  deadLinkItem.createSpan({
    cls: 'hc-list-label',
    text: `死链: ${stats.deadLinks} 处`,
  });

  // TODO: 孤立页面检测（需要更复杂的图分析）
  const orphanItem = list.createDiv({ cls: 'hc-list-item' });
  orphanItem.createSpan({ cls: 'hc-list-icon', text: '🟡' });
  orphanItem.createSpan({
    cls: 'hc-list-label',
    text: '孤立页面: 需要 /Library-lint 检测',
  });
}
