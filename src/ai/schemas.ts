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

export const AnalyzeExoplanetDataOutputSchema = z.string().describe('AI analysis results of the exoplanet data in markdown format.');
export type AnalyzeExoplanetDataOutput = z.infer<typeof AnalyzeExoplanetDataOutputSchema>;


// Schemas for Planet Candidate Analysis
export const PlanetCandidateInputSchema = z.object({
  kepler_name: z.string().optional().describe('Kepler Name of the object.'),
  kepoi_name: z.string().optional().describe('KePOI Name of the object.'),
  koi_period: z.string().optional().describe('Orbital Period [days]'),
  koi_duration: z.string().optional().describe('Transit Duration [hours]'),
  koi_depth: z.string().optional().describe('Transit Depth [ppm]'),
  koi_prad: z.string().optional().describe('Planetary Radius [Earth radii]'),
  koi_teq: z.string().optional().describe('Equilibrium Temperature [K]'),
  koi_insol: z.string().optional().describe('Insolation Flux [Earth flux]'),
  koi_model_snr: z.string().optional().describe('Transit Signal-to-Noise'),
  koi_steff: z.string().optional().describe('Stellar Effective Temperature [K]'),
});
export type PlanetCandidateInput = z.infer<typeof PlanetCandidateInputSchema>;

export const PlanetCandidateOutputSchema = z.object({
  predicted_disposition: z.enum(['CONFIRMED', 'CANDIDATE', 'FALSE POSITIVE']).describe('The AI-predicted disposition of the Kepler Object of Interest.'),
  confidence_score: z.number().min(0).max(1).describe('The confidence score (0.0 to 1.0) for the prediction.'),
  rationale: z.string().describe('A detailed explanation for the prediction, including analysis of key indicators from the data.'),
  key_indicators: z.array(z.object({
    parameter: z.string().describe('The data parameter that was a key indicator (e.g., koi_depth).'),
    value: z.string().describe('The value of the parameter.'),
    significance: z.string().describe('Why this parameter value is significant for the classification.'),
  })).describe('A list of the most influential data points for the decision.'),
});
export type PlanetCandidateOutput = z.infer<typeof PlanetCandidateOutputSchema>;