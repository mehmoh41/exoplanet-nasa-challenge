'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { performAnalysis, type AnalysisState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, FileText, Loader2, Sparkles, Wand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
         <Sparkles className="mr-2 h-4 w-4" />
          Analyze Data
        </>
      )}
    </Button>
  );
}

function AnalysisResults({ state, pending }: { state: AnalysisState, pending: boolean }) {
    if (pending) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-48">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p>AI is processing the data...</p>
            </div>
        )
    }

    if (!state.results) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-48">
                <p>Analysis results will appear here.</p>
            </div>
        );
    }
    
    // Check if results is a string (general analysis) or object (light curve)
    if (typeof state.results === 'string') {
        return (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                {state.results}
            </div>
        );
    }

    if (typeof state.results === 'object' && state.results.analysisSummary) {
        return (
          <div className="space-y-4">
             <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                <h3 className="font-headline text-base">Analysis Summary</h3>
                <p>{state.results.analysisSummary}</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Processed Data</CardTitle>
                    <CardDescription>{state.results.processedData.length} data points processed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Showing first 5 rows.</p>
                     <pre className="mt-2 text-xs overflow-auto rounded-md bg-muted p-4">
                        {JSON.stringify(state.results.processedData.slice(0,5), null, 2)}
                    </pre>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Time Windows</CardTitle>
                    <CardDescription>{state.results.timeWindows.length} uniform segments created.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-xs text-muted-foreground">Showing first 2 windows.</p>
                     <pre className="mt-2 text-xs overflow-auto rounded-md bg-muted p-4">
                        {JSON.stringify(state.results.timeWindows.slice(0,2), null, 2)}
                    </pre>
                </CardContent>
             </Card>
          </div>
        )
    }

    return null;
}


export function AnalysisForm() {
  const initialState: AnalysisState = { message: '' };
  const [state, formAction] = useActionState(performAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.message && state.message !== 'Analysis complete.') {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.message,
      });
    }
    if (state.message === 'Analysis complete.') {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form action={formAction} ref={formRef} className="space-y-6">
        <div className="space-y-2">
            <Label>Analysis Type</Label>
            <RadioGroup name="analysisType" defaultValue="general" className="grid grid-cols-2 gap-4">
                 <div>
                    <RadioGroupItem value="general" id="general" className="peer sr-only" />
                    <Label htmlFor="general" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Bot className="mb-3 h-6 w-6" />
                        General Analysis
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="light_curve" id="light_curve" className="peer sr-only" />
                    <Label htmlFor="light_curve" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Wand className="mb-3 h-6 w-6" />
                        Light Curve
                    </Label>
                </div>
            </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataFile">Exoplanet Data File</Label>
          <div className="relative">
            <Input id="dataFile" name="dataFile" type="file" required accept=".csv,.json" className="pl-10" />
            <FileText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
          {state.errors?.dataFile && (
            <p className="text-sm font-medium text-destructive">{state.errors.dataFile[0]}</p>
          )}
        </div>
        <SubmitButton />
      </form>
      
      <div className="relative">
        <Card className="h-full min-h-[250px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot />
                    AI Analysis Results
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AnalysisResults state={state} pending={pending} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
