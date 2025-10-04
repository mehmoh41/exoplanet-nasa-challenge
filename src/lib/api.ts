import type { Exoplanet } from './types';

const API_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

// Base columns for the query
const BASE_COLUMNS = 'pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass';

export async function getExoplanets({ offset = 0, limit = 100 }: { offset?: number, limit?: number } = {}): Promise<Exoplanet[] | null> {
  // The API doesn't support OFFSET. We can only fetch the top N records.
  // For pagination, we'll fetch `offset + limit` records and slice them on the client-side.
  // This is inefficient but a workaround for the API's limitations.
  const top = offset + limit;
  const query = `select+TOP+${top}+${BASE_COLUMNS}+from+pscomppars+order+by+disc_year+desc,pl_name+asc`;
  const fullUrl = `${API_URL}?query=${query}&format=json`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 * 24 }, // Revalidate once a day
    });

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`);
      const errorText = await response.text();
      console.error(`API Error details: ${errorText}`);
      throw new Error(`Failed to fetch exoplanet data: ${response.statusText}`);
    }

    const data: any[] = await response.json();
    
    // Filter out entries without a planet name as they are not useful
    const filteredData = data.filter((p: any) => p.pl_name);
    
    // Return only the requested slice
    return filteredData.slice(offset);

  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    // Re-throwing the error to be handled by the calling component
    throw error;
  }
}
