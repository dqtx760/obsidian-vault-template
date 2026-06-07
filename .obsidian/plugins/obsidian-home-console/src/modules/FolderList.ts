/**
 * 文件夹列表模块 — 带搜索过滤 + 可选多列布局
 */

import type { StatsCollector } from '../data/StatsCollector';
import { relativeTime } from '../utils/DateUtils';

export function renderFolderList(
  container: HTMLElement,
  collector: StatsCollector,
  folderPath: string,
  columns: number = 1
): void {
  container.empty();
  container.addClass('hc-tab-content');

  const card = container.createDiv({ cls: 'hc-card' });
  const header = card.createDiv({ cls: 'hc-card-header' });
  header.createSpan({ cls: 'hc-card-title', text: `${folderPath}` });

  const allFiles = collector.getFilesInFolder(folderPath);

  if (allFiles.length === 0) {
    header.createSpan({ cls: 'hc-card-badge', text: '0' });
    card.createDiv({ cls: 'hc-empty', text: '目录为空' });
    return;
  }

  header.createSpan({ cls: 'hc-card-badge', text: String(allFiles.length) });

  // 搜索框
  const searchRow = card.createDiv({ cls: 'hc-search-row' });
  searchRow.createSpan({ cls: 'hc-search-icon', text: '🔍' });
  const searchInput = searchRow.createEl('input', {
    cls: 'hc-search-input',
    attr: { type: 'text', placeholder: `搜索 ${folderPath}...` },
  });

  const list = card.createDiv({
    cls: columns > 1 ? 'hc-card-grid' : 'hc-card-list',
  });
  if (columns > 1) {
    (list as HTMLElement).style.setProperty('--grid-cols', String(columns));
  }

  function renderList(filter: string) {
    list.empty();
    const q = filter.toLowerCase();
    const files = q
      ? allFiles.filter(f => f.name.toLowerCase().includes(q))
      : allFiles;

    if (files.length === 0) {
      list.createDiv({ cls: 'hc-empty', text: '无匹配结果' });
      return;
    }

    for (const file of files) {
      const item = list.createDiv({ cls: 'hc-list-item hc-clickable' });
      item.createSpan({ cls: 'hc-list-icon', text: '📄' });
      item.createSpan({ cls: 'hc-list-label', text: file.name.replace('.md', '') });
      item.createSpan({ cls: 'hc-list-time', text: relativeTime(new Date(file.stat.mtime)) });
      item.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('hc:open-file', { detail: file.path }));
      });
    }
  }

  renderList('');
  searchInput.addEventListener('input', () => renderList(searchInput.value));
}
