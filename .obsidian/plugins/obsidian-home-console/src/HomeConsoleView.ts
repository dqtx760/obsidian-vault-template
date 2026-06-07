/**
 * Home Console 主视图 v3
 * 无侧边栏，直接渲染首页仪表盘
 */

import { ItemView, WorkspaceLeaf, Plugin } from 'obsidian';
import { HomePage } from './modules/home/HomePage';

export const VIEW_TYPE_CONSOLE = 'home-console-view';

/** 全局插件引用，用于视图创建时注入 */
let pluginRef: Plugin | null = null;

export function setPluginRef(plugin: Plugin): void {
  pluginRef = plugin;
}

export class HomeConsoleView extends ItemView {
  private homePage: HomePage | null = null;
  private refreshInterval: number | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_CONSOLE;
  }

  getDisplayText(): string {
    return 'Home Console';
  }

  getIcon(): string {
    return 'layout-dashboard';
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1] as HTMLElement; // 跳过标题
    container.empty();
    container.addClass('hc-container');

    // 确保标题显示
    const headerEl = this.containerEl.children[0] as HTMLElement;
    if (headerEl) {
      headerEl.style.display = '';
    }

    // 直接渲染首页
    this.homePage = new HomePage(container, this.app);
    await this.homePage.render();

    // 监听文件变化自动刷新
    this.registerEvent(
      this.app.vault.on('create', () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on('delete', () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on('modify', () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on('rename', () => this.scheduleRefresh())
    );

    // 监听打开文件事件
    document.addEventListener('hc:open-file', ((e: CustomEvent) => {
      const path = e.detail;
      const file = this.app.vault.getAbstractFileByPath(path);
      if (file) {
        this.app.workspace.openLinkText(path, '', false);
      }
    }) as EventListener);
  }

  async onClose(): Promise<void> {
    if (this.refreshInterval) {
      window.clearTimeout(this.refreshInterval);
      this.refreshInterval = null;
    }
    if (this.homePage) {
      this.homePage.destroy();
      this.homePage = null;
    }
  }

  /** 刷新数据 */
  async refresh(): Promise<void> {
    if (this.homePage) {
      this.homePage.destroy();
      this.homePage = null;
    }
    const container = this.containerEl.children[1] as HTMLElement;
    this.homePage = new HomePage(container, this.app);
    await this.homePage.render();
  }

  /** 防抖刷新（文件变化时） */
  private scheduleRefresh(): void {
    if (this.refreshInterval) {
      window.clearTimeout(this.refreshInterval);
    }
    this.refreshInterval = window.setTimeout(() => {
      this.refresh();
      this.refreshInterval = null;
    }, 3000);
  }
}
