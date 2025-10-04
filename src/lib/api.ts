import type { Exoplanet } from './types';
import data from './exoplanet-data.json';


export async function getExoplanets(): Promise<Exoplanet[] | null> {
  try {
    // We are now loading data from a local file to avoid network issues.
    const exoplanets: Exoplanet[] = data;
    
    // Simulate a short delay to allow loading spinners to be seen
    await new Promise(resolve => setTimeout(resolve, 500));

    return exoplanets;
    
  } catch (error) {
    console.error('Error reading local exoplanet data:', error);
    return null;
  }
}
