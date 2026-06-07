/**
 * 来源分布 — SVG 环形饼图
 */

import { Vault } from 'obsidian';

const SVG_NS = 'http://www.w3.org/2000/svg';

interface SourceItem {
  label: string;
  prefix: string;
  color: string;
}

const SOURCES: SourceItem[] = [
  { label: '微信收藏', prefix: '01-输入/03-微信/', color: '#22c55e' },
  { label: 'Get笔记', prefix: '01-输入/02-get笔记/', color: '#a78bfa' },
  { label: '网页剪藏', prefix: '01-输入/01-Clipings/', color: '#60a5fa' },
  { label: '其他来源', prefix: '01-输入/', color: '#94a3b8' },
];

function countFiles(vault: Vault, prefix: string): number {
  return vault.getMarkdownFiles().filter(f => f.path.startsWith(prefix)).length;
}

export function renderSourceChart(container: HTMLElement, vault: Vault): void {
  container.empty();
  container.addClass('hc-source-chart');

  // 标题
  container.createDiv({ cls: 'hc-chart-title', text: '来源分布' });

  // 统计各来源数量
  const counts = SOURCES.map(s => ({
    ...s,
    count: countFiles(vault, s.prefix),
  }));

  // "其他来源" 只统计不在前三个目录下的
  const specificTotal = counts[0].count + counts[1].count + counts[2].count;
  counts[3].count = Math.max(0, counts[3].count - specificTotal);

  const total = counts.reduce((sum, c) => sum + c.count, 0);

  // 图表容器
  const chartRow = container.createDiv({ cls: 'hc-chart-row' });

  // SVG 环形图
  const size = 140;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'hc-donut-svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

  // 背景圈
  const bgCircle = document.createElementNS(SVG_NS, 'circle');
  bgCircle.setAttribute('cx', String(size / 2));
  bgCircle.setAttribute('cy', String(size / 2));
  bgCircle.setAttribute('r', String(radius));
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', '#1e1e2e');
  bgCircle.setAttribute('stroke-width', String(strokeWidth));
  svg.appendChild(bgCircle);

  // 数据圈
  let offset = 0;
  for (const item of counts) {
    if (item.count === 0) continue;
    const pct = item.count / total;
    const dash = pct * circumference;
    const gap = circumference - dash;

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', String(size / 2));
    circle.setAttribute('cy', String(size / 2));
    circle.setAttribute('r', String(radius));
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', item.color);
    circle.setAttribute('stroke-width', String(strokeWidth));
    circle.setAttribute('stroke-dasharray', `${dash} ${gap}`);
    circle.setAttribute('stroke-dashoffset', String(-offset));
    circle.setAttribute('stroke-linecap', 'round');
    circle.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
    svg.appendChild(circle);

    offset += dash;
  }

  // 中心文字
  const centerText = document.createElementNS(SVG_NS, 'text');
  centerText.setAttribute('x', String(size / 2));
  centerText.setAttribute('y', String(size / 2 - 4));
  centerText.setAttribute('text-anchor', 'middle');
  centerText.setAttribute('dominant-baseline', 'middle');
  centerText.setAttribute('fill', '#ffffff');
  centerText.setAttribute('font-size', '22');
  centerText.setAttribute('font-weight', '700');
  centerText.textContent = String(total);
  svg.appendChild(centerText);

  const subText = document.createElementNS(SVG_NS, 'text');
  subText.setAttribute('x', String(size / 2));
  subText.setAttribute('y', String(size / 2 + 14));
  subText.setAttribute('text-anchor', 'middle');
  subText.setAttribute('dominant-baseline', 'middle');
  subText.setAttribute('fill', '#9ca3af');
  subText.setAttribute('font-size', '10');
  subText.textContent = '本周新增';
  svg.appendChild(subText);

  chartRow.appendChild(svg);

  // 图例
  const legend = chartRow.createDiv({ cls: 'hc-chart-legend' });
  for (const item of counts) {
    if (item.count === 0) continue;
    const pct = Math.round((item.count / total) * 100);
    const row = legend.createDiv({ cls: 'hc-legend-item' });
    row.createDiv({ cls: 'hc-legend-dot', attr: { style: `background: ${item.color};` } });
    row.createSpan({ cls: 'hc-legend-label', text: item.label });
    row.createSpan({ cls: 'hc-legend-value', text: `${item.count} (${pct}%)` });
  }
}
