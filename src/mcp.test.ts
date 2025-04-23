import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Main client function to demonstrate MCP capabilities
 * 
 * This function demonstrates how to:
 * 1. Connect to an MCP server
 * 2. List available resources
 * 3. Read a specific resource
 * 4. Call a tool with parameters
 * 5. Get a prompt with parameters
 * 
 * Each operation is wrapped in try/catch for proper error handling.
 */
async function runClient() {
  /**
   * Create a transport mechanism for connecting to the server
   * 
   * The StdioClientTransport spawns the server as a child process
   * and communicates with it through stdin/stdout streams.
   * 
   * @param {Object} options - Configuration options
   * @param {string} options.command - Command to run the server
   * @param {Array} options.args - Arguments to pass to the server
   */
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/mcp.js"]
  });

  /**
   * Create the MCP client instance
   * 
   * @param {Object} clientInfo - Information about the client
   * @param {string} clientInfo.name - Client application name
   * @param {string} clientInfo.version - Client version
   * @param {Object} options - Client configuration options
   * @param {Object} options.capabilities - Required server capabilities
   */
  const client = new Client(
    {
      name: "WeatherApp",
      version: "1.0.0"
    },
    {
      capabilities: {
        resources: {}, // We need resource capabilities
        tools: {},     // We need tool capabilities
        prompts: {},   // We need prompt capabilities
      },
    }
  );

  try {
    // Connect the client to the server
    // This establishes the communication channel and initializes the protocol
    await client.connect(transport);

    /**
     * DEMONSTRATION 1: Resource Listing
     * 
     * Lists all resources available from the server.
     * Resource URIs can then be used with readResource().
     */
    console.log("=== Available Tools ===");
    const resources = await client.listTools();
    console.log(JSON.stringify(resources, null, 2));
    
    try {
      /**
       * DEMONSTRATION 2: Resource Reading
       * 
       * Reads the contents of a specific resource by URI.
       * Here we're reading information about New York City.
       * 
       * @param {string} uri - The URI of the resource to read
       */
      console.log("\n=== Test Using Tool ===");
      const cityInfo = await client.callTool({
        name: "search_for_products",
        arguments: {
          query: "water bottles"
        }
      });
      console.log("City info retrieved:", cityInfo);
    } catch (error) {
      // Handle errors specific to resource reading
      console.error("Error reading city info:", error);
    }
  } catch (error) {
    // Handle general client errors
    console.error("Client error:", error);
  } finally {
    // Ensure the client connection is properly closed
    // This is important to clean up resources and terminate the server process
    try {
      await client.close();
      console.log("Client closed successfully");
    } catch (error) {
      console.error("Error closing client:", error);
    }
  }
}

// Run the client and handle any unhandled errors
runClient().catch(error => {
  console.error("Unhandled error in runClient:", error);
});

// Export for potential module usage
export { runClient };
