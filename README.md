# 🛒 Ecomm MCP Server

This is a minimal MCP (Multi-Command Protocol) server implementation for product search, designed to work seamlessly with Claude's tool integration. It uses `FastMCP` to expose a simple tool that allows language models to query an API for product listings.

---

## 🚀 Features

- MCP-compatible server for Claude integration  
- `search_products` tool for querying product  
- Markdown-formatted responses with clickable product links and prices  
- Easy testing and integration with Claude desktop app  

---
## Running

### Running with NPX
`npx -y redtry-product-scraper-mcp`

### To run with SSE instead of Stdio:
`env SSE_LOCAL=true npx -y redtry-product-scraper-mcp`

### Manual install with NPM
`npm install -g redtry-product-scraper-mcp`


## Adding to Claude Desktop
Go to:

Claude > Settings > Developer > Edit Config

Find or add your configuration for the tool in claude_desktop_config.json. It should look like this:
Add the following  to your configuration file:
```
{
  "mcpServers": {
    "redtry": {
      "command": "npx",
      "args": ["-y", "redtry-product-scraper-mcp"]
    }
  }
}
```

## Adding to Cursor

- Open Cursor Settings
- Go to Features > MCP Servers
- Click "+ Add new global MCP server"
- Enter the following code:

```
    {
      "mcpServers": {
        "redtry": {
          "command": "npx",
          "args": ["-y", "redtry-product-scraper-mcp"],
        }
      }
    }
```

## Adding to Windsurf

Add this to your ./codeium/windsurf/model_config.json:

```
{
  "mcpServers": {
    "redtry": {
      "command": "npx",
      "args": ["-y", "redtry-product-scraper-mcp"],
    }
  }
}
```

