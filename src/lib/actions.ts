'use server';

import { analyzeExoplanetData } from '@/ai/flows/analyze-exoplanet-data';
import { processLightCurve } from '@/ai/flows/process-light-curve';
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
  analysisType: z.enum(['general', 'light_curve']),
});

export type AnalysisState = {
  message: string;
  results?: any; // Can be string for general or object for light curve
  errors?: {
    dataFile?: string[];
    analysisType?: string[];
  };
};

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

    if (analysisType === 'light_curve') {
       // For light curve, ensure we have time and flux columns
       const parsedCsv = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
       const fields = parsedCsv.meta.fields;
       if (!fields || !fields.includes('time') || !fields.includes('flux')) {
         return { message: 'Light curve analysis requires a CSV with "time" and "flux" columns.' };
       }

      const result = await processLightCurve({ lightCurveData: fileContent });
      if (!result.analysisSummary) {
        return { message: 'AI analysis failed to produce results. Please try a different file.' };
      }
      return { message: 'Analysis complete.', results: result };

    } else {
      // General Analysis
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
