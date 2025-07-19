"use client";

import { forwardRef } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const ChartDisplay = forwardRef(
  ({ data, xAxisKey, yAxisKey, chartType }, ref) => {
    if (!xAxisKey || (chartType !== 'pie' && !yAxisKey) || data.length === 0) {
      return (
        <Card className="min-h-[400px] flex items-center justify-center">
          <CardContent className="text-center text-muted-foreground">
            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No chart to display</p>
            <p>Please upload data and select axes to generate a chart.</p>
          </CardContent>
        </Card>
      );
    }

    const chartData = data.map((row) => ({
      ...row,
      [xAxisKey]: row[xAxisKey],
      ...(yAxisKey && { [yAxisKey]: typeof row[yAxisKey] === 'string' ? parseFloat(row[yAxisKey]) : row[yAxisKey] }),
    }));
    
    const pieChartData = chartData.map(d => ({
      name: String(d[xAxisKey]),
      value: yAxisKey && typeof d[yAxisKey] === 'number' ? d[yAxisKey] : 1 
    })).reduce((acc, curr) => { 
        const existing = acc.find(item => item.name === curr.name);
        if (existing) {
            existing.value += curr.value;
        } else {
            acc.push({ name: curr.name, value: curr.value });
        }
        return acc;
    }, []);


    const chartConfig = {
      [yAxisKey || xAxisKey]: { 
        label: yAxisKey || xAxisKey,
        color: COLORS[0],
      },
    };
    if (chartType === 'pie' && xAxisKey) {
      chartConfig[xAxisKey] = { label: xAxisKey, color: COLORS[0]};
    }


    const renderChart = () => {
      switch (chartType) {
        case "bar":
          return (
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar dataKey={yAxisKey} fill="var(--color-value)" radius={4} />
            </BarChart>
          );
        case "line":
          return (
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey={yAxisKey} stroke="var(--color-value)" strokeWidth={2} dot={true} />
            </LineChart>
          );
        case "scatter":
          return (
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="category" dataKey={xAxisKey} name={xAxisKey} />
              <YAxis type="number" dataKey={yAxisKey} name={yAxisKey} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Scatter name="Data Points" data={chartData} fill="var(--color-value)" />
            </ScatterChart>
          );
        case "pie":
            return (
              <PieChart>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            );
        default:
          return <p>Invalid chart type selected.</p>;
      }
    };
    
    const currentChartConfig = chartType === 'pie' ? 
      pieChartData.reduce((acc, entry, index) => {
        acc[entry.name] = { label: entry.name, color: COLORS[index % COLORS.length] };
        return acc;
      }, {})
    : {
      value: { 
        label: yAxisKey || "Value",
        color: COLORS[0],
      },
    };


    return (
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Generated Chart</CardTitle>
        </CardHeader>
        <CardContent ref={ref} className="h-[450px] p-2 sm:p-4">
          <ChartContainer config={currentChartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
);

ChartDisplay.displayName = "ChartDisplay";
export { ChartDisplay };
