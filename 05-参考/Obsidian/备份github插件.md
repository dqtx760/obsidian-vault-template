

## 一、前期准备：安装必备工具
### 1. 安装 Git 与 GitHub CLI
1.  前往 [Git 官网](https://git-scm.com/) 下载并安装 Git，安装时保持默认选项即可。
2.  前往 [GitHub CLI 官网](https://cli.github.com/) 下载并安装 GitHub CLI。
3.  安装完成后，打开终端验证是否安装成功：

```
git --version
gh --version
```

输出版本号即为安装成功。

### 2. 在 Obsidian 中安装核心插件
1.  打开 Obsidian → 设置 → 第三方插件，关闭「安全模式」。
2.  进入「社区插件市场」，安装以下两个插件：
    -   **Obsidian Git**：核心备份插件，负责自动提交与推送。
    -   **Terminal**：终端插件，可直接在 Obsidian 中执行 Git 命令。
3.  安装完成后启用插件，在 Terminal 插件设置中开启「整合式终端」。

---

## 二、初始化本地 Git 仓库
如果你的 Obsidian 本地仓库还不是一个 Git 仓库，需要先完成初始化：
1.  打开 Terminal 插件（Obsidian 左侧边栏或命令面板中启动）。
2.  在终端中输入以下命令，初始化本地仓库：

```
git init
```

## 三、创建 GitHub 远程仓库
1.  前往 GitHub 官网，新建一个 **private（私人）仓库**。
2.  注意：本地数据一定要选择不公开，这个仓库就是你 Obsidian 的远程备份空间。
3.  它的核心作用是：一旦本地发生错误，可以随时回退到历史版本。


## 四、连接本地仓库与 GitHub
直接使用下面这段提示词，发给 AI 帮你一键配置：
```
我已安装 Obsidian Git 插件，初始化了本地仓库，
并在 GitHub 创建了 private 仓库。

我的 GitHub 仓库地址是：xxx（你的仓库地址）

请帮我完成以下配置：
1. 添加远程仓库地址
2. 配置 Git 用户信息（名字：Your Name，邮箱：your@email.com）
3. 创建第一次提交：git add . && git commit -m "Initial commit"
4. 推送到 GitHub：git push -u origin main
5. 验证连接是否成功
```



## 五、配置 Obsidian Git 自动备份
连接成功后，在 Obsidian 的「设置 → Git 插件」中：
-   将自动提交/推送的时间间隔设置为 10 分钟（或你觉得合适的时间）。
-   日常使用无需手动操作，每隔几分钟插件就会自动提交并推送到 GitHub。
-   效果：你的知识库会拥有一个**实时备份 + 完整历史版本控制**的安全兜底。

## 六、进阶优化与排错建议
1.  **GitHub CLI 认证（可选推荐）**：
安装 GitHub CLI 后，在终端运行以下命令完成认证，避免推送时反复输入账号密码：
```
gh auth login
```
按提示选择 HTTPS 方式登录，绑定你的 GitHub 账号即可。

2. **遇到问题直接交给 Ai**：
如果配置过程中出现报错，直接把报错信息或这段完整文档发给 AI，让它帮你根据 Git 版本控制内容进行针对性配置与修复。




