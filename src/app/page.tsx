'use client';

import { useState, useEffect } from 'react';
import type { Exoplanet } from '@/lib/types';
import { ExoplanetTable } from './_components/exoplanet-table';
import { ExoplanetCharts } from './_components/exoplanet-charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Orbit, Globe, Sparkles, CalendarClock, Terminal, Loader2 } from 'lucide-react';
import { getExoplanets } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Loading from './loading';

export default function ExplorePage() {
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [initialPlanets, setInitialPlanets] = useState<Exoplanet[]>([]);
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
            setInitialPlanets(initialData);
            if (initialData.length < CHUNK_SIZE) {
                setHasMore(false);
            }
        } else {
            setError('Could not fetch exoplanet data from the NASA Exoplanet Archive. Please try again later.');
        }
      } catch (e) {
        console.error(e);
        setError('Could not fetch exoplanet data from the NASA Exoplanet Archive. Please try again later.');
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
            body: JSON.stringify({ offset: planets.length, limit: CHUNK_SIZE })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch more planets');
        }
        const newPlanets: Exoplanet[] = await response.json();
        setPlanets(prev => [...prev, ...newPlanets]);
        if (newPlanets.length < CHUNK_SIZE) {
            setHasMore(false);
        }
    } catch (e) {
        console.error(e);
        // Optionally, set an error state to show a toast
    } finally {
        setIsAppending(false);
    }
  }


  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPlanets = initialPlanets.length;
  const terrestrialPlanets = initialPlanets.filter(
    (p) => p.pl_rade && p.pl_rade < 2
  ).length;
  const gasGiants = initialPlanets.filter(
    (p) => p.pl_masse && p.pl_masse > 10
  ).length;
  const latestDiscoveryYear = Math.max(
    ...initialPlanets.map((p) => p.disc_year).filter(y => y)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Explore Exoplanets
        </h1>
        <p className="text-muted-foreground">
          An interactive catalog of worlds beyond our solar system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Displayed
            </CardTitle>
            <Orbit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {planets.length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">planets shown</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Terrestrial Candidates
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {terrestrialPlanets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">in first ~300 entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Giants</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gasGiants.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">in first ~300 entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Discoveries
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestDiscoveryYear}</div>
            <p className="text-xs text-muted-foreground">most recent in first ~300</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Exoplanet Database</CardTitle>
            <CardDescription>
              Browse confirmed exoplanets. Click headers to sort.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ExoplanetTable data={planets} />
            {hasMore && (
                <div className="flex justify-center">
                    <Button onClick={handleLoadMore} disabled={isAppending}>
                        {isAppending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : "Load More"}
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            <CardDescription>Relationships in exoplanet data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExoplanetCharts data={planets} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
