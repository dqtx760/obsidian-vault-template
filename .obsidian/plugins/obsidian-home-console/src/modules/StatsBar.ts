/**
 * 顶部统计栏模块
 * 显示内容系统的核心指标
 */

import type { StatsData } from '../data/StatsCollector';

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  tabId?: string;  // 点击跳转的 Tab
}

export function renderStatsBar(container: HTMLElement, stats: StatsData): void {
  container.empty();
  container.addClass('hc-stats-bar');

  const items: StatItem[] = [
    {
      label: '收件箱',
      value: stats.inbox,
      icon: '📥',
      color: 'var(--console-success)',
      tabId: 'input-pool',
    },
    {
      label: '草稿',
      value: stats.drafts,
      icon: '📝',
      color: 'var(--console-warning)',
      tabId: 'writing',
    },
    {
      label: '本周发布',
      value: stats.publishedWeek,
      icon: '✅',
      color: 'var(--console-accent)',
      tabId: 'publish',
    },
    {
      label: 'Library',
      value: stats.libraryPages,
      icon: '📚',
      color: '#7c6ef0',
      tabId: 'library',
    },
    {
      label: '死链',
      value: stats.deadLinks,
      icon: '🔗',
      color: stats.deadLinks > 0 ? 'var(--console-danger)' : 'var(--console-success)',
      tabId: 'publish',
    },
  ];

  for (const item of items) {
    const card = container.createDiv({ cls: 'hc-stat-card' });
    card.createSpan({ cls: 'hc-stat-icon', text: item.icon });
    card.createSpan({
      cls: 'hc-stat-value',
      text: String(item.value),
    });
    card.createSpan({ cls: 'hc-stat-label', text: item.label });

    // 左侧彩色条
    card.style.setProperty('--stat-color', item.color);

    // 点击跳转到对应 Tab
    if (item.tabId) {
      card.addEventListener('click', () => {
        const event = new CustomEvent('hc:switch-tab', { detail: item.tabId });
        document.dispatchEvent(event);
      });
      card.addClass('hc-clickable');
    }
  }
}
