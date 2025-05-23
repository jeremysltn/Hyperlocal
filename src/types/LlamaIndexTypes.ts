import { z } from 'zod';

// Define a schema for location information
export const LocationInfoSchema = z.object({
  country: z.string().describe("The full name of the country. Example: France, United States of America."),
  language: z.string().length(2, { message: "Language code must be exactly 2 characters (e.g., en, fr)." }).describe("The ISO 639-1 two-letter language code. Example: en, fr."),
  iso_code: z.string().length(2, { message: "ISO country code must be exactly 2 characters (e.g., US, FR)." }).describe("The ISO 3166-1 alpha-2 two-letter country code. Example: US, FR."),
});

export type LocationInfo = z.infer<typeof LocationInfoSchema>;
