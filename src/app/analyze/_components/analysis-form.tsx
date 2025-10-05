'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { performAnalysis, type AnalysisState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, FileText, Loader2, Sparkles, Microscope, CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

function DispositionBadge({ disposition, score }: { disposition?: string, score?: number }) {
  if (!disposition) return null;

  let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  let Icon = HelpCircle;
  if (disposition === 'CONFIRMED') {
    variant = 'default';
    Icon = CheckCircle;
  }
  if (disposition === 'FALSE POSITIVE') {
    variant = 'destructive';
    Icon = XCircle;
  }

  return <Badge variant={variant} className="text-base font-semibold">
      <Icon className="mr-2 h-4 w-4" />
      {disposition.replace(/_/g, ' ')}
      {score && ` (${(score * 100).toFixed(1)}%)`}
    </Badge>;
};


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
    
    // Check for Candidate Analysis result
    if (typeof state.results === 'object' && state.results.predicted_disposition) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">AI Predicted Disposition</p>
            <DispositionBadge disposition={state.results.predicted_disposition} score={state.results.confidence_score} />
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4 className="font-headline">Rationale</h4>
            <p>{state.results.rationale}</p>
            <h4 className="font-headline">Key Indicators</h4>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Significance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.results.key_indicators.map((indicator: any) => (
                <TableRow key={indicator.parameter}>
                  <TableCell className="font-mono text-xs">{indicator.parameter}</TableCell>
                  <TableCell className="font-medium">{indicator.value}</TableCell>
                  <TableCell>{indicator.significance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    }

    // Check if results is a string (general analysis)
    if (typeof state.results === 'string') {
        return (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                {state.results}
            </div>
        );
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
        // Do not reset the form, so the user can see the file they uploaded.
        // formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form action={formAction} ref={formRef} className="space-y-6">
        <div className="space-y-2">
            <Label>Analysis Type</Label>
            <RadioGroup name="analysisType" defaultValue="general" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <RadioGroupItem value="general" id="general" className="peer sr-only" />
                    <Label htmlFor="general" className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Bot className="mb-3 h-6 w-6" />
                        General Summary
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="candidate_analysis" id="candidate_analysis" className="peer sr-only" />
                    <Label htmlFor="candidate_analysis" className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Microscope className="mb-3 h-6 w-6" />
                        Planet Candidate
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
          <p className="text-xs text-muted-foreground">For Candidate Analysis, upload a CSV with the first data row being the planet to analyze.</p>
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
