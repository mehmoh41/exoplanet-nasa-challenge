'use client';

import { useState, useRef } from 'react';
import type { Exoplanet } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

function PlanetCard({ planet, imageSeed }: { planet: Exoplanet, imageSeed: string }) {
    const planetImage = {
        imageUrl: `https://picsum.photos/seed/${imageSeed}/600/400`,
        imageHint: planet.pl_masse && planet.pl_masse > 10 ? 'gas giant' : 'rocky planet'
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="relative aspect-[3/2] w-full mb-4 overflow-hidden rounded-lg">
                    <Image 
                        src={planetImage.imageUrl} 
                        alt={`Artist's impression of ${planet.pl_name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={planetImage.imageHint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                <CardTitle>{planet.pl_name}</CardTitle>
                <CardDescription>Host Star: {planet.hostname}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm flex-grow">
                <div>
                    <p className="text-muted-foreground">Discovered</p>
                    <p className="font-medium">{planet.disc_year}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Method</p>
                    <p className="font-medium truncate">{planet.disc_method}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Orbital Period</p>
                    <p className="font-medium">{planet.pl_orbper ? `${planet.pl_orbper.toFixed(2)} days` : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Radius (R⊕)</p>
                    <p className="font-medium">{planet.pl_rade ? `${planet.pl_rade.toFixed(2)}` : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Mass (M⊕)</p>
                    <p className="font-medium">{planet.pl_masse ? `${planet.pl_masse.toFixed(2)}` : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Star Temp.</p>
                    <p className="font-medium">{planet.st_teff ? `${planet.st_teff.toLocaleString()} K` : 'N/A'}</p>
                </div>
            </CardContent>
        </Card>
    );
}


function PlanetSelector({ 
    planets, 
    onSelect, 
    selectedValue,
}: { 
    planets: Exoplanet[], 
    onSelect: (name: string) => void, 
    selectedValue?: string,
}) {
  const [search, setSearch] = useState('');

  const filteredPlanets = planets.filter(p => p.pl_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Select onValueChange={onSelect} value={selectedValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a planet..." />
      </SelectTrigger>
      <SelectContent>
         <div className="p-2">
            <Input 
                placeholder="Search planets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />
         </div>
        <ScrollArea className="h-72">
          {filteredPlanets.map((p) => (
            <SelectItem key={p.pl_name} value={p.pl_name}>
              {p.pl_name}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}

export function ComparisonTool({ 
    planets, 
}: { 
    planets: Exoplanet[],
}) {
  const [planet1, setPlanet1] = useState<Exoplanet | null>(null);
  const [planet2, setPlanet2] = useState<Exoplanet | null>(null);

  const findPlanet = (name: string) => planets.find(p => p.pl_name === name) || null;

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlanetSelector 
                planets={planets} 
                onSelect={(name) => setPlanet1(findPlanet(name))} 
                selectedValue={planet1?.pl_name}
            />
            <PlanetSelector 
                planets={planets} 
                onSelect={(name) => setPlanet2(findPlanet(name))} 
                selectedValue={planet2?.pl_name} 
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div>
                {planet1 ? <PlanetCard planet={planet1} imageSeed="planet1" /> : <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground"><p>Select Planet 1</p></div>}
            </div>
            <div>
                {planet2 ? <PlanetCard planet={planet2} imageSeed="planet2" /> : <div className="flex h-full min-h-[400px_] items-center justify-center rounded-lg border border-dashed text-muted-foreground"><p>Select Planet 2</p></div>}
            </div>
        </div>
    </div>
  );
}
