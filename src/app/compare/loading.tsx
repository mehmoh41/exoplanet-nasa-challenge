import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompareLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="mt-2 h-5 w-96 rounded-md" />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <Card>
                <CardHeader>
                    <Skeleton className="aspect-[3/2] w-full mb-4" />
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-48 mt-1" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="aspect-[3/2] w-full mb-4" />
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-48 mt-1" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    </div>
    </div>
  );
}
