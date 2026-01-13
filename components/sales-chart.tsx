"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { CustomTooltip } from "./custom-tooltip"

type SalesPoint = {
  month: string
  sales: number
}

const data: SalesPoint[] = [
  { month: "يناير", sales: 35000 },
  { month: "فبراير", sales: 42000 },
  { month: "مارس", sales: 38000 },
  { month: "أبريل", sales: 51000 },
  { month: "مايو", sales: 48000 },
  { month: "يونيو", sales: 61000 },
]


const SALES_COLOR = "#2563eb" ;

const chartConfig = {
  sales: {
    label: "المبيعات",
    color: SALES_COLOR,
  },
} satisfies ChartConfig

export function SalesChart(): React.JSX.Element {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-62.5 w-full sm:h-87.5 lg:h-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart  data={data} margin={{ top: 16, right: 12, left: 12, bottom: 8 }}>
          <CartesianGrid vertical={false}   />

          <XAxis
            dataKey="month"
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }} // slate-500
          />

          <ChartTooltip
           content={<CustomTooltip/>}
          />

          <Line
            type="linear"
            dataKey="sales"
            stroke={SALES_COLOR}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
