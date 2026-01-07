"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "1 ม.ค.", price: 1245.50 },
  { date: "2 ม.ค.", price: 1268.75 },
  { date: "3 ม.ค.", price: 1242.30 },
  { date: "4 ม.ค.", price: 1285.40 },
  { date: "5 ม.ค.", price: 1310.80 },
  { date: "6 ม.ค.", price: 1295.60 },
  { date: "7 ม.ค.", price: 1275.20 },
  { date: "8 ม.ค.", price: 1330.90 },
  { date: "9 ม.ค.", price: 1248.15 },
  { date: "10 ม.ค.", price: 1288.45 },
  { date: "11 ม.ค.", price: 1315.70 },
  { date: "12 ม.ค.", price: 1298.25 },
  { date: "13 ม.ค.", price: 1325.80 },
  { date: "14 ม.ค.", price: 1268.40 },
  { date: "15 ม.ค.", price: 1255.90 },
  { date: "16 ม.ค.", price: 1270.35 },
  { date: "17 ม.ค.", price: 1340.60 },
  { date: "18 ม.ค.", price: 1308.75 },
  { date: "19 ม.ค.", price: 1282.50 },
  { date: "20 ม.ค.", price: 1265.20 },
  { date: "21 ม.ค.", price: 1278.65 },
  { date: "22 ม.ค.", price: 1295.40 },
  { date: "23 ม.ค.", price: 1272.10 },
  { date: "24 ม.ค.", price: 1318.85 },
  { date: "25 ม.ค.", price: 1290.45 },
  { date: "26 ม.ค.", price: 1248.70 },
  { date: "27 ม.ค.", price: 1312.30 },
  { date: "28 ม.ค.", price: 1275.80 },
  { date: "29 ม.ค.", price: 1305.15 },
  { date: "30 ม.ค.", price: 1335.60 },
]

const chartConfig = {
  price: {
    label: "Stock Price (฿)",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const dateMap: { [key: string]: number } = {
      "1 ม.ค.": 1, "2 ม.ค.": 2, "3 ม.ค.": 3, "4 ม.ค.": 4, "5 ม.ค.": 5,
      "6 ม.ค.": 6, "7 ม.ค.": 7, "8 ม.ค.": 8, "9 ม.ค.": 9, "10 ม.ค.": 10,
      "11 ม.ค.": 11, "12 ม.ค.": 12, "13 ม.ค.": 13, "14 ม.ค.": 14, "15 ม.ค.": 15,
      "16 ม.ค.": 16, "17 ม.ค.": 17, "18 ม.ค.": 18, "19 ม.ค.": 19, "20 ม.ค.": 20,
      "21 ม.ค.": 21, "22 ม.ค.": 22, "23 ม.ค.": 23, "24 ม.ค.": 24, "25 ม.ค.": 25,
      "26 ม.ค.": 26, "27 ม.ค.": 27, "28 ม.ค.": 28, "29 ม.ค.": 29, "30 ม.ค.": 30,
    }
    const dayNum = dateMap[item.date] || 0
    let daysToShow = 30
    if (timeRange === "30d") {
      daysToShow = 30
    } else if (timeRange === "7d") {
      daysToShow = 7
    }
    return dayNum > 30 - daysToShow
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Stock Price Chart</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Stock price movement for the last 30 days
          </span>
          <span className="@[540px]/card:hidden">Last 30 days</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[1200, 1350]}
              ticks={[1200, 1225, 1250, 1275, 1300, 1325, 1350]}
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => {
                    return `฿${(value as number).toFixed(2)}`
                  }}
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke="var(--color-price)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
