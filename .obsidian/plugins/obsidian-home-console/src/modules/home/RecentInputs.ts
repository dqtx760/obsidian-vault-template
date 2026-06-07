/**
 * 最新输入 — 按文件夹分组展示最新文件
 */

import { Vault, TFile, moment } from 'obsidian';

interface InputGroup {
  id: string;
  label: string;
  prefix: string;
}

const INPUT_GROUPS: InputGroup[] = [
  { id: 'inbox',    label: 'Raw',      prefix: '01-输入/' },
  { id: 'daily',    label: '日记',    prefix: '01-输入/07-Daily/' },
  { id: 'wechat',   label: '微信',    prefix: '01-输入/03-微信/' },
  { id: 'research', label: '研究',    prefix: '01-输入/' },
  { id: 'learning', label: 'Learning', prefix: '01-输入/Learning/' },
];

function formatTime(date: moment.Moment): string {
  return date.format('YYYY/MM/DD');
}

export function renderRecentInputs(container: HTMLElement, vault: Vault): void {
  // 不清空容器，保留标题
  container.addClass('hc-recent-inputs');

  let activeGroup = INPUT_GROUPS[0];

  // 标签行
  const tabs = container.createDiv({ cls: 'hc-input-tabs' });

  for (const group of INPUT_GROUPS) {
    const tab = tabs.createEl('button', {
      cls: `hc-input-tab${group.id === activeGroup.id ? ' hc-input-tab-active' : ''}`,
      text: group.label,
    });
    tab.addEventListener('click', () => {
      activeGroup = group;
      tabs.querySelectorAll('.hc-input-tab').forEach(t => t.removeClass('hc-input-tab-active'));
      tab.addClass('hc-input-tab-active');
      renderList(listContainer, vault, group);
    });
  }

  // 文件列表
  const listContainer = container.createDiv({ cls: 'hc-recent-list' });
  renderList(listContainer, vault, activeGroup);
}

function renderList(container: HTMLElement, vault: Vault, group: InputGroup): void {
  container.empty();

  const files = vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(group.prefix))
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 6);

  if (files.length === 0) {
    container.createDiv({ cls: 'hc-empty', text: '暂无内容' });
    return;
  }

  for (const file of files) {
    const item = container.createDiv({ cls: 'hc-recent-item' });

    item.createSpan({ cls: 'hc-recent-icon', text: '📄' });

    const name = file.basename.length > 22
      ? file.basename.slice(0, 22) + '…'
      : file.basename;
    item.createSpan({ cls: 'hc-recent-name', text: name });

    item.createSpan({
      cls: 'hc-recent-time',
      text: formatTime(moment(file.stat.mtime)),
    });

    item.addEventListener('click', () => {
      const event = new CustomEvent('hc:open-file', { detail: file.path });
      document.dispatchEvent(event);
    });
  }
}
