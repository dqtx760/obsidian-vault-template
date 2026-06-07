/**
 * Tab4: 发布看板
 * 展示已发布文章统计和 Wiki 状态
 */

import type { StatsData } from '../data/StatsCollector';

export function renderPublishBoard(
  container: HTMLElement,
  stats: StatsData
): void {
  container.empty();
  container.addClass('hc-tab-content');

  const grid = container.createDiv({ cls: 'hc-grid-2col' });

  // 左列: 发布统计 + 标签云
  const leftCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderPublishStats(leftCol, stats);
  renderTagCloud(leftCol, stats);

  // 右列: Wiki 状态
  const rightCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderWikiStatus(rightCol, stats);
}

/** 发布统计数据 */
function renderPublishStats(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '发布看板' });

  const grid = card.createDiv({ cls: 'hc-stat-grid' });

  const items = [
    { label: '总文章', value: stats.totalPosts, icon: '📊' },
    { label: '本周发布', value: stats.publishedWeek, icon: '✅' },
    { label: '草稿', value: stats.drafts, icon: '📝' },
    { label: '分类数', value: Object.keys(stats.categoryBreakdown).length, icon: '📁' },
  ];

  for (const item of items) {
    const cell = grid.createDiv({ cls: 'hc-stat-cell' });
    cell.createSpan({ cls: 'hc-stat-cell-icon', text: item.icon });
    cell.createSpan({ cls: 'hc-stat-cell-value', text: String(item.value) });
    cell.createSpan({ cls: 'hc-stat-cell-label', text: item.label });
  }
}

/** 标签云 */
function renderTagCloud(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '标签热度' });

  const cloud = card.createDiv({ cls: 'hc-tag-cloud' });

  // 按使用次数排序
  const sortedTags = Object.entries(stats.tagBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const maxCount = sortedTags.length > 0 ? sortedTags[0][1] : 1;

  for (const [tag, count] of sortedTags) {
    const size = 0.75 + (count / maxCount) * 0.75; // 0.75rem ~ 1.5rem

    const tagEl = cloud.createSpan({
      cls: 'hc-cloud-tag',
      text: `#${tag}`,
    });
    tagEl.style.fontSize = `${size}rem`;
    tagEl.style.opacity = String(0.5 + (count / maxCount) * 0.5);
  }
}

/** Wiki 状态 */
function renderWikiStatus(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: 'Wiki 健康度' });

  const list = card.createDiv({ cls: 'hc-card-list' });

  // Wiki 页面数
  const wikiItem = list.createDiv({ cls: 'hc-list-item' });
  wikiItem.createSpan({ cls: 'hc-list-icon', text: '🌐' });
  wikiItem.createSpan({
    cls: 'hc-list-label',
    text: `Wiki 页面: ${stats.totalPosts}`,
  });

  // 死链
  const deadItem = list.createDiv({ cls: 'hc-list-item' });
  deadItem.createSpan({
    cls: 'hc-list-icon',
    text: stats.deadLinks > 0 ? '🔴' : '🟢',
  });
  deadItem.createSpan({
    cls: 'hc-list-label',
    text: `死链: ${stats.deadLinks} 处`,
  });

  // 数据一致性
  const consistencyItem = list.createDiv({ cls: 'hc-list-item' });
  consistencyItem.createSpan({ cls: 'hc-list-icon', text: '📋' });
  consistencyItem.createSpan({
    cls: 'hc-list-label',
    text: '同步状态: 需要 /up-blog-Wiki 检测',
  });

  // 死链详情提示
  if (stats.deadLinks > 0) {
    const alert = card.createDiv({ cls: 'hc-alert hc-alert-warning' });
    alert.createSpan({ cls: 'hc-alert-icon', text: '⚠️' });
    alert.createSpan({
      cls: 'hc-alert-text',
      text: `发现 ${stats.deadLinks} 个死链，点击「Wiki同步」修复`,
    });
  }
}
