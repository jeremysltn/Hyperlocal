import { OpenAI } from '@llamaindex/openai';
import { LocationInfo, LocationInfoSchema } from '@/types/LlamaIndexTypes';
import { createLogger } from '@/lib/utils/logger';

// Create a logger for this module
const logger = createLogger('LocationExtractor');

/**
 * Extract location information from the user's query
 * @param llm The OpenAI instance to use for extraction
 * @param query The user's query
 * @returns LocationInfo object containing country, language, and ISO code
 */
export async function extractLocationInfo(llm: OpenAI, query: string): Promise<LocationInfo> {
  logger.info('Extracting location information from query:', query);

  try {
    const response = await llm.chat({
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting location information. Analyze the user's query to infer the country name, its ISO 639-1 two-letter language code (e.g., 'en' for English, 'fr' for French), and its ISO 3166-1 alpha-2 two-letter country code (e.g., 'US' for United States, 'FR' for France). Ensure language and ISO codes are exactly two letters. Respond with a JSON object that strictly adheres to the provided schema. All fields (country, language, iso_code) are mandatory."
        },
        { role: "user", content: query }
      ],
      responseFormat: LocationInfoSchema
    });

    const content = response.message.content;
    
    if (typeof content === 'string') {
      const parsedContent = JSON.parse(content);
      const validatedData = LocationInfoSchema.parse(parsedContent);
      logger.success('Successfully extracted location info:', validatedData);
      return validatedData;
    } 
    
    throw new Error(`Expected string response, but received: ${typeof content}`);
  } catch (error) {
    logger.error('Error during location extraction:', error);
    throw new Error("Failed to extract location information from query");
  }
}
