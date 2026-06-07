/**
 * 番茄计时器 — 简洁版
 * idle → 点击开始 → running → 暂停/放弃
 * 点击时间 → 选择时长
 */

import { Vault } from 'obsidian';

const DATA_FILE = '.obsidian/plugins/obsidian-home-console/data.json';
const SVG_NS = 'http://www.w3.org/2000/svg';
const DURATION_OPTIONS = [15, 25, 40, 60];

interface FocusRecord { date: string; time: string; minutes: number; }
interface FocusData { totalMinutes: number; dailyHistory: Record<string, number>; records: FocusRecord[]; }

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
async function loadData(vault: Vault): Promise<FocusData> {
  try {
    const raw = await vault.adapter.read(DATA_FILE);
    const data = JSON.parse(raw) as FocusData;
    return { totalMinutes: data?.totalMinutes || 0, dailyHistory: data?.dailyHistory || {}, records: data?.records || [] };
  } catch { return { totalMinutes: 0, dailyHistory: {}, records: [] }; }
}
async function saveData(vault: Vault, data: FocusData): Promise<void> {
  await vault.adapter.write(DATA_FILE, JSON.stringify(data, null, 2));
}

type TimerState = 'idle' | 'running' | 'paused';

export class FocusTimer {
  private container: HTMLElement | null = null;
  private vault: Vault;
  private data: FocusData;
  private state: TimerState = 'idle';
  private intervalId: number | null = null;
  private duration = 25 * 60;
  private remaining = 25 * 60;

  private timerWrap: HTMLElement | null = null;
  private timeDisplayEl: HTMLElement | null = null;
  private progressCircle: SVGCircleElement | null = null;
  private pickerEl: HTMLElement | null = null;
  private controlsEl: HTMLElement | null = null;
  private summaryEl: HTMLElement | null = null;

  private svgSize = 140;
  private strokeWidth = 5;
  private radius = 65;

  constructor(vault: Vault) {
    this.vault = vault;
    this.data = { totalMinutes: 0, dailyHistory: {}, records: [] };
    loadData(vault).then(d => { this.data = d; this.updateSummary(); });
  }

  render(container: HTMLElement): void {
    this.container = container;
    container.empty();
    container.addClass('hc-focus-timer');

    // 圆形计时器
    this.timerWrap = container.createDiv({ cls: 'hc-timer-circle' });

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', String(this.svgSize));
    svg.setAttribute('height', String(this.svgSize));
    svg.setAttribute('viewBox', `0 0 ${this.svgSize} ${this.svgSize}`);
    svg.classList.add('hc-timer-svg');

    // 背景圈
    const bg = document.createElementNS(SVG_NS, 'circle');
    bg.setAttribute('cx', '50%'); bg.setAttribute('cy', '50%');
    bg.setAttribute('r', String(this.radius));
    bg.setAttribute('fill', 'none');
    bg.setAttribute('stroke', 'rgba(255,255,255,0.08)');
    bg.setAttribute('stroke-width', String(this.strokeWidth));
    svg.appendChild(bg);

    // 进度圈
    const circ = 2 * Math.PI * this.radius;
    this.progressCircle = document.createElementNS(SVG_NS, 'circle');
    this.progressCircle.setAttribute('cx', '50%'); this.progressCircle.setAttribute('cy', '50%');
    this.progressCircle.setAttribute('r', String(this.radius));
    this.progressCircle.setAttribute('fill', 'none');
    this.progressCircle.setAttribute('stroke', '#a78bfa');
    this.progressCircle.setAttribute('stroke-width', String(this.strokeWidth));
    this.progressCircle.setAttribute('stroke-linecap', 'round');
    this.progressCircle.setAttribute('stroke-dasharray', String(circ));
    this.progressCircle.setAttribute('stroke-dashoffset', '0');
    this.progressCircle.setAttribute('transform', `rotate(-90 ${this.svgSize / 2} ${this.svgSize / 2})`);
    this.progressCircle.classList.add('hc-timer-progress');
    svg.appendChild(this.progressCircle);

    this.timerWrap.appendChild(svg);

    // 时间显示（点击弹出时长选择）
    this.timeDisplayEl = this.timerWrap.createDiv({ cls: 'hc-timer-time' });
    this.renderTimeDisplay();
    this.timeDisplayEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.state === 'idle') this.togglePicker();
    });

    // 时长选择器
    this.pickerEl = this.timerWrap.createDiv({ cls: 'hc-timer-picker' });
    this.renderPicker();

    // 控制按钮
    this.controlsEl = container.createDiv({ cls: 'hc-timer-controls' });
    this.renderControls();

    // 统计
    this.summaryEl = container.createDiv({ cls: 'hc-timer-summary' });
    this.updateSummary();
  }

  // ===== 渲染 =====

  private renderTimeDisplay(): void {
    if (!this.timeDisplayEl) return;
    const min = Math.floor(this.remaining / 60);
    const sec = this.remaining % 60;
    this.timeDisplayEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  private renderPicker(): void {
    if (!this.pickerEl) return;
    this.pickerEl.empty();

    const grid = this.pickerEl.createDiv({ cls: 'hc-picker-grid' });
    for (const min of DURATION_OPTIONS) {
      const btn = grid.createEl('button', {
        cls: `hc-picker-opt${min === this.duration / 60 ? ' hc-picker-active' : ''}`,
        text: `${min}`,
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setDuration(min);
      });
    }
  }

  private renderControls(): void {
    if (!this.controlsEl) return;
    this.controlsEl.empty();

    if (this.state === 'idle') {
      const btn = this.controlsEl.createEl('button', { cls: 'hc-ctrl-start', text: '▶ 开始' });
      btn.addEventListener('click', () => this.start());
    } else if (this.state === 'running') {
      const row = this.controlsEl.createDiv({ cls: 'hc-ctrl-row' });
      const pauseBtn = row.createEl('button', { cls: 'hc-ctrl-pause', text: '⏸ 暂停' });
      pauseBtn.addEventListener('click', () => this.pause());
      const stopBtn = row.createEl('button', { cls: 'hc-ctrl-stop', text: '⏹ 放弃' });
      stopBtn.addEventListener('click', () => this.reset());
    } else if (this.state === 'paused') {
      const row = this.controlsEl.createDiv({ cls: 'hc-ctrl-row' });
      const resumeBtn = row.createEl('button', { cls: 'hc-ctrl-start', text: '▶ 继续' });
      resumeBtn.addEventListener('click', () => this.start());
      const stopBtn = row.createEl('button', { cls: 'hc-ctrl-stop', text: '⏹ 放弃' });
      stopBtn.addEventListener('click', () => this.reset());
    }
  }

  private renderProgress(): void {
    if (!this.progressCircle) return;
    const circ = 2 * Math.PI * this.radius;
    const progress = 1 - (this.remaining / this.duration);
    this.progressCircle.setAttribute('stroke-dashoffset', String(circ * progress));
  }

  private updateSummary(): void {
    if (!this.summaryEl) return;
    this.summaryEl.empty();
    const count = this.data.records.filter(r => r.date === today()).length;
    this.summaryEl.createSpan({ cls: 'hc-timer-summary-text', text: `今日 ${count} 个番茄` });
  }

  // ===== 操作 =====

  private togglePicker(): void {
    if (!this.pickerEl) return;
    const visible = this.pickerEl.classList.contains('hc-picker-visible');
    if (visible) {
      this.pickerEl.classList.remove('hc-picker-visible');
    } else {
      this.renderPicker();
      this.pickerEl.classList.add('hc-picker-visible');
    }
  }

  private setDuration(minutes: number): void {
    this.duration = minutes * 60;
    this.remaining = this.duration;
    this.renderTimeDisplay();
    this.renderProgress();
    if (this.pickerEl) this.pickerEl.classList.remove('hc-picker-visible');
  }

  private start(): void {
    this.state = 'running';
    if (this.pickerEl) this.pickerEl.classList.remove('hc-picker-visible');
    this.renderControls();
    this.intervalId = window.setInterval(() => {
      this.remaining--;
      this.renderTimeDisplay();
      this.renderProgress();
      if (this.remaining <= 0) this.complete();
    }, 1000);
  }

  private pause(): void {
    this.state = 'paused';
    if (this.intervalId) { window.clearInterval(this.intervalId); this.intervalId = null; }
    this.renderControls();
  }

  private reset(): void {
    this.state = 'idle';
    if (this.intervalId) { window.clearInterval(this.intervalId); this.intervalId = null; }
    this.remaining = this.duration;
    this.renderTimeDisplay();
    this.renderProgress();
    this.renderControls();
  }

  private complete(): void {
    this.state = 'idle';
    if (this.intervalId) { window.clearInterval(this.intervalId); this.intervalId = null; }
    const minutes = Math.round(this.duration / 60);
    this.data.totalMinutes += minutes;
    this.data.dailyHistory[today()] = (this.data.dailyHistory[today()] || 0) + minutes;
    this.data.records.push({ date: today(), time: nowTime(), minutes });
    this.remaining = this.duration;
    this.renderTimeDisplay();
    this.renderProgress();
    this.renderControls();
    this.updateSummary();
    saveData(this.vault, this.data);
    if (this.timeDisplayEl) {
      this.timeDisplayEl.textContent = '✓ 完成';
      setTimeout(() => this.renderTimeDisplay(), 2000);
    }
  }

  destroy(): void {
    if (this.intervalId) { window.clearInterval(this.intervalId); this.intervalId = null; }
  }
}
