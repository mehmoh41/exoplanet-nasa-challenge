'use client';

import { useState, useMemo, type ReactNode } from 'react';
import type { Exoplanet } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type SortKey = keyof Exoplanet | '';
type SortDirection = 'asc' | 'desc';

const columns: { key: SortKey; label: string; tooltip: string }[] = [
  { key: 'pl_name', label: 'Name', tooltip: 'Planet Name' },
  { key: 'hostname', label: 'Star', tooltip: 'Host Star Name' },
  { key: 'disc_year', label: 'Year', tooltip: 'Discovery Year' },
  { key: 'disc_method', label: 'Method', tooltip: 'Discovery Method' },
  { key: 'pl_orbper', label: 'Period (d)', tooltip: 'Orbital Period (days)' },
  { key: 'pl_rade', label: 'Radius (R⊕)', tooltip: 'Planet Radius (Earth Radii)' },
  { key: 'pl_masse', label: 'Mass (M⊕)', tooltip: 'Planet Mass (Earth Mass)' },
];

export function ExoplanetTable({ data }: { data: Exoplanet[] }) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('disc_year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortKey) {
      sortableData.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortKey, sortDirection]);

  const filteredData = useMemo(() => {
    if (!filter) return sortedData;
    return sortedData.filter(
      (planet) =>
        planet.pl_name.toLowerCase().includes(filter.toLowerCase()) ||
        planet.hostname.toLowerCase().includes(filter.toLowerCase()) ||
        planet.disc_method.toLowerCase().includes(filter.toLowerCase())
    );
  }, [sortedData, filter]);

  const renderSortIcon = (key: SortKey): ReactNode => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter displayed planets by name, star, or method..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} title={col.tooltip} className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(col.key)}
                    className="-ml-4"
                  >
                    {col.label}
                    {renderSortIcon(col.key)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((planet) => (
                <TableRow key={planet.pl_name}>
                  <TableCell className="font-medium">{planet.pl_name}</TableCell>
                  <TableCell>{planet.hostname}</TableCell>
                  <TableCell>{planet.disc_year}</TableCell>
                  <TableCell className="truncate max-w-40">{planet.disc_method}</TableCell>
                  <TableCell className="text-right">{planet.pl_orbper?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell className="text-right">{planet.pl_rade?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell className="text-right">{planet.pl_masse?.toFixed(2) ?? 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
