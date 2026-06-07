---
title: Bat
time: 2026-06-07
tags:
  - 效率工具
---

Claud code桌面启动

```
@echo off
title Claude Code
where claude >nul 2>&1 || (echo Claude Code 未安装 & pause & exit /b 1)
claude --dangerously-skip-permissions
```

右键cmd集成reg


```
Windows Registry Editor Version 5.00

; 桌面/文件夹空白右键
[HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCMD]
@="打开Cmd"
"Icon"="cmd.exe,0"

[HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCMD\command]
@="cmd.exe"

; 文件夹本体右键
[HKEY_CLASSES_ROOT\Directory\shell\OpenCMD]
@="打开Cmd"
"Icon"="cmd.exe,0"

[HKEY_CLASSES_ROOT\Directory\shell\OpenCMD\command]
@="cmd.exe /k cd /d \"%1\""
```


### bash右键.reg

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\OpenBash]
@="打开Bash"
"Icon"="C:\\Program Files\\Git\\mingw64\\share\\git\\git-for-windows.ico"

[HKEY_CLASSES_ROOT\Directory\Background\shell\OpenBash\command]
@="\"C:\\Program Files\\Git\\git-bash.exe\" --cd=\"%V\""

[HKEY_CLASSES_ROOT\Directory\shell\OpenBash]
@="打开Bash"
"Icon"="C:\\Program Files\\Git\\mingw64\\share\\git\\git-for-windows.ico"

[HKEY_CLASSES_ROOT\Directory\shell\OpenBash\command]
@="\"C:\\Program Files\\Git\\git-bash.exe\" --cd=\"%1\""
```


### Terminal右键.reg

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\WindowsTerminal]
@="在此处打开Terminal"
"Icon"="D:\\software\\terminal-1.23.20211.0\\WindowsTerminal.exe,0"

[HKEY_CLASSES_ROOT\Directory\Background\shell\WindowsTerminal\command]
@="D:\\software\\terminal-1.23.20211.0\\WindowsTerminal.exe -d ."

[HKEY_CLASSES_ROOT\Directory\shell\WindowsTerminal]
@="在此处打开Terminal"
"Icon"="D:\\software\\terminal-1.23.20211.0\\WindowsTerminal.exe,0"

[HKEY_CLASSES_ROOT\Directory\shell\WindowsTerminal\command]
@="D:\\software\\terminal-1.23.20211.0\\WindowsTerminal.exe -d \"%1\""
```