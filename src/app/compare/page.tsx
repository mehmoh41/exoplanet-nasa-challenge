'use client';

import { useState, useEffect } from 'react';
import type { Exoplanet } from '@/lib/types';
import { ComparisonTool } from './_components/comparison-tool';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { getExoplanets } from '@/lib/api';
import CompareLoading from './loading';

export default function ComparePage() {
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getExoplanets();
        if (data) {
          setPlanets(data);
        } else {
          setError('Could not load exoplanet data. The data file might be missing or corrupted.');
        }
      } catch (e) {
        console.error(e);
        setError('An unexpected error occurred while loading exoplanet data.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <CompareLoading />;
  }

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
      {error ? (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <ComparisonTool planets={planets} />
      )}
    </div>
  );
}
