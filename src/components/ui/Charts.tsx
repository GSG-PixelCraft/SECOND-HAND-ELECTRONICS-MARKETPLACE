import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

// ============================================================================
// LineChart Component
// ============================================================================

interface LineChartProps {
  data: Record<string, unknown>[];
  title?: string;
  lines: {
    dataKey: string;
    stroke?: string;
    name?: string;
  }[];
  xAxisKey: string;
  height?: number;
  className?: string;
}

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  ({ data, title, lines, xAxisKey, height = 300, className }, ref) => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--success))",
      "hsl(var(--warning))",
      "hsl(var(--error))",
    ];

    return (
      <Card ref={ref} className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius-md)",
                }}
              />
              <Legend />
              {lines.map((line, index) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke || colors[index % colors.length]}
                  name={line.name || line.dataKey}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  },
);

LineChart.displayName = "LineChart";

// ============================================================================
// BarChart Component
// ============================================================================

interface BarChartProps {
  data: Record<string, unknown>[];
  title?: string;
  bars: {
    dataKey: string;
    fill?: string;
    name?: string;
  }[];
  xAxisKey: string;
  height?: number;
  className?: string;
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  ({ data, title, bars, xAxisKey, height = 300, className }, ref) => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--success))",
      "hsl(var(--warning))",
      "hsl(var(--error))",
    ];

    return (
      <Card ref={ref} className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius-md)",
                }}
              />
              <Legend />
              {bars.map((bar, index) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  fill={bar.fill || colors[index % colors.length]}
                  name={bar.name || bar.dataKey}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  },
);

BarChart.displayName = "BarChart";

// ============================================================================
// PieChart Component
// ============================================================================

interface PieChartProps {
  data: Record<string, unknown>[];
  title?: string;
  dataKey: string;
  nameKey: string;
  height?: number;
  className?: string;
  colors?: string[];
}

const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      title,
      dataKey,
      nameKey,
      height = 300,
      className,
      colors: customColors,
    },
    ref,
  ) => {
    const defaultColors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--success))",
      "hsl(var(--warning))",
      "hsl(var(--error))",
      "hsl(221, 83%, 63%)",
      "hsl(173, 80%, 50%)",
      "hsl(142, 71%, 55%)",
    ];

    const colors = customColors || defaultColors;

    return (
      <Card ref={ref} className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius-md)",
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  },
);

PieChart.displayName = "PieChart";

// ============================================================================
// Exports
// ============================================================================

export { LineChart, BarChart, PieChart };
export type { LineChartProps, BarChartProps, PieChartProps };
