/**
 * 统计数据收集器
 * 扫描 vault 文件系统，收集仪表盘所需的各项统计
 */

import { Vault, TFile, TFolder, MetadataCache } from 'obsidian';
import { CacheManager } from '../utils/CacheManager';
import { isThisWeek } from '../utils/DateUtils';
import {
  INBOX_FOLDERS,
  INPUT_ARCHIVE,
  INPUT_FOLDERS,
  LIBRARY_FOLDERS,
  POSTS_ROOT,
  WIKI_ROOT,
} from '../utils/PathConstants';

export interface StatsData {
  inbox: number;           // 收件箱未处理数
  inboxBreakdown: Record<string, number>; // 各目录明细
  drafts: number;          // 草稿数
  publishedWeek: number;   // 本周发布数
  libraryPages: number;    // Library 总页面
  libraryBreakdown: Record<string, number>; // Library 分类明细
  deadLinks: number;       // wiki 死链数
  totalPosts: number;      // 已发布文章总数
  categoryBreakdown: Record<string, number>; // 分类统计
  tagBreakdown: Record<string, number>;      // 标签统计
}

export class StatsCollector {
  private cache = new CacheManager<StatsData>(30000); // 30s 缓存

  constructor(
    private vault: Vault,
    private metadataCache: MetadataCache
  ) {}

  /** 获取完整统计数据（带缓存） */
  async collect(forceRefresh = false): Promise<StatsData> {
    if (!forceRefresh) {
      const cached = this.cache.get('stats');
      if (cached) return cached;
    }

    const stats: StatsData = {
      inbox: 0,
      inboxBreakdown: {},
      drafts: 0,
      publishedWeek: 0,
      libraryPages: 0,
      libraryBreakdown: {},
      deadLinks: 0,
      totalPosts: 0,
      categoryBreakdown: {},
      tagBreakdown: {},
    };

    const allFiles = this.vault.getMarkdownFiles();

    for (const file of allFiles) {
      const meta = this.metadataCache.getFileCache(file);

      // 收件箱统计
      this.collectInbox(file, stats);

      // 文章统计
      this.collectPosts(file, meta, stats);

      // Library 统计
      this.collectLibrary(file, stats);
    }

    // Wiki 死链检测
    stats.deadLinks = this.countDeadLinks();

    this.cache.set('stats', stats);
    return stats;
  }

  /** 收件箱：统计各输入目录的文件数 */
  private collectInbox(file: TFile, stats: StatsData): void {
    for (const folder of INBOX_FOLDERS) {
      if (file.path.startsWith(folder + '/')) {
        // 排除已归档的
        if (file.path.startsWith(INPUT_ARCHIVE + '/')) return;
        stats.inboxBreakdown[folder] = (stats.inboxBreakdown[folder] || 0) + 1;
        stats.inbox++;
        return;
      }
    }
  }

  /** 文章：统计草稿、发布、分类、标签 */
  private collectPosts(file: TFile, meta: any, stats: StatsData): void {
    if (!file.path.startsWith(POSTS_ROOT + '/')) return;

    const fm = meta?.frontmatter;
    if (!fm) return;

    // 分类统计
    if (fm.category) {
      stats.categoryBreakdown[fm.category] =
        (stats.categoryBreakdown[fm.category] || 0) + 1;
    }

    // 标签统计
    if (fm.tags && Array.isArray(fm.tags)) {
      for (const tag of fm.tags) {
        stats.tagBreakdown[tag] = (stats.tagBreakdown[tag] || 0) + 1;
      }
    }

    // 草稿
    if (fm.draft === true) {
      stats.drafts++;
      return;
    }

    // 已发布
    stats.totalPosts++;

    // 本周发布
    if (fm.published) {
      const pubDate = new Date(fm.published);
      if (!isNaN(pubDate.getTime()) && isThisWeek(pubDate)) {
        stats.publishedWeek++;
      }
    }
  }

  /** Library：统计各子目录页面数 */
  private collectLibrary(file: TFile, stats: StatsData): void {
    for (const [key, folder] of Object.entries(LIBRARY_FOLDERS)) {
      if (file.path.startsWith(folder + '/')) {
        stats.libraryBreakdown[key] = (stats.libraryBreakdown[key] || 0) + 1;
        stats.libraryPages++;
        return;
      }
    }
  }

  /** Wiki 死链检测：找出引用了不存在文件的 wikilink */
  private countDeadLinks(): number {
    let deadCount = 0;
    const wikiFiles = this.vault.getMarkdownFiles()
      .filter(f => f.path.startsWith(WIKI_ROOT + '/'));

    for (const file of wikiFiles) {
      const cache = this.metadataCache.getFileCache(file);
      if (!cache?.links) continue;

      for (const link of cache.links) {
        const linkedFile = this.metadataCache.getFirstLinkpathDest(
          link.link,
          file.path
        );
        if (!linkedFile) {
          deadCount++;
        }
      }
    }
    return deadCount;
  }

  /** 获取输入池最新文件（按修改时间排序） */
  getLatestInputFiles(limit = 10): TFile[] {
    return this.vault
      .getMarkdownFiles()
      .filter((f) => {
        for (const folder of INBOX_FOLDERS) {
          if (f.path.startsWith(folder + '/')) return true;
        }
        return false;
      })
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, limit);
  }

  /** 获取草稿文件列表 */
  getDraftFiles(): TFile[] {
    return this.vault
      .getMarkdownFiles()
      .filter((f) => {
        if (!f.path.startsWith(POSTS_ROOT + '/')) return false;
        const meta = this.metadataCache.getFileCache(f);
        return meta?.frontmatter?.draft === true;
      })
      .sort((a, b) => b.stat.mtime - a.stat.mtime);
  }

  /** 获取指定目录下所有文件 */
  getFilesInFolder(folder: string): TFile[] {
    return this.vault
      .getMarkdownFiles()
      .filter((f) => f.path.startsWith(folder + '/'))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** 获取最近创建的文章（按创建时间排序） */
  getRecentPosts(limit = 12): TFile[] {
    return this.vault
      .getMarkdownFiles()
      .filter((f) => f.path.startsWith(POSTS_ROOT + '/'))
      .sort((a, b) => b.stat.ctime - a.stat.ctime)
      .slice(0, limit);
  }

  /** 获取最新 Library 页面 */
  getLatestLibraryFiles(limit = 10): TFile[] {
    return this.vault
      .getMarkdownFiles()
      .filter((f) => f.path.startsWith(LIBRARY_FOLDERS.concepts + '/') ||
                     f.path.startsWith(LIBRARY_FOLDERS.entities + '/') ||
                     f.path.startsWith(LIBRARY_FOLDERS.sources + '/') ||
                     f.path.startsWith(LIBRARY_FOLDERS.syntheses + '/'))
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, limit);
  }

  /** 强制刷新缓存 */
  invalidateCache(): void {
    this.cache.invalidate();
  }
}
