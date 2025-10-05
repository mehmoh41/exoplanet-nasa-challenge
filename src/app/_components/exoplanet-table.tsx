'use client';

import { useState, useMemo, type ReactNode, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

type SortKey = keyof Exoplanet | '';
type SortDirection = 'asc' | 'desc';

const columns: { key: SortKey; label: string; tooltip: string }[] = [
  { key: 'pl_name', label: 'Name', tooltip: 'Planet Name' },
  { key: 'koi_disposition', label: 'Status', tooltip: 'KOI Disposition' },
  { key: 'koi_score', label: 'Score', tooltip: 'KOI Score' },
  { key: 'pl_orbper', label: 'Period (d)', tooltip: 'Orbital Period (days)' },
  { key: 'pl_rade', label: 'Radius (R⊕)', tooltip: 'Planet Radius (Earth Radii)' },
  { key: 'st_teff', label: 'Star Temp (K)', tooltip: 'Stellar Temperature (K)' },
];

const DispositionBadge = ({ disposition }: { disposition?: string }) => {
  if (!disposition) return null;

  let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  if (disposition === 'CONFIRMED') variant = 'default';
  if (disposition === 'FALSE POSITIVE') variant = 'destructive';

  return <Badge variant={variant}>{disposition.replace(/_/g, ' ')}</Badge>;
};


export function ExoplanetTable({ data }: { data: Exoplanet[] }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('koi_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const debouncedFilter = useDebounce(filter, 300);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10-second loader
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (filter && filter !== debouncedFilter) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [filter, debouncedFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortKey) {
      sortableData.sort((a, b) => {
        const aVal = a[sortKey as keyof Exoplanet];
        const bVal = b[sortKey as keyof Exoplanet];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
             const compare = aVal.localeCompare(bVal);
             return sortDirection === 'asc' ? compare : -compare;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        
        return 0;
      });
    }
    return sortableData;
  }, [data, sortKey, sortDirection]);

  const filteredData = useMemo(() => {
    if (!debouncedFilter) {
      setIsSearching(false);
      return sortedData;
    };
    const results = sortedData.filter(
      (planet) =>
        planet.pl_name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        (planet.koi_disposition && planet.koi_disposition.toLowerCase().replace(/_/, ' ').includes(debouncedFilter.toLowerCase()))
    );
    setIsSearching(false);
    return results;
  }, [sortedData, debouncedFilter]);

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
          placeholder="Filter displayed planets by name or status..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
             <TableRow>
              {columns.map((col, index) => (
                <TableHead key={col.key} title={col.tooltip} className={cn("whitespace-nowrap", index > 0 && "text-center")}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(col.key)}
                    className={cn("mx-auto hover:text-primary", index === 0 && "ml-0")}
                  >
                    {col.label}
                    {renderSortIcon(col.key)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={cn(isSearching && 'animate-pulse opacity-50')}>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((planet) => (
                <TableRow key={planet.pl_name}>
                  <TableCell className="font-medium">{planet.pl_name}</TableCell>
                  <TableCell><DispositionBadge disposition={planet.koi_disposition} /></TableCell>
                  <TableCell className="text-center">{planet.koi_score?.toFixed(3) ?? 'N/A'}</TableCell>
                  <TableCell className="text-center">{planet.pl_orbper?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell className="text-center">{planet.pl_rade?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell className="text-center">{planet.st_teff?.toLocaleString() ?? 'N/A'}</TableCell>
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
