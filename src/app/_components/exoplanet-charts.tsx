'use client';

import type { Exoplanet } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
} from 'recharts';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartConfig = {
  radius: {
    label: 'Radius (R⊕)',
  },
  mass: {
    label: 'Mass (M⊕)',
  },
  temperature: {
    label: 'Star Temp. (K)'
  },
};

export function ExoplanetCharts({ data }: { data: Exoplanet[] }) {
  const massVsRadiusData = useMemo(() => {
    return data
      .filter((p) => p.pl_masse && p.pl_rade)
      .map((p) => ({
        name: p.pl_name,
        mass: p.pl_masse,
        radius: p.pl_rade,
      }));
  }, [data]);
  
  const tempVsRadiusData = useMemo(() => {
    return data
      .filter((p) => p.st_teff && p.pl_rade)
      .map((p) => ({
        name: p.pl_name,
        temperature: p.st_teff,
        radius: p.pl_rade,
      }));
  }, [data]);

  return (
    <Tabs defaultValue="mass-radius" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mass-radius">Mass vs. Radius</TabsTrigger>
        <TabsTrigger value="temp-radius">Temp vs. Radius</TabsTrigger>
      </TabsList>
      <TabsContent value="mass-radius">
        <ChartContainer config={chartConfig} className="aspect-square h-[350px]">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mass"
              type="number"
              name="Mass"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
              label={{ value: "Planet Mass (M⊕)", position: "insideBottom", offset: -25 }}
            />
            <YAxis
              dataKey="radius"
              type="number"
              name="Radius"
              domain={['dataMin', 'dataMax']}
              label={{ value: "Planet Radius (R⊕)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' } }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent
                labelKey="name"
                formatter={(value, name) => [`${(value as number).toFixed(2)}`, chartConfig[name as keyof typeof chartConfig]?.label]}
              />}
            />
            <Scatter name="Exoplanets" data={massVsRadiusData} fill="hsl(var(--accent))" shape="circle" />
          </ScatterChart>
        </ChartContainer>
      </TabsContent>
       <TabsContent value="temp-radius">
        <ChartContainer config={chartConfig} className="aspect-square h-[350px]">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="temperature"
              type="number"
              name="Star Temperature"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
              label={{ value: "Stellar Temperature (K)", position: "insideBottom", offset: -25 }}
            />
            <YAxis
              dataKey="radius"
              type="number"
              name="Radius"
              domain={['dataMin', 'dataMax']}
              label={{ value: "Planet Radius (R⊕)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' } }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent
                labelKey="name"
                formatter={(value, name) => [`${(value as number).toLocaleString()}`, chartConfig[name as keyof typeof chartConfig]?.label]}
              />}
            />
            <Scatter name="Exoplanets" data={tempVsRadiusData} fill="hsl(var(--accent))" shape="circle" />
          </ScatterChart>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  );
}
