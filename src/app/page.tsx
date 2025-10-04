import type { Exoplanet } from '@/lib/types';
import { ExoplanetTable } from './_components/exoplanet-table';
import { ExoplanetCharts } from './_components/exoplanet-charts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Orbit, Globe, Sparkles, CalendarClock, Terminal } from 'lucide-react';

async function getExoplanets(): Promise<Exoplanet[]> {
  try {
    const response = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass+from+pscomppars&format=json', {
      next: { revalidate: 3600 * 24 } // Revalidate once a day
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    // Filter out entries where critical data is missing
    return data.filter((p: any) => p.pl_name);
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    return [];
  }
}


export default async function ExplorePage() {
  const planets = await getExoplanets();

  if (!planets.length) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>
            Could not fetch exoplanet data from the NASA Exoplanet Archive. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const totalPlanets = planets.length;
  const terrestrialPlanets = planets.filter(p => p.pl_rade && p.pl_rade < 2).length;
  const gasGiants = planets.filter(p => p.pl_masse && p.pl_masse > 10).length;
  const latestDiscoveryYear = Math.max(...planets.map(p => p.disc_year));

  return (
    <div className="flex flex-col gap-6">
       <div>
         <h1 className="font-headline text-3xl font-bold tracking-tight">Explore Exoplanets</h1>
         <p className="text-muted-foreground">An interactive catalog of worlds beyond our solar system.</p>
       </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Confirmed</CardTitle>
            <Orbit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlanets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">planets discovered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terrestrial Candidates</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terrestrialPlanets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">with radius &lt; 2 R⊕</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Giants</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gasGiants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">with mass &gt; 10 M⊕</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Discoveries</CardTitle>
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
            <CardDescription>Browse all confirmed exoplanets. Click headers to sort.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExoplanetTable data={planets} />
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
