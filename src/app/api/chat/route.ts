import { NextResponse } from 'next/server';
import { getLlamaIndexService } from '@/lib/ai/LlamaIndexService';
import { createLogger } from '@/lib/utils/logger';

// Create a logger for this API route
const logger = createLogger('ChatAPI');

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      logger.warn('Request missing required message field');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get LlamaIndexService instance
    const llamaService = await getLlamaIndexService();

    // Check if service is initialized
    if (!llamaService.isInitialized) {
      logger.error('LlamaIndexService failed to initialize.');
      return NextResponse.json(
        { error: 'AI service is not available. Please try again later.' },
        { status: 503 }
      );
    }
    
    // logger.info(`Processing message for session: ${sessionId || 'N/A'}`, message);

    // Process the query
    const result = await llamaService.processQuery(message, sessionId);
    
    // Check if the response indicates an error
    if (result && typeof result === 'object' && 'error' in result) {
      logger.error('Error from LlamaIndexService:', result.error);
      return NextResponse.json({ 
        type: 'error', 
        error: result.error || 'An error occurred while processing your request.' 
      });
    } 
    
    // Return successful result
    logger.success('Successfully processed message');
    return NextResponse.json({ 
      type: 'result', 
      content: result 
    });

  } catch (error) {
    // Handle any unexpected errors
    logger.error('Error in POST handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ 
      type: 'error',
      error: errorMessage 
    }, { status: 500 });
  }
}
