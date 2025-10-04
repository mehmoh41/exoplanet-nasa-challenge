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
import { Orbit, Globe, Sparkles, CalendarClock, Terminal } from 'lucide-react';
import { getExoplanets } from '@/lib/api';
import Loading from './loading';

export default function ExplorePage() {
  const [allPlanets, setAllPlanets] = useState<Exoplanet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getExoplanets();
        if (data) {
          setAllPlanets(data);
        } else {
          setError('Could not load exoplanet data from the local file. Please ensure src/lib/exoplanet.csv exists.');
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
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPlanets = allPlanets.length;
  const terrestrialPlanets = allPlanets.filter(
    (p) => p.pl_rade && p.pl_rade < 2
  ).length;
  const gasGiants = allPlanets.filter(
    (p) => p.pl_masse && p.pl_masse > 10
  ).length;
  const latestDiscoveryYear = Math.max(
    ...allPlanets.map((p) => p.disc_year).filter(y => y)
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
              Total Confirmed
            </CardTitle>
            <Orbit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPlanets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">planets found</p>
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
            <p className="text-xs text-muted-foreground">planets with radius &lt; 2 R⊕</p>
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
            <p className="text-xs text-muted-foreground">planets with mass &gt; 10 M⊕</p>
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
            <p className="text-xs text-muted-foreground">most recent discovery year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Exoplanet Database</CardTitle>
            <CardDescription>
              Displaying {allPlanets.length} exoplanets. Click headers to sort.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ExoplanetTable data={allPlanets} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            <CardDescription>Relationships in exoplanet data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExoplanetCharts data={allPlanets} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
