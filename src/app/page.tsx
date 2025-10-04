import type { Exoplanet } from '@/lib/types';
import { getExoplanets } from '@/lib/data';
import { ExploreClientPage } from './_components/explore-client-page';

export default async function ExplorePage() {
  const allPlanets: Exoplanet[] = await getExoplanets();

  if (!allPlanets || allPlanets.length === 0) {
    // This case will be handled by the error boundary, or you can return a specific error component.
    // For now, we'll let the child component show a "No results" message.
    return <ExploreClientPage allPlanets={[]} />;
  }

  return <ExploreClientPage allPlanets={allPlanets} />;
}
