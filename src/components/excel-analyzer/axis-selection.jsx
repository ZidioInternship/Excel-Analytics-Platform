"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart2, LineChart, PieChartIcon, ScatterChart } from "lucide-react";


const chartTypeOptions = [
  { value: "bar", label: "Bar Chart", icon: <BarChart2 className="h-4 w-4" /> },
  { value: "line", label: "Line Chart", icon: <LineChart className="h-4 w-4" /> },
  { value: "scatter", label: "Scatter Plot", icon: <ScatterChart className="h-4 w-4" /> },
  { value: "pie", label: "Pie Chart", icon: <PieChartIcon className="h-4 w-4" /> },
];

export function AxisSelection({
  headers,
  selectedXAxis,
  selectedYAxis,
  onXAxisChange,
  onYAxisChange,
  chartType,
  onChartTypeChange,
  disabled = false,
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Chart Configuration</Label>
        <p className="text-sm text-muted-foreground">
          Select columns for axes and choose a chart type.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="x-axis-select">X-Axis (Category)</Label>
          <Select
            value={selectedXAxis ?? ""}
            onValueChange={onXAxisChange}
            disabled={disabled || headers.length === 0}
          >
            <SelectTrigger id="x-axis-select" aria-label="Select X-axis">
              <SelectValue placeholder="Select X-axis" />
            </SelectTrigger>
            <SelectContent>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="y-axis-select">Y-Axis (Value)</Label>
          <Select
            value={selectedYAxis ?? ""}
            onValueChange={onYAxisChange}
            disabled={disabled || headers.length === 0 || chartType === 'pie'}
          >
            <SelectTrigger id="y-axis-select" aria-label="Select Y-axis">
              <SelectValue placeholder={chartType === 'pie' ? "N/A for Pie Chart" : "Select Y-axis"} />
            </SelectTrigger>
            <SelectContent>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {chartType === 'pie' && <p className="text-xs text-muted-foreground mt-1">For Pie chart, X-axis is used for labels and Y-axis for values (automatically selected or counts if not numeric).</p>}
        </div>
        <div>
          <Label htmlFor="chart-type-select">Chart Type</Label>
          <Select
            value={chartType}
            onValueChange={(value) => onChartTypeChange(value)}
            disabled={disabled || headers.length === 0}
          >
            <SelectTrigger id="chart-type-select" aria-label="Select chart type">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              {chartTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
