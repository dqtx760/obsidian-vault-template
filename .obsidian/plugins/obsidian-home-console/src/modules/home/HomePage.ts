/**
 * 首页仪表盘容器 — Banner 风格布局
 */

import type { App } from 'obsidian';
import { StatsCollector, StatsData } from '../../data/StatsCollector';
import { renderPipeline } from './Pipeline';
import { renderTaskBoard } from './TaskBoard';
import { renderSourceChart } from './SourceChart';
import { renderRecentInputs } from './RecentInputs';
import { FocusTimer } from './FocusTimer';
import { renderCalendar } from './Calendar';
import { SkillRunner } from '../../skills/SkillRunner';
import { SKILLS } from '../../skills/SkillRegistry';

export class HomePage {
  private container: HTMLElement;
  private app: App;
  private collector: StatsCollector;
  private focusTimer: FocusTimer;
  private stats: StatsData | null = null;

  constructor(container: HTMLElement, app: App) {
    this.container = container;
    this.app = app;
    this.collector = new StatsCollector(app.vault, app.metadataCache);
    this.focusTimer = new FocusTimer(app.vault);
  }

  async render(): Promise<void> {
    this.container.empty();
    this.container.addClass('hc-home-page');

    // 收集数据
    this.stats = await this.collector.collect();

    // ===== Hero Banner =====
    const hero = this.container.createDiv({ cls: 'hc-hero' });

    // 左侧内容
    const heroLeft = hero.createDiv({ cls: 'hc-hero-left' });

    heroLeft.createDiv({ cls: 'hc-hero-tag', text: 'OBSIDIAN · 今日工作台' });

    // 时间感知问候（一行）
    const hour = new Date().getHours();
    let greetText = '晚上好';
    if (hour >= 5 && hour < 12) greetText = '早上好';
    else if (hour >= 12 && hour < 14) greetText = '中午好';
    else if (hour >= 14 && hour < 18) greetText = '下午好';

    heroLeft.createEl('h1', {
      text: `${greetText}！大强同学 🪐`,
      cls: 'hc-hero-title',
    });

    // 副标题（一行）
    heroLeft.createDiv({
      cls: 'hc-hero-subtitle',
      text: '最好的工作是终身学习者在自由市场中的创造性表达。',
    });

    // 快捷按钮
    const btnRow = heroLeft.createDiv({ cls: 'hc-hero-btns' });
    const runner = new SkillRunner(this.app);

    const quickBtns = [
      { label: '📅 写日记', skillId: 'daily-log' },
      { label: '📝 记笔记', skillId: 'new-note' },
      { label: '🔍 查知识库', skillId: 'query' },
    ];

    for (const btnDef of quickBtns) {
      const btn = btnRow.createEl('button', {
        cls: 'hc-hero-btn',
        text: btnDef.label,
      });
      btn.addEventListener('click', () => {
        const skill = SKILLS.find(s => s.id === btnDef.skillId);
        if (skill) runner.run(skill);
      });
    }

    // 中间：番茄计时器
    const heroCenter = hero.createDiv({ cls: 'hc-hero-center' });
    this.focusTimer.render(heroCenter);

    // 右侧：日历
    const heroRight = hero.createDiv({ cls: 'hc-hero-right' });
    renderCalendar(heroRight, this.app);

    // ===== 流水线 =====
    const pipelineSection = this.container.createDiv({ cls: 'hc-section' });
    const pipelineContent = pipelineSection.createDiv({ cls: 'hc-section-content' });
    renderPipeline(pipelineContent, this.app);

    // ===== 最新输入 + 最新输出 =====
    const contentRow = this.container.createDiv({ cls: 'hc-home-mid-row' });

    // 左侧：最新输入 + 来源分布
    const leftCol = contentRow.createDiv({ cls: 'hc-home-col-stack' });

    const recentPanel = leftCol.createDiv({ cls: 'hc-home-col' });
    const recentHeader = recentPanel.createDiv({ cls: 'hc-panel-header' });
    recentHeader.createSpan({ cls: 'hc-panel-title', text: '最新输入' });
    renderRecentInputs(recentPanel, this.app.vault);

    const sourcePanel = leftCol.createDiv({ cls: 'hc-home-col' });
    renderSourceChart(sourcePanel, this.app.vault);

    // 右侧：最新输出
    const taskCol = contentRow.createDiv({ cls: 'hc-home-col' });
    await renderTaskBoard(taskCol, this.app.vault);
  }

  destroy(): void {
    this.focusTimer.destroy();
  }
}
