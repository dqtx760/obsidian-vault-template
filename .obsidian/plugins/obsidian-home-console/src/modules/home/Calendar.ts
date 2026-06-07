/**
 * 日历组件 — 月视图，点击日期创建日记
 */

import { moment, App, Notice } from 'obsidian';

export function renderCalendar(container: HTMLElement, app?: App): void {
  container.empty();
  container.addClass('hc-calendar');

  const now = moment();
  const year = now.year();
  const month = now.month(); // 0-indexed
  const today = now.date();

  // 标题行
  const header = container.createDiv({ cls: 'hc-cal-header' });
  header.createSpan({ cls: 'hc-cal-title', text: `${year}年${month + 1}月` });

  // 星期行（周一起始）
  const weekRow = container.createDiv({ cls: 'hc-cal-week' });
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
  for (const day of weekDays) {
    weekRow.createSpan({ cls: 'hc-cal-weekday', text: day });
  }

  // 日期网格
  const grid = container.createDiv({ cls: 'hc-cal-grid' });

  // 获取本月第一天是星期几（0=周日，转换为周一起始）
  const firstDayRaw = moment(`${year}-${String(month + 1).padStart(2, '0')}-01`).day();
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // 周日=6，周一=0
  const daysInMonth = moment(`${year}-${String(month + 1).padStart(2, '0')}-01`).daysInMonth();

  // 上月补位
  const prevMonthDays = moment(`${year}-${String(month + 1).padStart(2, '0')}-01`).subtract(1, 'months').daysInMonth();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    grid.createDiv({ cls: 'hc-cal-day hc-cal-other', text: String(day) });
  }

  // 本月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEl = grid.createDiv({
      cls: `hc-cal-day${isToday ? ' hc-cal-today' : ''}`,
      text: String(day),
    });

    // 点击创建日记
    if (app) {
      dayEl.addEventListener('click', () => {
        createDailyNoteForDate(app, dateStr);
      });
    }
  }

  // 下月补位
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    grid.createDiv({ cls: 'hc-cal-day hc-cal-other', text: String(i) });
  }
}

async function createDailyNoteForDate(app: App, dateStr: string): Promise<void> {
  const folder = '01-输入/07-Daily';
  const filePath = `${folder}/${dateStr}.md`;

  // 检查是否已存在
  const existing = app.vault.getAbstractFileByPath(filePath);
  if (existing) {
    await app.workspace.openLinkText(filePath, '', false);
    new Notice(`📅 ${dateStr} 日记已打开`);
    return;
  }

  // 读取模板
  const templatePath = '01-输入/Template/日记模板.md';
  let content = '';

  try {
    const templateFile = app.vault.getAbstractFileByPath(templatePath);
    if (templateFile && 'stat' in templateFile) {
      content = await app.vault.read(templateFile as any);
      const m = moment(dateStr);
      content = content.replace(/\{\{date\}\}/g, dateStr);
      content = content.replace(/\{\{YYYY\}\}/g, m.format('YYYY'));
      content = content.replace(/\{\{MM\}\}/g, m.format('MM'));
      content = content.replace(/\{\{DD\}\}/g, m.format('DD'));
      content = content.replace(/\{\{weekday\}\}/g, m.format('dddd'));
    }
  } catch {
    // 模板不存在，使用默认
  }

  if (!content) {
    content = `---
title: ${dateStr} 日记
published: ${dateStr}
tags:
  - daily
category: Daily
draft: false
---

### 今日要事

- [ ]

### 今日记录

### 明日计划
`;
  }

  try {
    await app.vault.create(filePath, content);
    await app.workspace.openLinkText(filePath, '', false);
    new Notice(`📅 ${dateStr} 日记已创建`);
  } catch (err) {
    new Notice(`❌ 创建日记失败: ${err}`);
  }
}
