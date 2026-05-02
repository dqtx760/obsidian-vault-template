
#### 1. 获取API key

| Api供应商                                                         | Key创建入口                                                                               | 使用说明                                                                                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [智谱](https://www.bigmodel.cn/glm-coding?ic=PUCQNADSPM)         | [点此获取](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)                              | [点此查看](https://docs.bigmodel.cn/cn/guide/develop/claude)                                                                                                                |
| [火山](https://volcengine.com/L/HKZkyHHHJ0k/)                    | [点此获取](https://console.volcengine.com/ark/region:ark+cn-beijing/apikey?apikey=%7B%7D) | [点此查看](https://www.volcengine.com/docs/82379/1928261?lang=zh)                                                                                                           |
| [MiniMax](https://platform.minimaxi.com/subscribe/coding-plan) | [点此获取](https://platform.minimaxi.com/user-center/basic-information/interface-key)     | [点此查看](https://platform.minimaxi.com/docs/guides/text-ai-coding-tools#%E5%9C%A8-claude-code-%E4%B8%AD%E4%BD%BF%E7%94%A8-minimax-m2%EF%BC%88%E6%8E%A8%E8%8D%90%EF%BC%89) |
| [Kimi K2](https://www.kimi.com/code)                           | 点此获取                                                                                  | [点此查看](https://www.kimi.com/code/docs/third-party-tools/other-coding-agents.html)                                                                                       |
| [OpenRouter](https://openrouter.ai/)                           | [点此获取](https://openrouter.ai/workspaces/default/keys)                                 | 点此查看                                                                                                                                                                    |
#### 2. 配置API

#### 借助→[CC Switch](https://github.1zyq1.com/farion1231/cc-switch/releases/download/v3.14.1/CC-Switch-v3.14.1-Windows.msi)
####  手动配置
```
~/.claude/settings.json
```

智谱
```
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "yourkey here",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "MCP_TOOL_TIMEOUT": "30000"
  },
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "alwaysThinkingEnabled": false
}
```

火山
```
```JSON
{
    "env": {
        "ANTHROPIC_AUTH_TOKEN": "<ARK_API_KEY>",
        "ANTHROPIC_BASE_URL": "https://ark.cn-beijing.volces.com/api/coding",
        "ANTHROPIC_MODEL": "ark-code-latest"
    }
}
```

MiniMax
```JSON
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.minimaxi.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
    "ANTHROPIC_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "MiniMax-M2.7"
  },
  "includeCoAuthoredBy": false
}
```


Kimi K2

```
$env:ENABLE_TOOL_SEARCH="false"
$env:ANTHROPIC_BASE_URL="https://api.kimi.com/coding/"
$env:ANTHROPIC_API_KEY="你的API Key"
```

openrouter

```
  
"env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-xxxxx",
    "ANTHROPIC_API_KEY": "",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "openrouter/free",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "openrouter/free",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "openrouter/free",
    "CLAUDE_CODE_SUBAGENT_MODEL": "openrouter/free"
  },
```
