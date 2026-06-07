/**
 * 自动化状态 — 显示自动化任务运行状态
 */

interface AutomationTask {
  icon: string;
  name: string;
  status: 'running' | 'idle' | 'error';
  label: string;
}

const AUTOMATION_TASKS: AutomationTask[] = [
  { icon: '🟢', name: '每日素材收集', status: 'running', label: '运行中' },
  { icon: '🟢', name: 'AI 文章初稿生成', status: 'running', label: '运行中' },
  { icon: '🟢', name: '定时同步备份', status: 'running', label: '运行中' },
];

export function renderAutomationStatus(container: HTMLElement): void {
  container.empty();
  container.addClass('hc-automation');

  // 标题行
  const header = container.createDiv({ cls: 'hc-automation-header' });
  header.createSpan({ cls: 'hc-automation-title', text: '自动化' });

  const running = AUTOMATION_TASKS.filter(t => t.status === 'running').length;
  if (running > 0) {
    const badge = header.createSpan({ cls: 'hc-automation-badge' });
    badge.createSpan({ text: '运行中' });
    badge.createSpan({ cls: 'hc-automation-count', text: String(running) });
  }

  // 任务列表
  const list = container.createDiv({ cls: 'hc-automation-list' });

  for (const task of AUTOMATION_TASKS) {
    const item = list.createDiv({ cls: 'hc-automation-item' });
    item.createSpan({ cls: 'hc-automation-dot', attr: { 'data-status': task.status } });
    item.createSpan({ cls: 'hc-automation-name', text: task.name });
  }

  // 管理入口
  const footer = container.createDiv({ cls: 'hc-automation-footer' });
  const manageBtn = footer.createEl('button', {
    cls: 'hc-automation-manage',
    text: '管理自动化 →',
  });
  manageBtn.addEventListener('click', () => {
    // TODO: 打开自动化管理页面
  });
}
