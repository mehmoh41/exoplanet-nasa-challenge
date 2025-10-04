'use server';
/**
 * @fileOverview Analyzes exoplanet data using AI to provide insights.
 *
 * - analyzeExoplanetData - A function that handles the analysis of exoplanet data.
 * - AnalyzeExoplanetDataInput - The input type for the analyzeExoplanetData function.
 * - AnalyzeExoplanetDataOutput - The return type for the analyzeExoplanetData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeExoplanetDataInputSchema = z.object({
  data: z
    .string()
    .describe('Exoplanet data in CSV or JSON format.'),
});
export type AnalyzeExoplanetDataInput = z.infer<typeof AnalyzeExoplanetDataInputSchema>;

const AnalyzeExoplanetDataOutputSchema = z.object({
  analysisResults: z.string().describe('AI analysis results of the exoplanet data.'),
});
export type AnalyzeExoplanetDataOutput = z.infer<typeof AnalyzeExoplanetDataOutputSchema>;

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
