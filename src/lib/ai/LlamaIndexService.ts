import { OpenAI } from '@llamaindex/openai';
import { agent } from '@llamaindex/workflow';
import { mcp } from '@llamaindex/tools';
import dotenv from 'dotenv';

import { extractLocationInfo } from '@/lib/utils/locationExtractor';
import { buildDisruptionReportingPrompt } from '@/lib/utils/promptBuilder';
import { formatAgentResponse } from '@/lib/utils/responseFormatter';
import { createLogger } from '@/lib/utils/logger';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set. LlamaIndexService requires it to function.');
}

// Determine the npx command based on the platform
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Create a logger for this service
const logger = createLogger('LlamaIndexService');

/**
 * Service for handling AI-powered disruption reporting using LlamaIndex
 */
class LlamaIndexService {
  private llm: OpenAI;
  private mcpTools: any[] = [];
  private _isInitialized: boolean = false;

  constructor() {
    this.llm = new OpenAI({ 
      apiKey: OPENAI_API_KEY, 
      model: 'gpt-4o-mini' 
    });
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Initialize the service and connect to MCP server
   */
  async initialize(): Promise<void> {
    if (this._isInitialized) return;
    
    try {
      logger.info('Initializing and connecting to MCP server...');
      const server = mcp({
        command: npxCommand,
        args: ['@brightdata/mcp'],
        env: {
          ...process.env, // Inherit parent environment (this is crucial for PATH)
          API_TOKEN: process.env.BRIGHTDATA_API_KEY || '',
          WEB_UNLOCKER_ZONE: process.env.WEB_UNLOCKER_ZONE || 'mcp_unlocker',
          BROWSER_AUTH: process.env.BROWSER_AUTH || '',
        },
        verbose: true,
      });

      this.mcpTools = await server.tools();
      logger.success(`Successfully fetched ${this.mcpTools.length} tools from MCP server.`);
      this._isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize or fetch MCP tools:', error);
      this.mcpTools = [];
      this._isInitialized = false;
    }
  }

  /**
   * Process a user query using LlamaIndex and MCP tools
   */
  public async processQuery(query: string, sessionId?: string): Promise<any> {
    // Ensure service is initialized
    if (!this._isInitialized) {
      await this.initialize();
      if (!this._isInitialized) {
        return { error: "LlamaIndexService: Not initialized and initialization failed." };
      }
    }

    // Return error if no MCP tools are available
    if (this.mcpTools.length === 0) {
      logger.warn('No MCP tools available.');
      return "We couldn't process your request at this time. Please try again later.";
    }

    try {
      // Extract location information from the query
      const locationInfo = await extractLocationInfo(this.llm, query);
      
      // Build system prompt with location context
      const systemPrompt = buildDisruptionReportingPrompt(locationInfo, sessionId);

      // Create and run the agent
      const hyperlocalAgent = agent({
        name: "ScrapingAgent",
        tools: this.mcpTools,
        llm: this.llm,
        systemPrompt,
        verbose: true,
      });

      const agentResponse = await hyperlocalAgent.run(query);
      return formatAgentResponse(agentResponse);
    } catch (error) {
      logger.error('Error processing query:', error);
      return { error: 'Failed to process query.' };
    }
  }
}

// Singleton instance
let serviceInstance: LlamaIndexService | null = null;

export const getLlamaIndexService = async (): Promise<LlamaIndexService> => {
  if (!serviceInstance) {
    serviceInstance = new LlamaIndexService();
    await serviceInstance.initialize();
  }
  return serviceInstance;
};

export default LlamaIndexService;
