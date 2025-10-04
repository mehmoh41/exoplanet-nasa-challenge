import { z } from 'genkit';

/**
 * @fileOverview Zod schemas for AI flows.
 * This file contains the schema definitions for the inputs and outputs of the AI flows.
 * It is kept separate from the flow files to avoid issues with the "use server" directive,
 * which requires that only async functions are exported.
 */

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

export const AnalyzeExoplanetDataInputSchema = z.object({
  data: z
    .string()
    .describe('Exoplanet data in CSV or JSON format.'),
});
export type AnalyzeExoplanetDataInput = z.infer<typeof AnalyzeExoplanetDataInputSchema>;

export const AnalyzeExoplanetDataOutputSchema = z.object({
  analysisResults: z.string().describe('AI analysis results of the exoplanet data.'),
});
export type AnalyzeExoplanetDataOutput = z.infer<typeof AnalyzeExoplanetDataOutputSchema>;
