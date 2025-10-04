import type { Exoplanet } from '@/lib/types';
import { ComparisonTool } from './_components/comparison-tool';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { getExoplanets } from '@/lib/data';

export default async function ComparePage() {
  const planets: Exoplanet[] = await getExoplanets();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Compare Planets
        </h1>
        <p className="text-muted-foreground">
          Select two exoplanets to see a side-by-side comparison of their
          properties.
        </p>
      </div>
      {!planets || planets.length === 0 ? (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>Could not load exoplanet data from the local file. Please ensure src/lib/exoplanet.csv exists.</AlertDescription>
        </Alert>
      ) : (
        <ComparisonTool planets={planets} />
      )}
    </div>
  );
}
