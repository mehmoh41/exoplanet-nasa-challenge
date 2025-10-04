import type { Exoplanet } from './types';

const API_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const BASE_QUERY = 'select+pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass+from+pscomppars';

export async function getExoplanets({ offset = 0, limit = 100 }: { offset?: number, limit?: number } = {}): Promise<Exoplanet[] | null> {
  // The API uses TOP for limit, but doesn't have a direct OFFSET.
  // We can't implement true pagination without full data fetch.
  // The prompt asks for chunking, so we will fetch all and slice.
  // This is not ideal, but it's a limitation of the API.
  // A better API would support `OFFSET ... FETCH NEXT ... ROWS ONLY`.
  // For now, to fulfill the request, we fetch everything and 'simulate' pagination.
  // This is inefficient but demonstrates the UI pattern.

  const query = `${BASE_QUERY}`;
  const fullUrl = `${API_URL}?query=${query}&format=json`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 * 24 }, // Revalidate once a day
    });

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`);
      return null;
    }

    const data: any[] = await response.json();
    const filteredData = data.filter((p: any) => p.pl_name);
    
    // Slice the data to simulate pagination
    return filteredData.slice(offset, offset + limit);

  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    return null;
  }
}
