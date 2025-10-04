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
  Legend
} from 'recharts';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartConfig = {
  radius: {
    label: 'Radius (R⊕)',
  },
  orbital_period: {
    label: 'Orbital Period (days)',
  },
  temperature: {
    label: 'Equilibrium Temp. (K)'
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'hsl(var(--chart-1))',
  },
  CANDIDATE: {
    label: 'Candidate',
    color: 'hsl(var(--chart-2))',
  },
  'FALSE POSITIVE': {
    label: 'False Positive',
    color: 'hsl(var(--chart-4))',
  },
};

export function ExoplanetCharts({ data }: { data: Exoplanet[] }) {
  const confirmed = useMemo(() => data.filter(p => p.koi_disposition === 'CONFIRMED' && p.pl_orbper && p.pl_rade), [data]);
  const candidates = useMemo(() => data.filter(p => p.koi_disposition === 'CANDIDATE' && p.pl_orbper && p.pl_rade), [data]);
  const falsePositives = useMemo(() => data.filter(p => p.koi_disposition === 'FALSE POSITIVE' && p.pl_orbper && p.pl_rade), [data]);

  const tempVsRadiusConfirmed = useMemo(() => data.filter(p => p.koi_disposition === 'CONFIRMED' && p.koi_teq && p.pl_rade), [data]);
  const tempVsRadiusCandidates = useMemo(() => data.filter(p => p.koi_disposition === 'CANDIDATE' && p.koi_teq && p.pl_rade), [data]);
  
  return (
    <Tabs defaultValue="period-radius" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="period-radius">Period vs. Radius</TabsTrigger>
        <TabsTrigger value="temp-radius">Temp vs. Radius</TabsTrigger>
      </TabsList>
      <TabsContent value="period-radius">
        <ChartContainer config={chartConfig} className="aspect-square h-[350px]">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="pl_orbper"
              type="number"
              name="Orbital Period"
              domain={['dataMin', 'dataMax']}
               scale="log"
              tickFormatter={(value) => value.toLocaleString()}
              label={{ value: "Orbital Period (days, log scale)", position: "insideBottom", offset: -25 }}
            />
            <YAxis
              dataKey="pl_rade"
              type="number"
              name="Radius"
              domain={['dataMin', 'dataMax']}
              scale="log"
              label={{ value: "Planet Radius (R⊕, log scale)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' } }}
               tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent
                labelKey="pl_name"
                formatter={(value, name, props) => {
                  const { payload } = props;
                  if (name === 'CONFIRMED' || name === 'CANDIDATE' || name === 'FALSE POSITIVE') {
                    return [
                        `Radius: ${(payload.pl_rade as number).toFixed(2)} R⊕`,
                        `Period: ${(payload.pl_orbper as number).toFixed(2)} days`,
                    ]
                  }
                  return [];
                }}
              />}
            />
             <Legend />
            <Scatter name="CONFIRMED" data={confirmed} fill={chartConfig.CONFIRMED.color} shape="circle" />
            <Scatter name="CANDIDATE" data={candidates} fill={chartConfig.CANDIDATE.color} shape="circle" />
            <Scatter name="FALSE POSITIVE" data={falsePositives} fill={chartConfig['FALSE POSITIVE'].color} shape="triangle" opacity={0.5} />
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
              dataKey="koi_teq"
              type="number"
              name="Equilibrium Temperature"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
              label={{ value: "Equilibrium Temperature (K)", position: "insideBottom", offset: -25 }}
            />
            <YAxis
              dataKey="pl_rade"
              type="number"
              name="Radius"
              scale="log"
              domain={['dataMin', 'dataMax']}
              label={{ value: "Planet Radius (R⊕, log scale)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' } }}
               tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent
                labelKey="pl_name"
                 formatter={(value, name, props) => {
                  const { payload } = props;
                  if (name === 'CONFIRMED' || name === 'CANDIDATE') {
                    return [
                        `Radius: ${(payload.pl_rade as number).toFixed(2)} R⊕`,
                        `Temp: ${(payload.koi_teq as number).toLocaleString()} K`,
                    ]
                  }
                  return [];
                }}
              />}
            />
            <Legend />
            <Scatter name="CONFIRMED" data={tempVsRadiusConfirmed} fill={chartConfig.CONFIRMED.color} shape="circle" />
            <Scatter name="CANDIDATE" data={tempVsRadiusCandidates} fill={chartConfig.CANDIDATE.color} shape="circle" />
          </ScatterChart>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  );
}
