/**
 * Skill 按钮栏 — 分组 + 分隔线
 */

import { SKILLS, GROUP_LABELS, type SkillGroup } from '../skills/SkillRegistry';
import { SkillRunner } from '../skills/SkillRunner';
import type { App } from 'obsidian';

const GROUP_ORDER: SkillGroup[] = ['new', 'write', 'design', 'query', 'organize'];
let runner: SkillRunner;

export function renderSkillBar(container: HTMLElement, app: App): void {
  if (!runner) runner = new SkillRunner(app);
  container.empty();
  container.addClass('hc-skill-bar');

  for (let i = 0; i < GROUP_ORDER.length; i++) {
    const group = GROUP_ORDER[i];
    const skills = SKILLS.filter((s) => s.group === group);
    if (skills.length === 0) continue;

    const row = container.createDiv({ cls: 'hc-skill-row' });

    // 分隔线（非第一组前面加）
    if (i > 0) {
      row.createEl('div', { cls: 'hc-skill-separator' });
    }

    // 分组标签
    row.createSpan({ cls: 'hc-skill-group-label', text: GROUP_LABELS[group] });

    for (const skill of skills) {
      const btn = row.createEl('button', {
        cls: 'hc-skill-btn',
        attr: {
          'data-skill-id': skill.id,
          'aria-label': skill.description,
        },
      });

      btn.createSpan({ cls: 'hc-skill-icon', text: skill.icon });
      btn.createSpan({ cls: 'hc-skill-name', text: skill.name });
      btn.title = `${skill.name}: ${skill.description}\n命令: ${skill.command}`;

      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        btn.addClass('hc-skill-active');
        await runner.run(skill);
        setTimeout(() => btn.removeClass('hc-skill-active'), 300);
      });
    }
  }
}
