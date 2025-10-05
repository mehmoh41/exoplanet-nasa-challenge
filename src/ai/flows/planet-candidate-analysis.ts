'use server';
/**
 * @fileOverview Analyzes a single Kepler Object of Interest (KOI) to classify it.
 *
 * - analyzePlanetCandidate - A function that handles the analysis of a single exoplanet candidate.
 */

import { ai } from '@/ai/genkit';
import { PlanetCandidateInputSchema, PlanetCandidateOutputSchema, type PlanetCandidateInput, type PlanetCandidateOutput } from '@/ai/schemas';

export async function analyzePlanetCandidate(input: PlanetCandidateInput): Promise<PlanetCandidateOutput> {
  return planetCandidateAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'planetCandidateAnalysisPrompt',
  input: { schema: PlanetCandidateInputSchema },
  output: { schema: PlanetCandidateOutputSchema },
  prompt: `You are an expert astrophysicist tasked with classifying a single Kepler Object of Interest (KOI) based on its observational data.
Your goal is to determine if the object is a 'CONFIRMED' exoplanet, a 'CANDIDATE', or a 'FALSE POSITIVE'.

Carefully analyze the following data for the object:
- Kepler Name: {{kepler_name}}
- KOI Name: {{kepoi_name}}
- Orbital Period (koi_period): {{koi_period}} days
- Transit Duration (koi_duration): {{koi_duration}} hours
- Transit Depth (koi_depth): {{koi_depth}} ppm
- Planetary Radius (koi_prad): {{koi_prad}} Earth radii
- Equilibrium Temperature (koi_teq): {{koi_teq}} K
- Insolation Flux (koi_insol): {{koi_insol}} Earth flux
- Transit Signal-to-Noise (koi_model_snr): {{koi_model_snr}}
- Stellar Effective Temperature (koi_steff): {{koi_steff}} K

Based on this data, perform the following:
1.  **Classification**: Predict the most likely disposition: 'CONFIRMED', 'CANDIDATE', or 'FALSE POSITIVE'.
2.  **Confidence Score**: Provide a confidence score for your prediction, from 0.0 (no confidence) to 1.0 (certainty).
3.  **Rationale**: Write a detailed rationale explaining your decision. Reference the provided data.
    - If it looks like a planet, explain why (e.g., "The transit signal-to-noise is high, and the transit shape implied by the duration and depth is U-shaped, consistent with a planetary body.").
    - If it's a false positive, explain the likely cause (e.g., "The transit depth is very large, suggesting an eclipsing binary star system rather than a planet.").
4.  **Key Indicators**: Identify the top 2-3 most influential parameters from the data that led to your conclusion and explain their significance. For example, a very high 'koi_prad' might strongly suggest a false positive (too big for a planet), while a 'koi_model_snr' > 10 is a good sign for a real candidate.

Return your analysis in the specified JSON format.`,
});

const planetCandidateAnalysisFlow = ai.defineFlow(
  {
    name: 'planetCandidateAnalysisFlow',
    inputSchema: PlanetCandidateInputSchema,
    outputSchema: PlanetCandidateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
