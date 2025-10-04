'use server';
/**
 * @fileOverview Analyzes exoplanet data using AI to provide insights.
 *
 * - analyzeExoplanetData - A function that handles the analysis of exoplanet data.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeExoplanetDataInputSchema, AnalyzeExoplanetDataOutputSchema, type AnalyzeExoplanetDataInput, type AnalyzeExoplanetDataOutput } from '@/ai/schemas';

export async function analyzeExoplanetData(input: AnalyzeExoplanetDataInput): Promise<AnalyzeExoplanetDataOutput> {
  return analyzeExoplanetDataFlow(input);
}

const analyzeExoplanetDataPrompt = ai.definePrompt({
  name: 'analyzeExoplanetDataPrompt',
  input: {schema: AnalyzeExoplanetDataInputSchema},
  output: {schema: AnalyzeExoplanetDataOutputSchema},
  prompt: `You are an AI expert in analyzing exoplanet data.

  Analyze the following exoplanet data and provide insights such as potential habitability or unique characteristics.

  Data: {{{data}}}`,
});

const analyzeExoplanetDataFlow = ai.defineFlow(
  {
    name: 'analyzeExoplanetDataFlow',
    inputSchema: AnalyzeExoplanetDataInputSchema,
    outputSchema: AnalyzeExoplanetDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeExoplanetDataPrompt(input);
    return output!;
  }
);
