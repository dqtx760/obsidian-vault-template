/**
 * Skill 执行器
 * - 日记: 自动创建
 * - 笔记: 选目录后创建
 * - 查知识库: 弹输入框后复制
 * - 其他: 复制命令到剪贴板
 */

import { Notice, Modal, App, moment } from 'obsidian';
import type { SkillDef } from './SkillRegistry';

const DAILY_FOLDER = '01-输入/07-Daily';
const DAILY_CMD = 'DAILY_NOTE_AUTO';
const NEW_NOTE_CMD = 'NEW_NOTE_AUTO';
const QUERY_CMD = 'QUERY_AUTO';

const NOTE_FOLDERS = [
  { label: '📂 posts', path: 'posts' },
  { label: '📥 01-输入/04-选题', path: '01-输入/04-选题' },
  { label: '📝 01-输入/05-口喷稿', path: '01-输入/05-口喷稿' },
  { label: '📋 Xenia', path: 'Xenia' },
  { label: '📚 Yoke', path: 'Yoke' },
];

export class SkillRunner {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  async run(skill: SkillDef): Promise<void> {
    if (skill.command === DAILY_CMD) {
      await this.createDailyNote();
      return;
    }
    if (skill.command === NEW_NOTE_CMD) {
      this.showFolderPicker();
      return;
    }
    if (skill.command === QUERY_CMD) {
      this.showQueryInput(skill);
      return;
    }

    // 普通按钮: 复制到剪贴板
    try {
      await navigator.clipboard.writeText(skill.command);
      new Notice(`${skill.icon} 已复制  ${skill.command}`, 3000);
    } catch {
      new Notice(`${skill.icon} ${skill.command}`, 5000);
    }
  }

  // ========== 查知识库弹输入框 ==========

  private showQueryInput(skill: SkillDef): void {
    new QueryModal(this.app, (query) => {
      const cmd = `/Library-query ${query}`;
      navigator.clipboard.writeText(cmd);
      new Notice(`${skill.icon} 已复制 → 去终端粘贴执行`, 3000);
    }).open();
  }

  // ========== 笔记选目录 ==========

  private showFolderPicker(): void {
    new FolderPickerModal(this.app, async (folder) => {
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
      const filePath = `${folder}/new-${ts}.md`;

      const content = `---
title: 新笔记
published: ${now.toISOString().slice(0,10)}
tags: []
category: Workflow
draft: true
---

`;
      try {
        await this.app.vault.create(filePath, content);
        await this.app.workspace.openLinkText(filePath, '', false);
        new Notice(`📄 已创建 → ${folder}`, 2000);
      } catch (err) {
        new Notice(`❌ 创建失败: ${err}`, 5000);
      }
    }).open();
  }

  // ========== 日记 ==========

  private async createDailyNote(): Promise<void> {
    const today = moment();
    const fileName = today.format('YYYY-MM-DD') + '.md';
    const filePath = `${DAILY_FOLDER}/${fileName}`;

    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing) {
      await this.app.workspace.openLinkText(filePath, '', false);
      new Notice(`📅 今日日记已打开`, 2000);
      return;
    }

    // 读取自定义模板
    const templatePath = '01-输入/Template/日记模板.md';
    let content = '';
    try {
      const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
      if (templateFile && 'stat' in templateFile) {
        content = await this.app.vault.read(templateFile as any);
        // 替换模板中的日期变量
        const dateStr = today.format('YYYY-MM-DD');
        content = content.replace(/\{\{date\}\}/g, dateStr);
        content = content.replace(/\{\{YYYY\}\}/g, today.format('YYYY'));
        content = content.replace(/\{\{MM\}\}/g, today.format('MM'));
        content = content.replace(/\{\{DD\}\}/g, today.format('DD'));
        content = content.replace(/\{\{weekday\}\}/g, today.format('dddd'));
      } else {
        // 模板不存在，使用默认模板
        const dateStr = today.format('YYYY-MM-DD');
        content = `---
title: ${dateStr} 日记
published: ${dateStr}
tags:
  - daily
category: Daily
draft: false
---

### 今日要事

- [ ]

### 今日记录

### 明日计划
`;
      }
    } catch (err) {
      // 读取模板失败，使用默认模板
      const dateStr = today.format('YYYY-MM-DD');
      content = `---
title: ${dateStr} 日记
published: ${dateStr}
tags:
  - daily
category: Daily
draft: false
---

### 今日要事

- [ ]

### 今日记录

### 明日计划
`;
    }

    try {
      await this.app.vault.create(filePath, content);
      await this.app.workspace.openLinkText(filePath, '', false);
      new Notice(`📅 今日日记已创建`, 2000);
    } catch (err) {
      new Notice(`❌ 创建日记失败: ${err}`, 5000);
    }
  }
}

// ========== 查询输入框 ==========

class QueryModal extends Modal {
  private onSubmit: (query: string) => void;

  constructor(app: App, onSubmit: (query: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: '🔍 查知识库', cls: 'hc-modal-title' });
    contentEl.createEl('p', { text: '输入关键词或问题', cls: 'hc-modal-desc' });

    const input = contentEl.createEl('input', {
      cls: 'hc-modal-input',
      attr: { type: 'text', placeholder: '例如: MCP 协议怎么用' },
    });

    const btnRow = contentEl.createDiv({ cls: 'hc-modal-btn-row' });
    const cancelBtn = btnRow.createEl('button', { text: '取消', cls: 'hc-modal-btn-cancel' });
    const submitBtn = btnRow.createEl('button', { text: '复制命令', cls: 'hc-modal-btn-submit' });

    cancelBtn.addEventListener('click', () => this.close());
    submitBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) {
        this.onSubmit(q);
        this.close();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          this.onSubmit(q);
          this.close();
        }
      }
    });

    input.focus();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

// ========== 笔记目录选择 ==========

class FolderPickerModal extends Modal {
  private onSubmit: (folder: string) => void;

  constructor(app: App, onSubmit: (folder: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: '📄 新建笔记', cls: 'hc-modal-title' });
    contentEl.createEl('p', { text: '选择保存目录', cls: 'hc-modal-desc' });

    const list = contentEl.createDiv({ cls: 'hc-modal-folder-list' });

    for (const folder of NOTE_FOLDERS) {
      const item = list.createDiv({ cls: 'hc-modal-folder-item' });
      item.textContent = folder.label;
      item.addEventListener('click', () => {
        this.onSubmit(folder.path);
        this.close();
      });
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
