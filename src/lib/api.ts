import type { Exoplanet } from './types';

const API_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

// Base columns for the query
const BASE_COLUMNS = 'pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass';

export async function getExoplanets({ offset = 0, limit = 100 }: { offset?: number, limit?: number } = {}): Promise<Exoplanet[] | null> {
  // The API doesn't support a direct OFFSET keyword.
  // We fetch all records up to the desired point (offset + limit).
  const top = offset + limit;
  // Filter for planets with mass and radius for more interesting default results.
  const query = `select+TOP+${top}+${BASE_COLUMNS}+from+pscomppars+where+pl_masse+is+not+null+and+pl_rade+is+not+null+order+by+disc_year+desc,pl_name+asc`;
  const fullUrl = `${API_URL}?query=${query}&format=json`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 * 24 }, // Revalidate once a day
    });

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`);
      const errorText = await response.text();
      console.error(`API Error details: ${errorText}`);
      // Return null to allow the UI to handle the error state.
      return null;
    }

    const data: any[] = await response.json();
    
    // Filter out entries without a planet name as they are not useful
    const filteredData = data.filter((p: any) => p.pl_name);
    
    // Return only the requested slice (the 'page' of data)
    return filteredData.slice(offset, offset + limit);

  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    // Return null on network error to allow UI to handle it gracefully
    return null;
  }
}
