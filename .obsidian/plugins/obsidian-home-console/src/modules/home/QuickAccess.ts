/**
 * 快捷入口 — 常用功能快捷按钮
 */

import type { App } from 'obsidian';
import { SkillRunner } from '../../skills/SkillRunner';
import { SKILLS } from '../../skills/SkillRegistry';

interface QuickItem {
  icon: string;
  label: string;
  skillId?: string;
  command?: string;
}

const QUICK_ITEMS: QuickItem[] = [
  { icon: '📄', label: '常用模板', skillId: 'new-note' },
  { icon: '💡', label: '写作灵感库', skillId: 'topic-gen' },
  { icon: '🏷️', label: '爆款标题库', skillId: 'title' },
  { icon: '📅', label: '内容日历', skillId: 'daily-log' },
  { icon: '📊', label: '数据看板' },
  { icon: '🔍', label: '灵感记录', skillId: 'query' },
];

export function renderQuickAccess(container: HTMLElement, app: App): void {
  container.empty();
  container.addClass('hc-quick-access');

  const runner = new SkillRunner(app);

  // 标题
  container.createDiv({ cls: 'hc-panel-title', text: '快捷入口' });

  // 按钮网格
  const grid = container.createDiv({ cls: 'hc-quick-grid' });

  for (const item of QUICK_ITEMS) {
    const btn = grid.createEl('button', { cls: 'hc-quick-btn' });
    btn.createSpan({ cls: 'hc-quick-icon', text: item.icon });
    btn.createSpan({ text: item.label });

    btn.addEventListener('click', () => {
      if (item.skillId) {
        const skill = SKILLS.find(s => s.id === item.skillId);
        if (skill) runner.run(skill);
      }
    });
  }
}
