import type { Exoplanet } from './types';

const API_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const BASE_QUERY = 'select+pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass+from+pscomppars';

export async function getExoplanets(): Promise<Exoplanet[] | null> {
  // This query fetches all columns for all planets.
  const query = `${BASE_QUERY}`;
  const fullUrl = `${API_URL}?query=${query}&format=json`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 * 24 }, // Revalidate once a day
    });
    
    if (!response.ok) {
      console.error(`Error fetching data: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();

    // The API returns an array of objects, which we can directly cast to our type.
    const exoplanets: Exoplanet[] = data;

    return exoplanets;
    
  } catch (error) {
    console.error('An unexpected error occurred while fetching exoplanet data:', error);
    return null;
  }
}
