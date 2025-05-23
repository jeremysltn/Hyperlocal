import { createLogger } from '@/lib/utils/logger';

// Create a logger for this module
const logger = createLogger('ResponseFormatter');

/**
 * Format the agent response into a consistent structure
 * @param agentResponse The response from the LlamaIndex agent
 * @returns Formatted string response
 */
export function formatAgentResponse(agentResponse: any): string {
  if (agentResponse && typeof agentResponse === 'object' && 'data' in agentResponse) {
    const resultData = agentResponse.data;

    if (typeof resultData === 'string') {
      return resultData;
    }

    if (typeof resultData === 'object' && resultData !== null && typeof resultData.result === 'string') {
      return resultData.result;
    }

    logger.warn('Unexpected resultData structure:', resultData);
    return JSON.stringify(resultData);
  } 
  
  if (typeof agentResponse === 'string') {
    return agentResponse;
  }

  logger.warn('Unexpected agent response structure:', agentResponse);
  return 'AI response format is not recognized.';
}
