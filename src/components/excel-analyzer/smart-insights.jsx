"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { summarizeExcelData } from "@/ai/flows/summarize-excel-data.js"; // Ensure .js extension
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SmartInsights({
  fileContent,
  insights,
  setInsights,
  isLoadingInsights,
  setIsLoadingInsights,
}) {
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    if (!fileContent) {
      toast({
        title: "No Data",
        description: "Please upload an Excel file first to generate insights.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingInsights(true);
    setInsights(null); 
    try {
      const result = await summarizeExcelData({ excelData: fileContent });
      setInsights(result.summary);
      toast({
        title: "Insights Generated",
        description: "AI-powered summary is ready.",
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error Generating Insights",
        description: "Could not generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Smart Insights</CardTitle>
        <CardDescription>
          Get AI-powered summary of your Excel data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateInsights}
          disabled={!fileContent || isLoadingInsights}
          className="w-full"
        >
          {isLoadingInsights ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Insights
        </Button>
        {isLoadingInsights && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Generating summary...</p>
          </div>
        )}
        {insights && (
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">AI Summary:</h3>
            <Textarea
              value={insights}
              readOnly
              className="min-h-[150px] bg-muted/50 text-sm"
              aria-label="AI generated summary"
            />
          </div>
        )}
        {!insights && !isLoadingInsights && fileContent && (
           <p className="text-sm text-center text-muted-foreground py-4">Click "Generate Insights" to see an AI summary of your data.</p>
        )}
         {!insights && !isLoadingInsights && !fileContent && (
           <p className="text-sm text-center text-muted-foreground py-4">Upload a file to enable insight generation.</p>
        )}
      </CardContent>
    </Card>
  );
}
