🛒 Ecomm MCP Server
This is a minimal MCP (Multi-Command Protocol) server implementation for product search, designed to work seamlessly with Claude's tool integration. It uses FastMCP to expose a simple tool that allows language models to query an API for product listings.

🚀 Features
MCP-compatible server for Claude integration.
search_products tool for querying product.
Markdown-formatted responses with clickable product links and prices.
Easy testing and integration with Claude desktop app.

🧪 Local Development
To run this MCP server in development mode:

bash
Copy
Edit
uv run mcp dev main.py
This will start the server using uv with your development environment configuration.

🔌 Install for Claude
To register and install this tool with Claude:

bash
Copy
Edit
uv run mcp install main.py
After installation, go to:

nginx
Copy
Edit
Claude > Settings > Developer > Edit Config
Find or add your configuration for the tool in claude_desktop_config.json. It should look like this:

json
Copy
Edit
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
        "/Users/sanchitsingh/PycharmProjects/Ecomm_MCP_Server/mcp-server-demo/main.py"
      ]
    }
  }
}

Update the path in the last argument to the correct location of your main.py.

📦 search_products Tool
This MCP tool sends a query to an external product API and returns up to 25 relevant results in a Markdown list format.