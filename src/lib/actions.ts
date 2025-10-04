'use server';

import { analyzeExoplanetData } from '@/ai/flows/analyze-exoplanet-data';
import { z } from 'zod';

const FormSchema = z.object({
  dataFile: z
    .any()
    .refine((file) => file?.size > 0, 'File is required.')
    .refine(
      (file) => file?.type === 'text/csv' || file?.type === 'application/json',
      'Only .csv and .json files are accepted.'
    ),
});

export type AnalysisState = {
  message: string;
  results?: string;
  errors?: {
    dataFile?: string[];
  };
};

export async function performAnalysis(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const validatedFields = FormSchema.safeParse({
    dataFile: formData.get('dataFile'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const file = validatedFields.data.dataFile as File;

  try {
    const fileContent = await file.text();

    const result = await analyzeExoplanetData({ data: fileContent });

    if (!result.analysisResults) {
        return { message: 'AI analysis failed to produce results. Please try a different file.' };
    }

    return { message: 'Analysis complete.', results: result.analysisResults };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred during analysis. Please check the file and try again.' };
  }
}
