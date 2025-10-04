'use client';

import { useState, useEffect } from 'react';
import type { Exoplanet } from '@/lib/types';
import { ComparisonTool } from './_components/comparison-tool';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { getExoplanets } from '@/lib/api';
import CompareLoading from './loading';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const CHUNK_SIZE = 300;

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const initialData = await getExoplanets({ limit: CHUNK_SIZE });
        if (initialData) {
          setPlanets(initialData);
          if (initialData.length < CHUNK_SIZE) {
            setHasMore(false);
          }
        } else {
          setError('Could not fetch exoplanet data for comparison.');
        }
      } catch (e) {
        console.error(e);
        setError('Could not fetch exoplanet data for comparison.');
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore || isAppending) return;

    setIsAppending(true);
    try {
      const response = await fetch('/api/exoplanets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offset: planets.length, limit: CHUNK_SIZE }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch more planets');
      }
      const newPlanets: Exoplanet[] = await response.json();
      setPlanets((prev) => [...prev, ...newPlanets]);
      if (newPlanets.length < CHUNK_SIZE) {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      // Optionally, set an error state to show a toast
    } finally {
      setIsAppending(false);
    }
  };

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
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <ComparisonTool 
            planets={planets}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isAppending={isAppending}
        />
      )}
    </div>
  );
}
