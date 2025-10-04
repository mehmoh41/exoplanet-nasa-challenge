import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="mt-2 h-5 w-80 rounded-md" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20" />
              <Skeleton className="mt-1 h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-2 h-5 w-full max-w-sm" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-6 flex-1" />
                        <Skeleton className="h-6 flex-1" />
                        <Skeleton className="h-6 flex-1" />
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="mt-2 h-5 w-48" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="aspect-square h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
