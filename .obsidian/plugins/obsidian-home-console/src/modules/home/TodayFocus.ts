/**
 * 今日聚焦 — 6 张统计卡片（带趋势）
 */

import type { StatsData } from '../../data/StatsCollector';
import { moment } from 'obsidian';

interface StatCardDef {
  icon: string;
  label: string;
  value: (s: StatsData) => number;
  trendText: (s: StatsData) => string;
  trendDir: 'up' | 'down' | 'flat';
  color: string;
}

const CARDS: StatCardDef[] = [
  {
    icon: '📝',
    label: '待写文章',
    value: (s) => s.drafts,
    trendText: () => '较昨日 —',
    trendDir: 'flat',
    color: '#6366f1',
  },
  {
    icon: '📤',
    label: '待发布文章',
    value: (s) => s.drafts,
    trendText: () => '较昨日 —',
    trendDir: 'flat',
    color: '#8b5cf6',
  },
  {
    icon: '📥',
    label: '待整理素材',
    value: (s) => s.inbox,
    trendText: (s) => `共 ${s.inbox} 项`,
    trendDir: 'flat',
    color: '#10b981',
  },
  {
    icon: '📦',
    label: '本周发布',
    value: (s) => s.publishedWeek,
    trendText: (s) => `共 ${s.totalPosts} 篇`,
    trendDir: 'up',
    color: '#f59e0b',
  },
  {
    icon: '📊',
    label: '文章总数',
    value: (s) => s.totalPosts,
    trendText: (s) => `${s.categoryBreakdown['AIHacks'] || 0} AI / ${s.categoryBreakdown['Technical'] || 0} Tech`,
    trendDir: 'up',
    color: '#ec4899',
  },
  {
    icon: '📚',
    label: '知识库页面',
    value: (s) => s.libraryPages,
    trendText: (s) => `${s.deadLinks} 死链`,
    trendDir: 'flat',
    color: '#3b82f6',
  },
];

export function renderTodayFocus(container: HTMLElement, stats: StatsData): void {
  container.empty();
  container.addClass('hc-today-focus');

  // 卡片网格
  const grid = container.createDiv({ cls: 'hc-stat-cards' });

  for (const card of CARDS) {
    const cardEl = grid.createDiv({ cls: 'hc-stat-card' });

    // 顶部：标签 + 图标
    const top = cardEl.createDiv({ cls: 'hc-stat-card-top' });
    top.createSpan({ cls: 'hc-stat-card-label', text: card.label });

    const iconWrap = top.createDiv({
      cls: 'hc-stat-card-icon',
      attr: { style: `background: ${card.color}20; color: ${card.color};` },
    });
    iconWrap.createSpan({ text: card.icon });

    // 数字
    const val = card.value(stats);
    cardEl.createDiv({
      cls: 'hc-stat-card-value',
      text: String(val),
      attr: { style: `color: ${card.color};` },
    });

    // 趋势
    const trendText = card.trendText(stats);
    const trendEl = cardEl.createDiv({ cls: `hc-stat-card-trend hc-trend-${card.trendDir}` });
    trendEl.createSpan({ text: trendText });
  }
}
