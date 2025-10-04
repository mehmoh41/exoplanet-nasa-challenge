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
  output: {format: 'text'},
  prompt: `You are an expert astrophysicist and data analyst. Your task is to analyze the provided exoplanet data and generate a concise, insightful report.

The data is provided in the following format:
{{#if (json data)}}JSON{{else}}CSV{{/if}}

Data:
\`\`\`
{{{data}}}
\`\`\`

Based on the data, please provide the following analysis:

1.  **High-Level Summary**: Briefly summarize the dataset. Mention the total number of objects, the number of confirmed planets, candidates, and false positives.
2.  **Key Discoveries**: Identify the top 3-5 most interesting or significant exoplanets from the list. For each, explain what makes it notable (e.g., is it in the habitable zone? Is it unusually large or small? Does it have a very short or long orbital period?).
3.  **Distribution Analysis**: Briefly comment on the distribution of key parameters. For example:
    *   Are there clusters in orbital period vs. planet radius?
    *   What is the general trend for stellar effective temperature?
4.  **Habitability Potential**: Mention any planets that could be considered candidates for habitability based on their equilibrium temperature (koi_teq) and size (pl_rade). A temperature between 200K and 350K and a radius between 0.5 and 2.0 Earth radii are good starting points.

Present the final output as a single block of text. Use markdown for clear formatting, including headers and bullet points.`,
});

const analyzeExoplanetDataFlow = ai.defineFlow(
  {
    name: 'analyzeExoplanetDataFlow',
    inputSchema: AnalyzeExoplanetDataInputSchema,
    outputSchema: AnalyzeExoplanetDataOutputSchema,
  },
  async input => {
    const {text} = await analyzeExoplanetDataPrompt(input);
    return text;
  }
);
