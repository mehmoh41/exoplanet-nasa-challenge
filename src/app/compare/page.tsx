import type { Exoplanet } from '@/lib/types';
import { ComparisonTool } from './_components/comparison-tool';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

async function getExoplanets(): Promise<Exoplanet[]> {
  try {
    const response = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass+from+pscomppars&format=json', {
      next: { revalidate: 3600 * 24 } // Revalidate once a day
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.filter((p: any) => p.pl_name);
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    return [];
  }
}

export default async function ComparePage() {
  const planets = await getExoplanets();

  return (
    <div className="flex flex-col gap-6">
       <div>
         <h1 className="font-headline text-3xl font-bold tracking-tight">Compare Planets</h1>
         <p className="text-muted-foreground">Select two exoplanets to see a side-by-side comparison of their properties.</p>
       </div>
       {planets.length > 0 ? (
        <ComparisonTool planets={planets} />
       ) : (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>
              Could not fetch exoplanet data for comparison. Please try again later.
            </AlertDescription>
         </Alert>
       )}
    </div>
  );
}
