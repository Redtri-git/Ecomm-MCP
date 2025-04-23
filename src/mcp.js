#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
dotenv_1.default.config();
var PRODUCTS_TOOL = {};
var isStdioTransport = false;
function safeLog(level, data) {
    if (isStdioTransport) {
        // For stdio transport, log to stderr to avoid protocol interference
        console.error("[".concat(level, "] ").concat(typeof data === 'object' ? JSON.stringify(data) : data));
    }
    else {
        // For other transport types, use the normal logging mechanism
        server.sendLoggingMessage({ level: level, data: data });
    }
}
var server = new index_js_1.Server({
    name: 'firecrawl-mcp',
    version: '1.7.0',
}, {
    capabilities: {
        tools: {},
        logging: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                tools: [
                    PRODUCTS_TOOL
                ],
            })];
    });
}); });
// Server startup
function runLocalServer() {
    return __awaiter(this, void 0, void 0, function () {
        var transport, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.error('Initializing Firecrawl MCP Server...');
                    transport = new stdio_js_1.StdioServerTransport();
                    isStdioTransport = true;
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    // Now that we're connected, we can send logging messages
                    safeLog('info', 'Firecrawl MCP Server initialized successfully');
                    safeLog('info', "running");
                    console.error('Firecrawl MCP Server running on stdio');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Fatal error running server:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function runSSELocalServer() {
    return __awaiter(this, void 0, void 0, function () {
        var transport, app;
        var _this = this;
        return __generator(this, function (_a) {
            transport = null;
            app = (0, express_1.default)();
            app.get('/sse', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transport = new sse_js_1.SSEServerTransport("/messages", res);
                            res.on('close', function () {
                                transport = null;
                            });
                            return [4 /*yield*/, server.connect(transport)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // Endpoint for the client to POST messages
            // Remove express.json() middleware - let the transport handle the body
            app.post('/messages', function (req, res) {
                if (transport) {
                    transport.handlePostMessage(req, res);
                }
            });
            return [2 /*return*/];
        });
    });
}
if (process.env.SSE_LOCAL === 'true') {
    runSSELocalServer().catch(function (error) {
        console.error('Fatal error running server:', error);
        process.exit(1);
    });
}
else {
    runLocalServer().catch(function (error) {
        console.error('Fatal error running server:', error);
        process.exit(1);
    });
}
