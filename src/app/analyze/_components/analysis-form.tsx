'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { performAnalysis, type AnalysisState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

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

export function AnalysisForm() {
  const initialState: AnalysisState = { message: '' };
  const [state, formAction] = useFormState(performAnalysis, initialState);
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
                {pending && (
                     <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        <p>AI is processing the data...</p>
                     </div>
                )}
                {!pending && state.results && (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                        {state.results}
                    </div>
                )}
                {!pending && !state.results && (
                     <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-48">
                        <p>Analysis results will appear here.</p>
                     </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
