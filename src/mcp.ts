#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

import z from "zod";

import dotenv from 'dotenv';

import express from 'express';

import {
  CallToolResult,
  ImageContentSchema,
  TextContentSchema,
} from '@modelcontextprotocol/sdk/types.js';

const axios = require('axios')

import { lookup as mimeLookup } from "mime-types";

dotenv.config();

let isStdioTransport = false;

function safeLog(level, data) {
  if (isStdioTransport) {
    // For stdio transport, log to stderr to avoid protocol interference
    console.error(
      `[${level}] ${typeof data === 'object' ? JSON.stringify(data) : data}`
    );
  } else {
    try {
      server.server.sendLoggingMessage({ level, data });
    }
    catch (error) {
      console.error(
        `[${level}] ${typeof data === 'object' ? JSON.stringify(data) : data}`);
      console.error(`Failed to log to SSE server ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function scrape(query: string) {
  //const endpoint_url = "https://deciding-pelican-overly.ngrok-free.app/api/mcp";
  const endpoint_url = "http://localhost:5001/api/mcp";

  const payload = {
    "query": query
  }
  let response = await axios.post(endpoint_url,
    payload);
  if (response.status != 200){
    throw new Error("Failed to reach API");
  }
  return {
    "status_code": response.status,
    "data": response.data
  };
}

async function fetchImage(url){
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });

  if (response.status != 200){
    throw new Error("Failed to get Image");
  }

  const buffer = Buffer.from(response.data);
  const base64Data = buffer.toString('base64');

  const mimeType = response.headers['content-type'] ||
                   mimeLookup(url) ||
                   'application/octet-stream';
  return [base64Data, mimeType];
}

const mcpTitle = 'Redtry Product Scraper';

const server = new McpServer(
  {
    name: mcpTitle,
    version: '1.0.2',
  },
  {
    capabilities: {
      tools: {},
      logging: {},
    },
  }
);


server.tool(
  'search_for_products',
  { query: z.string() },
  async ({ query }) => {
    const startTime = Date.now();
    try {
      // Log incoming request with timestamp
      safeLog(
        'info',
        `Received request for search_for_products`
      );

      if (query.length === 0) {
        throw new Error('No arguments provided');
      }           
      const scrapeStartTime = Date.now();
      safeLog(
        'debug',
        `Starting scrape for query: ${query} with options}`
      );

      const response = await scrape(query);

      // convert to string
      let cont_list = []
      for (const product of response.data){
        const title = product.title
        const price = product.price
        const url = product.product_url
        let line =`- [${title}](${url}) - ${price}`;
        cont_list.push({
          type: "text",
          text: line
        });
        const fetchImageResp = await fetchImage(product.image_url);
        const imageData: string = fetchImageResp[0]; // asdafafsdffdsdafasdfa
        const imageMimeType: string = fetchImageResp[1];
        safeLog('debug', `url: ${product.image_url}`)
        const image: z.infer<typeof ImageContentSchema> = {
          type: "image",
          data: imageData,
          mimeType: imageMimeType
        }
        cont_list.push(image)
        
      }
      safeLog(
        'debug',
        `Scrape completed in ${Date.now() - scrapeStartTime}ms`
      );

      const content_list: CallToolResult = { content: cont_list };
      return content_list;

    } catch (error) {
      // Log detailed error information
      safeLog('error', {
        message: `Request failed: ${error instanceof Error ? error.message : String(error)
          }`,
        tool: 'search_for_products',
        arguments: { 'query': query },
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      });
      return {
        content: [
          {
            type: 'text',
            text: trimResponseText(
              `Error: ${error instanceof Error ? error.message : String(error)}`
            )
          },
        ],
        isError: true,
      };
    } finally {
      // Log request completion with performance metrics
      safeLog('debug', `Request completed in ${Date.now() - startTime}ms`);
    }
  });

function trimResponseText(text: string): string {
  return text.trim();
}

// Server startup
async function runLocalServer() {
  isStdioTransport = true;

  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Now that we're connected, we can send logging messages
  safeLog('debug', `${mcpTitle} MCP Server initialized successfully`);

  safeLog('debug', `${mcpTitle} MCP Server running on stdio`);
}
async function runSSELocalServer() {
  let transport = null;
  const app = express();

  app.get('/sse', async (req, res) => {
    transport = new SSEServerTransport(`/messages`, res);
    res.on('close', () => {
      transport = null;
    });
    await server.connect(transport);
  });

  // Endpoint for the client to POST messages
  // Remove express.json() middleware - let the transport handle the body
  app.post('/messages', (req, res) => {
    if (transport) {
      transport.handlePostMessage(req, res);
    }
  });
}

if (process.env.SSE_LOCAL === 'true') {
  runSSELocalServer().catch((error) => {
    safeLog('error', `Fatal error running server: ${error}`);
    process.exit(1);
  });
} else {
  runLocalServer().catch((error) => {
    safeLog('error', `Fatal error running server: ${error}`);
    process.exit(1);
  });
}
