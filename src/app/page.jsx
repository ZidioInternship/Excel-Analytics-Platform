"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { FileUpload } from "@/components/excel-analyzer/file-upload";
import { AxisSelection } from "@/components/excel-analyzer/axis-selection";
import { ChartDisplay } from "@/components/excel-analyzer/chart-display";
import { SmartInsights } from "@/components/excel-analyzer/smart-insights";
import { Download, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ExcelAnalyzerPage() {
  const [excelData, setExcelData] = useState(null);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState(null);
  const [selectedYAxis, setSelectedYAxis] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [fileStringContent, setFileStringContent] = useState(null);
  
  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isDownloadingChart, setIsDownloadingChart] = useState(false);

  const chartRef = useRef(null);

  const handleFileUpload = (
    data,
    headers,
    fileString
  ) => {
    setExcelData(data);
    setColumnHeaders(headers);
    setFileStringContent(fileString);
    // Reset selections
    setSelectedXAxis(null);
    setSelectedYAxis(null);
    setInsights(null);
    if (headers.length > 0) {
      setSelectedXAxis(headers[0]); // Default X-axis
      if (headers.length > 1) {
        setSelectedYAxis(headers[1]); // Default Y-axis
      }
    }
  };

  const handleDownloadChart = async () => {
    if (!chartRef.current) return;
    setIsDownloadingChart(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null, 
        useCORS: true, 
      });
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${chartType}-chart.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading chart:", error);
      // Add toast notification for error
    } finally {
      setIsDownloadingChart(false);
    }
  };
  
  const canRenderChart = excelData && selectedXAxis && (chartType === 'pie' || selectedYAxis);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <header className="py-6 px-4 md:px-8 border-b">
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Excel Insights Analyzer
          </h1>
        </header>

        <main className="container mx-auto p-4 md:p-8 space-y-8">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <FileUpload onFileUpload={handleFileUpload} setIsLoadingFile={setIsLoadingFile} />
            </CardContent>
          </Card>

          {isLoadingFile && (
            <div className="flex items-center justify-center p-8 text-lg">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-accent" />
              Processing your file, please wait...
            </div>
          )}

          {excelData && columnHeaders.length > 0 && !isLoadingFile && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card className="shadow-xl rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                      <AxisSelection
                        headers={columnHeaders}
                        selectedXAxis={selectedXAxis}
                        selectedYAxis={selectedYAxis}
                        onXAxisChange={setSelectedXAxis}
                        onYAxisChange={setSelectedYAxis}
                        chartType={chartType}
                        onChartTypeChange={setChartType}
                        disabled={!excelData}
                      />
                    </CardContent>
                  </Card>
                  
                  {canRenderChart && (
                     <Card className="shadow-xl rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                           <ChartDisplay
                            ref={chartRef}
                            data={excelData}
                            xAxisKey={selectedXAxis}
                            yAxisKey={selectedYAxis}
                            chartType={chartType}
                            />
                            <div className="mt-6 flex justify-end">
                            <Button onClick={handleDownloadChart} disabled={isDownloadingChart}>
                                {isDownloadingChart ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                <Download className="mr-2 h-4 w-4" />
                                )}
                                Download Chart
                            </Button>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {!canRenderChart && (
                     <Card className="shadow-xl rounded-xl min-h-[300px] flex items-center justify-center">
                        <CardContent className="text-center text-muted-foreground p-6">
                           <p className="text-lg">Select X and Y axes to view the chart.</p>
                        </CardContent>
                     </Card>
                  )}
                </div>

                <div className="lg:col-span-1">
                   <SmartInsights
                    fileContent={fileStringContent}
                    insights={insights}
                    setInsights={setInsights}
                    isLoadingInsights={isLoadingInsights}
                    setIsLoadingInsights={setIsLoadingInsights}
                  />
                </div>
              </div>
            </>
          )}
        </main>
        <Toaster />
         <footer className="py-6 px-4 md:px-8 border-t mt-12 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Excel Insights Analyzer. All rights reserved.
        </footer>
      </div>
    </>
  );
}
