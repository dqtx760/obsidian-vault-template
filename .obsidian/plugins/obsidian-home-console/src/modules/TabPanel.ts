/**
 * Tab 面板容器 — 6 个 Tab，带数量角标
 */

import type { StatsCollector, StatsData } from '../data/StatsCollector';
import { renderInputPool } from './InputPool';
import { renderLibraryHealth } from './LibraryHealth';
import { renderBlogPosts } from './WritingDesk';
import { renderFolderList } from './FolderList';

const TABS = [
  { id: 'input-pool', label: '输入池', icon: '📥', badge: 'inbox' },
  { id: 'library', label: '知识库', icon: '📚', badge: 'library' },
  { id: 'blog', label: '博客文章', icon: '✍️', badge: 'drafts' },
  { id: 'zen', label: 'Dataview', icon: '🔮', badge: '' },
  { id: 'xenia', label: '命令&快捷键', icon: '⌨️', badge: 'xenia' },
  { id: 'yoke', label: '资料合集', icon: '📦', badge: 'yoke' },
];

const FOLDER_MAP: Record<string, { path: string; columns: number }> = {
  xenia: { path: 'Xenia', columns: 1 },
  yoke: { path: 'Yoke', columns: 2 },
  zen: { path: 'Zen', columns: 1 },
};

export class TabPanel {
  private container: HTMLElement;
  private tabBar: HTMLElement;
  private contentArea: HTMLElement;
  private activeTab: string = 'input-pool';
  private stats: StatsData;
  private collector: StatsCollector;

  constructor(container: HTMLElement, stats: StatsData, collector: StatsCollector) {
    this.container = container;
    this.stats = stats;
    this.collector = collector;
    this.container.addClass('hc-tab-panel');

    this.tabBar = this.container.createDiv({ cls: 'hc-tab-bar' });
    this.contentArea = this.container.createDiv({ cls: 'hc-tab-content-area' });

    this.renderTabs();
    this.renderContent();

    document.addEventListener('hc:switch-tab', ((e: CustomEvent) => {
      this.switchTab(e.detail);
    }) as EventListener);
  }

  updateStats(stats: StatsData): void {
    this.stats = stats;
    this.renderTabs(); // 重新渲染以更新角标
    this.renderContent();
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.tabBar.querySelectorAll('.hc-tab-item').forEach((el) => {
      el.toggleClass('hc-tab-active', el.getAttribute('data-tab') === tabId);
    });
    this.renderContent();
  }

  private getBadgeCount(key: string): number {
    switch (key) {
      case 'inbox': return this.stats.inbox;
      case 'library': return this.stats.libraryPages;
      case 'drafts': return this.stats.drafts;
      case 'xenia': return this.collector.getFilesInFolder('Xenia').length;
      case 'yoke': return this.collector.getFilesInFolder('Yoke').length;
      default: return 0;
    }
  }

  private renderTabs(): void {
    this.tabBar.empty();
    for (const tab of TABS) {
      const item = this.tabBar.createDiv({
        cls: `hc-tab-item ${tab.id === this.activeTab ? 'hc-tab-active' : ''}`,
        attr: { 'data-tab': tab.id },
      });
      item.createSpan({ cls: 'hc-tab-icon', text: tab.icon });
      item.createSpan({ cls: 'hc-tab-label', text: tab.label });

      // 数量角标
      if (tab.badge) {
        const count = this.getBadgeCount(tab.badge);
        if (count > 0) {
          item.createSpan({ cls: 'hc-tab-badge', text: String(count) });
        }
      }

      item.addEventListener('click', () => this.switchTab(tab.id));
    }
  }

  private renderContent(): void {
    this.contentArea.empty();
    switch (this.activeTab) {
      case 'input-pool':
        renderInputPool(this.contentArea, this.stats, this.collector);
        break;
      case 'library':
        renderLibraryHealth(this.contentArea, this.stats, this.collector);
        break;
      case 'blog':
        renderBlogPosts(this.contentArea, this.stats, this.collector);
        break;
      case 'xenia':
      case 'yoke':
      case 'zen':
        const f = FOLDER_MAP[this.activeTab];
        renderFolderList(this.contentArea, this.collector, f.path, f.columns);
        break;
    }
  }
}
