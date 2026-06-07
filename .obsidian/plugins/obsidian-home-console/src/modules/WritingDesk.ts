/**
 * Tab3: 博客文章
 * 左列: 文章统计 | 右列: 最近笔记 + Xenia/Yoke/Zen 文件列表
 */

import type { StatsData, StatsCollector } from '../data/StatsCollector';
import { relativeTime } from '../utils/DateUtils';

export function renderBlogPosts(
  container: HTMLElement,
  stats: StatsData,
  collector: StatsCollector
): void {
  container.empty();
  container.addClass('hc-tab-content');

  const grid = container.createDiv({ cls: 'hc-grid-2col' });

  // 左列: 分类分布 + 文章概况
  const leftCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderCategoryStats(leftCol, stats);
  renderOverview(leftCol, stats);

  // 右列: 最近笔记
  const rightCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderRecentPosts(rightCol, collector);
}

/** 最近创建的笔记（带搜索过滤） */
function renderRecentPosts(container: HTMLElement, collector: StatsCollector): void {
  const card = container.createDiv({ cls: 'hc-card' });

  // 搜索框
  const searchRow = card.createDiv({ cls: 'hc-search-row' });
  searchRow.createSpan({ cls: 'hc-search-icon', text: '🔍' });
  const searchInput = searchRow.createEl('input', {
    cls: 'hc-search-input',
    attr: { type: 'text', placeholder: '搜索文章...' },
  });

  const allFiles = collector.getRecentPosts(30);
  const list = card.createDiv({ cls: 'hc-card-list' });

  function renderList(filter: string) {
    list.empty();
    const q = filter.toLowerCase();
    const files = q
      ? allFiles.filter(f => {
          const meta = collector['metadataCache'].getFileCache(f);
          const title = (meta?.frontmatter?.title || f.name.replace('.md', '')).toLowerCase();
          const cat = (meta?.frontmatter?.category || '').toLowerCase();
          const tags = (meta?.frontmatter?.tags || []).join(' ').toLowerCase();
          return title.includes(q) || cat.includes(q) || tags.includes(q);
        })
      : allFiles;

    if (files.length === 0) {
      list.createDiv({ cls: 'hc-empty', text: '无匹配结果' });
      return;
    }

    for (const file of files) {
      const meta = collector['metadataCache'].getFileCache(file);
      const fm = meta?.frontmatter;
      const item = list.createDiv({ cls: 'hc-list-item hc-clickable' });
      item.createSpan({ cls: 'hc-list-icon', text: fm?.draft === true ? '📝' : '✅' });
      item.createSpan({ cls: 'hc-list-label', text: fm?.title || file.name.replace('.md', '') });
      if (fm?.category) {
        item.createSpan({ cls: `hc-tag hc-tag-cat-${fm.category.toLowerCase()}`, text: fm.category });
      }
      item.createSpan({ cls: 'hc-list-time', text: relativeTime(new Date(file.stat.ctime)) });
      item.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('hc:open-file', { detail: file.path }));
      });
    }
  }

  renderList('');
  searchInput.addEventListener('input', () => renderList(searchInput.value));
}

/** 分类统计 */
function renderCategoryStats(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });
  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '分类分布' });

  const bars = card.createDiv({ cls: 'hc-card-bars' });
  const maxCount = Math.max(...Object.values(stats.categoryBreakdown), 1);

  const colors: Record<string, string> = {
    AIHacks: '#4caf50',
    Software: '#2196f3',
    Technical: '#ff9800',
    Workflow: '#9c27b0',
  };

  for (const [cat, count] of Object.entries(stats.categoryBreakdown)) {
    const pct = (count / maxCount) * 100;
    const row = bars.createDiv({ cls: 'hc-bar-row' });
    row.createSpan({ cls: 'hc-bar-label', text: cat });
    const barTrack = row.createDiv({ cls: 'hc-bar-track' });
    const barFill = barTrack.createDiv({ cls: 'hc-bar-fill' });
    barFill.style.width = `${pct}%`;
    barFill.style.backgroundColor = colors[cat] || 'var(--console-accent)';
    row.createSpan({ cls: 'hc-bar-value', text: `${count}` });
  }

  if (Object.keys(stats.categoryBreakdown).length === 0) {
    card.createDiv({ cls: 'hc-empty', text: '暂无数据' });
  }
}

/** 文章概况 */
function renderOverview(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });
  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '文章概况' });

  const grid = card.createDiv({ cls: 'hc-stat-grid' });

  const items = [
    { label: '已发布', value: stats.totalPosts, icon: '📊' },
    { label: '草稿', value: stats.drafts, icon: '📝' },
    { label: '本周发布', value: stats.publishedWeek, icon: '✅' },
    { label: '标签', value: Object.keys(stats.tagBreakdown).length, icon: '🏷️' },
  ];

  for (const item of items) {
    const cell = grid.createDiv({ cls: 'hc-stat-cell' });
    cell.createSpan({ cls: 'hc-stat-cell-icon', text: item.icon });
    cell.createSpan({ cls: 'hc-stat-cell-value', text: String(item.value) });
    cell.createSpan({ cls: 'hc-stat-cell-label', text: item.label });
  }
}
