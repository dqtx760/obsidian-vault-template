/**
 * Tab1: 输入池
 * 展示 01-输入/ 下的收件箱状态
 */

import { TFile } from 'obsidian';
import type { StatsCollector, StatsData } from '../data/StatsCollector';
import { INBOX_FOLDERS } from '../utils/PathConstants';
import { relativeTime } from '../utils/DateUtils';

const FOLDER_LABELS: Record<string, string> = {
  '01-输入/01-Clipings': '网页剪藏',
  '01-输入/02-get笔记': 'Get笔记',
  '01-输入/03-微信': '微信收藏',
  '01-输入/04-选题': '选题素材',
  '01-输入/05-口喷稿': '口喷稿',
  '01-输入/06-微信读书': '微信读书',
};

export function renderInputPool(
  container: HTMLElement,
  stats: StatsData,
  collector: StatsCollector
): void {
  container.empty();
  container.addClass('hc-tab-content');

  // 两列布局
  const grid = container.createDiv({ cls: 'hc-grid-2col' });

  // ===== 左列: 收件箱列表 =====
  const leftCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderInboxSummary(leftCol, stats);

  // ===== 右列: 来源统计 + 最新输入 =====
  const rightCol = grid.createDiv({ cls: 'hc-grid-col' });
  renderInputSources(rightCol, stats);
  renderLatestInputs(rightCol, collector);
}

/** 收件箱概览 */
function renderInboxSummary(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  // 卡片头部
  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '收件箱待处理' });
  header.createSpan({
    cls: 'hc-card-badge',
    text: String(stats.inbox),
  });

  // 各目录条目
  const list = card.createDiv({ cls: 'hc-card-list' });

  for (const folder of INBOX_FOLDERS) {
    const count = stats.inboxBreakdown[folder] || 0;
    const label = FOLDER_LABELS[folder] || folder.split('/').pop() || folder;

    const item = list.createDiv({ cls: 'hc-list-item' });
    item.createSpan({ cls: 'hc-list-icon', text: '📎' });
    item.createSpan({ cls: 'hc-list-label', text: label });
    item.createSpan({ cls: 'hc-list-count', text: String(count) });

    // 进度条
    const bar = item.createDiv({ cls: 'hc-mini-bar' });
    const fill = bar.createDiv({ cls: 'hc-mini-bar-fill' });
    const pct = stats.inbox > 0 ? (count / stats.inbox) * 100 : 0;
    fill.style.width = `${pct}%`;
  }
}

/** 输入来源统计 */
function renderInputSources(container: HTMLElement, stats: StatsData): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '来源分布' });

  const bars = card.createDiv({ cls: 'hc-card-bars' });

  for (const [folder, count] of Object.entries(stats.inboxBreakdown)) {
    const label = FOLDER_LABELS[folder] || folder.split('/').pop() || folder;
    const maxCount = Math.max(...Object.values(stats.inboxBreakdown), 1);
    const pct = (count / maxCount) * 100;

    const row = bars.createDiv({ cls: 'hc-bar-row' });
    row.createSpan({ cls: 'hc-bar-label', text: label });

    const barTrack = row.createDiv({ cls: 'hc-bar-track' });
    const barFill = barTrack.createDiv({ cls: 'hc-bar-fill' });
    barFill.style.width = `${pct}%`;

    row.createSpan({ cls: 'hc-bar-value', text: String(count) });
  }
}

/** 最新输入列表 */
function renderLatestInputs(container: HTMLElement, collector: StatsCollector): void {
  const card = container.createDiv({ cls: 'hc-card' });

  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: '最新输入' });

  const files = collector.getLatestInputFiles(8);
  const list = card.createDiv({ cls: 'hc-card-list' });

  for (const file of files) {
    const item = list.createDiv({ cls: 'hc-list-item hc-list-file' });

    // 文件名（不含路径）
    const name = file.path.split('/').pop()?.replace('.md', '') || file.name;
    item.createSpan({ cls: 'hc-list-label', text: name });

    // 时间
    item.createSpan({
      cls: 'hc-list-time',
      text: relativeTime(new Date(file.stat.mtime)),
    });

    // 点击打开文件
    item.addEventListener('click', () => {
      const event = new CustomEvent('hc:open-file', { detail: file.path });
      document.dispatchEvent(event);
    });
    item.addClass('hc-clickable');
  }
}
