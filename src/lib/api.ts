import type { Exoplanet } from './types';

const API_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

// Base columns for the query
const BASE_COLUMNS = 'pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass';

export async function getExoplanets({ offset = 0, limit = 300 }: { offset?: number, limit?: number } = {}): Promise<Exoplanet[] | null> {
  // A simplified query to fetch the most recent discoveries.
  // The API has shown to be unstable with more complex queries involving offsets.
  // This approach prioritizes stability.
  const query = `select+TOP+${limit}+${BASE_COLUMNS}+from+pscomppars+where+pl_masse+is+not+null+and+pl_rade+is+not+null+order+by+disc_year+desc,pl_name+asc`;
  const fullUrl = `${API_URL}?query=${query}&format=json`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 * 24 }, // Revalidate once a day
    });

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`);
      const errorText = await response.text();
      console.error(`API Error details: ${errorText}`);
      return null;
    }

    const data: any[] = await response.json();
    
    // Filter out entries without a planet name as they are not useful
    const filteredData = data.filter((p: any) => p.pl_name);
    
    // With the simplified query, offset logic is handled by slicing the result from the single reliable fetch.
    if (offset > 0 && offset >= filteredData.length) {
      return []; // Return empty if offset is beyond the fetched data
    }
    
    return filteredData.slice(offset, offset + limit);

  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    return null;
  }
}
