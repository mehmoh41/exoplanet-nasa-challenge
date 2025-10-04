'use client';

import type { Exoplanet } from '@/lib/types';
import { ExoplanetTable } from './exoplanet-table';
import { ExoplanetCharts } from './exoplanet-charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Orbit, Globe, Sparkles, CheckCircle, Terminal } from 'lucide-react';

export function ExploreClientPage({ allPlanets }: { allPlanets: Exoplanet[] }) {
  if (!allPlanets || allPlanets.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            Could not load exoplanet data from the local file. Please ensure src/lib/exoplanet.csv exists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPlanets = allPlanets.length;
  const confirmedPlanets = allPlanets.filter(
    (p) => p.koi_disposition === 'CONFIRMED'
  ).length;
  const candidatePlanets = allPlanets.filter(
    (p) => p.koi_disposition === 'CANDIDATE'
  ).length;
   const terrestrialPlanets = allPlanets.filter(
    (p) => p.pl_rade && p.pl_rade < 2 && p.koi_disposition === 'CONFIRMED'
  ).length;


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Explore Kepler Objects of Interest
        </h1>
        <p className="text-muted-foreground">
          An interactive catalog of worlds beyond our solar system from the Kepler mission.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Objects
            </CardTitle>
            <Orbit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPlanets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">in the Kepler dataset</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Planets
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {confirmedPlanets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">verified exoplanets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planet Candidates</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidatePlanets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Terrestrial
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terrestrialPlanets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">planets with radius &lt; 2 R⊕</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Kepler Object of Interest (KOI) Database</CardTitle>
            <CardDescription>
              Displaying {allPlanets.length} objects. Default sort by KOI score.
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
