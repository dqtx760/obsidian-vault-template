/**
 * 侧边栏导航
 */

type NavCallback = (pageId: string) => void;

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV_structure: NavGroup[] = [
  {
    items: [
      { id: 'home', icon: '🏠', label: '首页' },
    ],
  },
  {
    label: '工作台',
    items: [
      { id: 'input', icon: '📥', label: '输入收集' },
      { id: 'ai', icon: '✨', label: 'AI 工作台' },
      { id: 'content', icon: '📋', label: '内容管理' },
      { id: 'publish', icon: '📢', label: '发布中心' },
    ],
  },
  {
    label: '知识库',
    items: [
      { id: 'library', icon: '📚', label: 'Library' },
      { id: 'wiki', icon: '🔗', label: 'Wiki' },
      { id: 'dataview', icon: '📊', label: 'Dataview' },
    ],
  },
  {
    label: '工具',
    items: [
      { id: 'templates', icon: '📄', label: '模板中心' },
      { id: 'automation', icon: '🔄', label: '自动化' },
      { id: 'settings', icon: '⚙️', label: '设置' },
    ],
  },
];

export class Sidebar {
  private container: HTMLElement;
  private callback: NavCallback;
  private activeId = 'home';
  private navButtons: Map<string, HTMLElement> = new Map();

  constructor(container: HTMLElement, callback: NavCallback) {
    this.container = container;
    this.callback = callback;
    this.render();
  }

  private render(): void {
    this.container.empty();

    // Logo
    const logo = this.container.createDiv({ cls: 'hc-sidebar-logo' });
    logo.createSpan({ cls: 'hc-sidebar-logo-icon', text: '⌂' });
    logo.createSpan({ text: 'HOME CONSOLE' });

    // 导航分组
    for (const group of NAV_structure) {
      const groupEl = this.container.createDiv({ cls: 'hc-nav-group' });

      if (group.label) {
        groupEl.createDiv({ cls: 'hc-nav-group-label', text: group.label });
      }

      for (const item of group.items) {
        const btn = groupEl.createEl('button', {
          cls: `hc-nav-item${item.id === this.activeId ? ' hc-nav-active' : ''}`,
        });

        // 保存引用
        this.navButtons.set(item.id, btn);

        btn.createSpan({ cls: 'hc-nav-icon', text: item.icon });
        btn.createSpan({ cls: 'hc-nav-label', text: item.label });

        btn.addEventListener('click', () => {
          this.setActive(item.id);
          this.callback(item.id);
        });
      }
    }

    // 底部弹性空间
    this.container.createDiv({ cls: 'hc-sidebar-spacer' });
  }

  setActive(pageId: string): void {
    // 移除旧高亮
    const oldBtn = this.navButtons.get(this.activeId);
    if (oldBtn) oldBtn.removeClass('hc-nav-active');

    // 设置新高亮
    this.activeId = pageId;
    const newBtn = this.navButtons.get(pageId);
    if (newBtn) newBtn.addClass('hc-nav-active');
  }
}
