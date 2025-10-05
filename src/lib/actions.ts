'use server';

import { analyzeExoplanetData } from '@/ai/flows/analyze-exoplanet-data';
import { analyzePlanetCandidate } from '@/ai/flows/planet-candidate-analysis';
import { z } from 'zod';
import Papa from 'papaparse';

const FormSchema = z.object({
  dataFile: z
    .any()
    .refine((file) => file?.size > 0, 'File is required.')
    .refine(
      (file) => file?.type === 'text/csv' || file?.type === 'application/json',
      'Only .csv and .json files are accepted.'
    ),
  analysisType: z.enum(['general', 'candidate_analysis']),
});

export type AnalysisState = {
  message: string;
  results?: any; // Can be string for general or object for light curve
  errors?: {
    dataFile?: string[];
    analysisType?: string[];
  };
};

const REQUIRED_CANDIDATE_COLUMNS = [
    "kepler_name", "kepoi_name", "koi_disposition",
    "koi_score", "koi_period", "koi_duration", "koi_depth",
    "koi_prad", "koi_teq", "koi_insol", "koi_model_snr", "koi_steff"
];

export async function performAnalysis(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const validatedFields = FormSchema.safeParse({
    dataFile: formData.get('dataFile'),
    analysisType: formData.get('analysisType'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { dataFile, analysisType } = validatedFields.data;
  const file = dataFile as File;

  try {
    const fileContent = await file.text();
    const parsedCsv = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    const fields = parsedCsv.meta.fields;

    if (!fields) {
        return { message: 'Could not parse headers from the CSV file.' };
    }

    if (analysisType === 'candidate_analysis') {
      const missingColumns = REQUIRED_CANDIDATE_COLUMNS.filter(col => !fields.includes(col));
      if (missingColumns.length > 0) {
        return { message: `Missing required columns for candidate analysis: ${missingColumns.join(', ')}` };
      }
      if (!parsedCsv.data || parsedCsv.data.length === 0) {
        return { message: 'CSV file contains no data rows to analyze.' };
      }
      // We will only analyze the first row for this feature
      const firstRow = parsedCsv.data[0] as any;
      const result = await analyzePlanetCandidate(firstRow);
      if (!result.predicted_disposition) {
         return { message: 'AI analysis failed to produce a classification. Please try a different file.' };
      }
      return { message: 'Analysis complete.', results: result };

    } else { // General Analysis
      const result = await analyzeExoplanetData({ data: fileContent });
      if (!result) {
          return { message: 'AI analysis failed to produce results. Please try a different file.' };
      }
      return { message: 'Analysis complete.', results: result };
    }

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `An error occurred during analysis: ${errorMessage}. Please check the file and try again.` };
  }
}
