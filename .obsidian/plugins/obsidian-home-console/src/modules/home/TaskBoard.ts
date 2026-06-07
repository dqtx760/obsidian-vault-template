/**
 * 最新输出 — 按文件夹分组展示最新文章 + 搜索
 */

import { Vault, TFile, moment } from 'obsidian';

interface Task {
  title: string;
  time: string;
  path: string;
}

interface FolderGroup {
  id: string;
  label: string;
  prefix: string;
}

const FOLDER_GROUPS: FolderGroup[] = [
  { id: 'aihacks',  label: 'AIHacks',   prefix: 'posts/AIHacks/' },
  { id: 'software', label: 'Software',  prefix: 'posts/Software/' },
  { id: 'technical',label: 'Technical', prefix: 'posts/Technical/' },
  { id: 'workflow', label: 'Workflow',  prefix: 'posts/Workflow/' },
  { id: 'yoke',     label: 'Yoke',      prefix: 'Yoke/' },
  { id: 'zen',      label: 'Zen',       prefix: 'Zen/' },
  { id: 'dataview', label: 'Dataview',  prefix: 'Zen/' },
];

function formatTaskTime(date: moment.Moment): string {
  return date.format('YYYY/MM/DD');
}

export async function renderTaskBoard(container: HTMLElement, vault: Vault): Promise<void> {
  container.empty();
  container.addClass('hc-task-board');

  // 标题行
  const header = container.createDiv({ cls: 'hc-panel-header' });
  header.createSpan({ cls: 'hc-panel-title', text: '最新输出' });

  let activeGroup = FOLDER_GROUPS[0];
  let searchQuery = '';

  // 分组 Tab
  const tabs = container.createDiv({ cls: 'hc-task-tabs' });

  for (const group of FOLDER_GROUPS) {
    const tab = tabs.createEl('button', {
      cls: `hc-task-tab${group.id === activeGroup.id ? 'hc-task-tab-active' : ''}`,
      text: group.label,
    });
    tab.addEventListener('click', () => {
      activeGroup = group;
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      tabs.querySelectorAll('.hc-task-tab').forEach(t => t.removeClass('hc-task-tab-active'));
      tab.addClass('hc-task-tab-active');
      renderList(listContainer, vault, activeGroup, searchQuery);
    });
  }

  // 搜索框
  const searchRow = container.createDiv({ cls: 'hc-task-search' });
  searchRow.createSpan({ cls: 'hc-task-search-icon', text: '🔍' });
  const searchInput = searchRow.createEl('input', {
    cls: 'hc-task-search-input',
    attr: { type: 'text', placeholder: '搜索文章...' },
  });
  const clearBtn = searchRow.createEl('span', { cls: 'hc-task-search-clear', text: '✕' });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    renderList(listContainer, vault, activeGroup, searchQuery);
    searchInput.focus();
  });
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderList(listContainer, vault, activeGroup, searchQuery);
  });

  // 任务列表
  const listContainer = container.createDiv({ cls: 'hc-task-list' });
  renderList(listContainer, vault, activeGroup, searchQuery);
}

function renderList(container: HTMLElement, vault: Vault, group: FolderGroup, query: string): void {
  container.empty();

  let files = vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(group.prefix))
    .sort((a, b) => b.stat.mtime - a.stat.mtime);

  // 搜索过滤
  if (query) {
    files = files.filter(f => f.basename.toLowerCase().includes(query));
  }

  files = files.slice(0, 11);

  if (files.length === 0) {
    container.createDiv({ cls: 'hc-empty', text: query ? '无匹配结果' : '暂无内容' });
    return;
  }

  for (const file of files) {
    const item = container.createDiv({ cls: 'hc-task-item' });

    // 图标
    item.createSpan({ cls: 'hc-task-icon', text: '✅' });

    // 标题
    const title = file.basename.length > 24
      ? file.basename.slice(0, 24) + '…'
      : file.basename;
    item.createSpan({ cls: 'hc-task-title', text: title });

    // 时间
    item.createSpan({
      cls: 'hc-task-time',
      text: formatTaskTime(moment(file.stat.mtime)),
    });

    // 点击打开文件
    item.addEventListener('click', () => {
      const event = new CustomEvent('hc:open-file', { detail: file.path });
      document.dispatchEvent(event);
    });
  }
}
