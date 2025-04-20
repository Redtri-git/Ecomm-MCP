from mcp.server.fastmcp import FastMCP
import os
import requests
from typing import Dict, Any

# Create an MCP server
mcp = FastMCP("Ecomm")

@mcp.tool()
def search_products(query: str) -> Dict[str, Any]:
    """
    Sends a POST request to the /api/mcp endpoint with a product search query.
    Returns a structured JSON response including product listings.

    The expected format for LLM presentation is a Markdown list of the top results:
    - Each item should display the product title as a clickable Markdown link.
    - Each link should be followed by the product's price.
    - Only the most relevant results (e.g., top 25) should be shown.

    Example output:
    Here are some results:

    - [Product Title 1](https://example.com/product1) - $19.99
    - [Product Title 2](https://example.com/product2) - $24.99

    Args:
        query (str): The product search term (e.g., "soccer balls").

    Returns:
        dict: Response from the MCP server containing product listings or error info.
    """
    url = "https://deciding-pelican-overly.ngrok-free.app/api/mcp"
    payload = {
        "query": query
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        return {
            "status_code": response.status_code,
            "response": response.json()
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run(transport = "stdio")