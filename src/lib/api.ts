import type { Exoplanet } from './types';

const API_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

// Base columns for the query
const BASE_COLUMNS = 'pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass';

export async function getExoplanets(): Promise<Exoplanet[] | null> {
  // A simplified query to fetch a limited number of confirmed exoplanets.
  const query = `select+top+300+${BASE_COLUMNS}+from+pscomppars+where+default_flag=1+order+by+disc_year+desc,pl_name+asc`;
  const fullUrl = `${API_URL}?query=${query}&format=json`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 * 24 }, // Revalidate once a day
    });

    if (!response.ok) {
      console.error(`API Error: ${response.statusText}`);
      return null;
    }

    const data: any[] = await response.json();
    
    // Filter out entries without a planet name as they are not useful
    return data.filter((p: any) => p.pl_name);

  } catch (error) {
    console.error('Network error while fetching exoplanet data:', error);
    // Return null to allow the UI to handle the error state gracefully
    return null;
  }
}
