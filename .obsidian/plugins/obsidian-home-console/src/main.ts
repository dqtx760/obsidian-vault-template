/**
 * Home Console — Obsidian 插件入口
 *
 * 内容创作控制台：以内容流水线为核心的仪表盘，一键触发 AI 技能。
 * 适配四层内容体系：01-输入 → Library → posts → wiki
 */

import { Plugin, WorkspaceLeaf } from 'obsidian';
import { HomeConsoleView, VIEW_TYPE_CONSOLE, setPluginRef } from './HomeConsoleView';

export default class HomeConsolePlugin extends Plugin {
  async onload(): Promise<void> {
    // 注入插件引用（供 SkillRunner 使用）
    setPluginRef(this);

    // 注册 Home Console 视图
    this.registerView(
      VIEW_TYPE_CONSOLE,
      (leaf) => new HomeConsoleView(leaf)
    );

    // 添加侧边栏图标
    this.addRibbonIcon('layout-dashboard', 'Home Console', () => {
      this.activateView();
    });

    // 添加命令面板命令
    this.addCommand({
      id: 'open-home-console',
      name: 'Open Home Console',
      callback: () => this.activateView(),
    });

    // 如果之前有打开的视图，恢复它
    this.app.workspace.onLayoutReady(() => {
      this.reactivateExistingView();
    });

    console.log('Home Console plugin loaded');
  }

  onunload(): void {
    console.log('Home Console plugin unloaded');
  }

  /** 激活/打开 Home Console 视图（在主编辑区打开） */
  async activateView(): Promise<void> {
    const { workspace } = this.app;

    // 检查是否已有打开的视图
    const existing = workspace.getLeavesOfType(VIEW_TYPE_CONSOLE);
    if (existing.length > 0) {
      workspace.revealLeaf(existing[0]);
      return;
    }

    // 在主编辑区（右侧笔记区）打开为新 Tab
    const leaf = workspace.getLeaf('tab');
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_CONSOLE,
        active: true,
      });
      workspace.revealLeaf(leaf);
    }
  }

  /** 恢复之前打开的视图 */
  private reactivateExistingView(): void {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CONSOLE);
    if (leaves.length > 0) {
      // 视图已存在，无需操作
    }
  }
}
