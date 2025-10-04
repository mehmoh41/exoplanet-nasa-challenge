import { AnalysisForm } from './_components/analysis-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
         <h1 className="font-headline text-3xl font-bold tracking-tight">Analyze with AI</h1>
         <p className="text-muted-foreground">Upload exoplanet data to get AI-powered insights.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Data Interpretation</CardTitle>
          <CardDescription>
            Upload a CSV or JSON file containing exoplanet data. The AI will analyze it for potential habitability, unique characteristics, and other insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalysisForm />
        </CardContent>
      </Card>
    </div>
  );
}
