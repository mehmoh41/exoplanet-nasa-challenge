'use server';
/**
 * @fileOverview A flow for processing exoplanet light curve data.
 *
 * - processLightCurve - A function that handles cleaning, normalizing, and segmenting light curve data.
 * - ProcessLightCurveInput - The input type for the processLightCurve function.
 * - ProcessLightCurveOutput - The return type for the processLightCurve function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ProcessLightCurveInputSchema = z.object({
  lightCurveData: z.string().describe('Light curve data as a CSV string with "time" and "flux" columns.'),
});
export type ProcessLightCurveInput = z.infer<typeof ProcessLightCurveInputSchema>;

export const ProcessLightCurveOutputSchema = z.object({
  analysisSummary: z.string().describe('A summary of the processing and analysis performed on the light curve.'),
  processedData: z.array(z.object({
    time: z.number(),
    original_flux: z.number(),
    normalized_flux: z.number(),
    is_outlier: z.boolean(),
  })).describe('The processed light curve data points.'),
  timeWindows: z.array(z.object({
    startTime: z.number(),
    endTime: z.number(),
    segment: z.string().describe('The data points within this time window as a string or array.'),
  })).describe('The data segmented into uniform time windows.'),
});
export type ProcessLightCurveOutput = z.infer<typeof ProcessLightCurveOutputSchema>;


export async function processLightCurve(input: ProcessLightCurveInput): Promise<ProcessLightCurveOutput> {
  return processLightCurveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processLightCurvePrompt',
  input: { schema: ProcessLightCurveInputSchema },
  output: { schema: ProcessLightCurveOutputSchema },
  prompt: `You are an expert astrophysicist specializing in exoplanet detection from light curve data.
Your task is to process the provided light curve data.

Data:
{{{lightCurveData}}}

Perform the following steps and return the result in the specified JSON format:
1.  **Analyze and Summarize**: Briefly describe the characteristics of the raw data (e.g., noise level, trends).
2.  **Denoise and Normalize**:
    - Identify and flag outliers in the flux data. A common method is to flag points that are more than 3 standard deviations from a rolling median.
    - Normalize the flux. A standard method is to divide the flux by the median flux of the entire series, so the baseline is centered around 1.0.
    - Fill the 'processedData' array with the results. Include the original time, original flux, the calculated normalized flux, and a boolean 'is_outlier' flag for each data point.
3.  **Segment Data**:
    - Divide the entire time series into 10 uniform time windows.
    - For each window, provide the start and end time.
    - Include the data points (or a reference to them) that fall within each window in the 'segment' field.

Provide a concise 'analysisSummary' of the steps you took.
`,
});

const processLightCurveFlow = ai.defineFlow(
  {
    name: 'processLightCurveFlow',
    inputSchema: ProcessLightCurveInputSchema,
    outputSchema: ProcessLightCurveOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
