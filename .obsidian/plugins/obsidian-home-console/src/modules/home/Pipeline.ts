/**
 * 流水线 — 4 步内容生产流程可视化
 */

import type { App } from 'obsidian';
import { SkillRunner } from '../../skills/SkillRunner';
import { SKILLS } from '../../skills/SkillRegistry';

interface PipelineStep {
  num: number;
  title: string;
  subtitle: string;
  color: string;
  /** 主按钮（高亮大按钮），可选 */
  mainButton?: { label: string; skillId: string };
  /** 次要按钮 */
  buttons: { label: string; skillId: string }[];
  moreText?: string;
}

const STEPS: PipelineStep[] = [
  {
    num: 1,
    title: 'AI 工作台',
    subtitle: '从选题到成稿的智能创作',
    color: '#8b5cf6',
    buttons: [
      { label: '🔥 查热点', skillId: 'hotspot' },
      { label: '💡 选题', skillId: 'topic-gen' },
      { label: '📝 文章', skillId: 'write' },
      { label: '📖 写教程', skillId: 'tutorial' },
      { label: '🎯 引流文案', skillId: 'traffic' },
      { label: '🤖 去AI味', skillId: 'humanize' },
    ],
  },
  {
    num: 2,
    title: '输出与发布',
    subtitle: '多平台适配与一键分发',
    color: '#10b981',
    buttons: [
      { label: '🏷️ 标题撰写', skillId: 'title' },
      { label: '🖼️ 封面制作', skillId: 'cover' },
      { label: '📸 文章配图', skillId: 'illustrate' },
      { label: '✂️ 转短文案', skillId: 'x-post' },
      { label: '📕 转小红书', skillId: 'rednote' },
      { label: '📊 转PPT', skillId: 'ppt' },
    ],
  },
  {
    num: 3,
    title: '知识整理',
    subtitle: '素材编译与知识库同步',
    color: '#3b82f6',
    buttons: [
      { label: '📥 Library编译', skillId: 'ingest' },
      { label: '🌐 Wiki编译', skillId: 'wiki-sync' },
      { label: '__BREAK__', skillId: '' },
      { label: '📋 index编译', skillId: 'index-sync' },
      { label: '🔄 全量同步', skillId: 'full-sync' },
    ],
  },
];

export function renderPipeline(container: HTMLElement, app: App): void {
  container.empty();
  container.addClass('hc-pipeline');

  const runner = new SkillRunner(app);

  const stepsRow = container.createDiv({ cls: 'hc-pipeline-steps' });

  for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];

    // 步骤卡片
    const card = stepsRow.createDiv({ cls: 'hc-pipeline-card' });

    // 标题行
    const header = card.createDiv({ cls: 'hc-pipeline-header' });
    header.createDiv({
      cls: 'hc-pipeline-num',
      text: `${step.num}. ${step.title}`,
      attr: { style: `color: ${step.color};` },
    });
    card.createDiv({ cls: 'hc-pipeline-subtitle', text: step.subtitle });

    // 按钮区
    const btnArea = card.createDiv({ cls: 'hc-pipeline-btns' });

    // 主按钮（如果有）
    if (step.mainButton) {
      const mainBtn = btnArea.createEl('button', {
        cls: 'hc-pipeline-main-btn',
        text: step.mainButton.label,
        attr: { style: `background: ${step.color}20; color: ${step.color}; border: 1px solid ${step.color}40;` },
      });
      mainBtn.addEventListener('click', () => {
        const skill = SKILLS.find(s => s.id === step.mainButton!.skillId);
        if (skill) runner.run(skill);
      });
    }

    // 次要按钮
    for (const btnDef of step.buttons) {
      // 换行标记
      if (btnDef.label === '__BREAK__') {
        btnArea.createDiv({ cls: 'hc-pipeline-break' });
        continue;
      }
      const btn = btnArea.createEl('button', {
        cls: 'hc-pipeline-sub-btn',
        text: btnDef.label,
      });
      btn.addEventListener('click', () => {
        const skill = SKILLS.find(s => s.id === btnDef.skillId);
        if (skill) runner.run(skill);
      });
    }

    // 更多按钮
    if (step.moreText) {
      btnArea.createEl('button', { cls: 'hc-pipeline-more', text: step.moreText });
    }

    // 箭头（非最后一个）
    if (i < STEPS.length - 1) {
      stepsRow.createDiv({ cls: 'hc-pipeline-arrow', text: '→' });
    }
  }
}
