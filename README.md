# 🛒 Ecomm MCP Server
[![smithery badge](https://smithery.ai/badge/ecomm-mcp)](https://smithery.ai/server/ecomm-mcp)

This is a minimal MCP (Multi-Command Protocol) server implementation for product search, designed to work seamlessly with Claude's tool integration. It uses `FastMCP` to expose a simple tool that allows language models to query an API for product listings.

---

## 🚀 Features

- MCP-compatible server for Claude integration  
- `search_products` tool for querying product  
- Markdown-formatted responses with clickable product links and prices  
- Easy testing and integration with Claude desktop app  

---

## 🧪 Local Development

To run this MCP server in development mode:
```bash
uv run mcp dev main.py
```

## 🔌 Install for Claude

### Installing via Smithery

To install Ecomm MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/ecomm-mcp):

```bash
npx -y @smithery/cli install ecomm-mcp --client claude
```

### Installing Manually
To register and install this tool with Claude:
```bash
uv run mcp install main.py
```

After installation, go to:

Claude > Settings > Developer > Edit Config

Find or add your configuration for the tool in claude_desktop_config.json. It should look like this:

```bash
{
  "mcpServers": {
    "Ecomm": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "mcp[cli]",
        "--with",
        "requests",
        "mcp",
        "run",
        "/path/to/your-cloned-mcp-server/main.py"
      ]
    }
  }
}
```
🔧 Update the path in the last argument to the correct location of your main.py.