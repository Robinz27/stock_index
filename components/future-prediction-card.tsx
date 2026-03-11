'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts'
import { TrendingUp, Loader2, ChevronsUpDown, Check } from 'lucide-react'

interface ChartPoint {
    date: string
    predictedClose: number | null
    actualClose: number | null
}

interface FuturePredictionCardProps { }

export function FuturePredictionCard({ }: FuturePredictionCardProps) {
    const [symbols, setSymbols] = useState<string[]>([])
    const [selectedSymbol, setSelectedSymbol] = useState<string>('')
    const [chartData, setChartData] = useState<ChartPoint[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingSymbols, setIsFetchingSymbols] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasPredicted, setHasPredicted] = useState(false)
    const [runDate, setRunDate] = useState<string | null>(null)
    const [forecastError, setForecastError] = useState<number | null>(null)

    // Combobox state
    const [comboOpen, setComboOpen] = useState(false)
    const [query, setQuery] = useState('')
    const comboRef = useRef<HTMLDivElement>(null)

    // Filter: startsWith (case-insensitive), sorted A-Z
    const filteredSymbols = symbols
        .filter((s) => s.toLowerCase().startsWith(query.toLowerCase()))
        .sort((a, b) => a.localeCompare(b))

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
                setComboOpen(false)
                setQuery('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Load symbol list on mount
    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const res = await fetch('/api/predict/stocks')
                const json = await res.json()
                if (json.symbols) {
                    setSymbols(json.symbols)
                    setSelectedSymbol(json.symbols[0] ?? '')
                }
            } catch {
                setError('Failed to load stock list')
            } finally {
                setIsFetchingSymbols(false)
            }
        }
        fetchSymbols()
    }, [])

    const handlePredict = async () => {
        if (!selectedSymbol) return
        setIsLoading(true)
        setError(null)
        setHasPredicted(false)
        setForecastError(null)
        try {
            const res = await fetch(`/api/predict/stocks?symbol=${selectedSymbol}`)
            const json = await res.json()
            if (json.error) {
                setError(json.error)
                setChartData([])
            } else {
                setChartData(json.data ?? [])
                setRunDate(json.runDate ?? null)
                setForecastError(json.forecastError ?? null)
                setHasPredicted(true)
            }
        } catch {
            setError('Failed to fetch prediction data')
            setChartData([])
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr)
            return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })
        } catch {
            return dateStr
        }
    }

    // Compute domain across both series
    const allValues = chartData.flatMap((d) => [
        d.predictedClose ?? null,
        d.actualClose ?? null,
    ]).filter((v): v is number => v !== null && !isNaN(v))

    const minVal = allValues.length > 0 ? Math.min(...allValues) : 0
    const maxVal = allValues.length > 0 ? Math.max(...allValues) : 0
    const padding = (maxVal - minVal) * 0.15 || 1
    const domainMin = parseFloat((minVal - padding).toFixed(2))
    const domainMax = parseFloat((maxVal + padding).toFixed(2))

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-400" />
                        Future Price Prediction
                    </CardTitle>
                    <CardDescription>
                        10-day ahead stock price forecast using LSTM model
                        {runDate && (
                            <span className="ml-2 text-muted-foreground/70 text-xs">
                                (run date: {runDate})
                            </span>
                        )}
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    {/* Forecast Error Badge */}
                    {forecastError !== null && (
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-muted-foreground leading-none mb-0.5 whitespace-nowrap">
                                Forecast Error (5d)
                            </span>
                            <span
                                className={`text-sm font-bold leading-none px-2 py-1 rounded-md ${forecastError <= 3
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : forecastError <= 7
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-red-500/20 text-red-400'
                                    }`}
                            >
                                {forecastError.toFixed(2)}%
                            </span>
                        </div>
                    )}
                    {/* Combobox */}
                    <div ref={comboRef} className="relative w-[220px]">
                        <div
                            className={`flex items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm cursor-pointer h-9 ${isFetchingSymbols ? 'opacity-50 pointer-events-none' : ''
                                }`}
                            onClick={() => {
                                setComboOpen((prev) => !prev)
                                setQuery('')
                            }}
                        >
                            <span className={selectedSymbol ? '' : 'text-muted-foreground'}>
                                {isFetchingSymbols ? 'Loading...' : (selectedSymbol || 'Select stock')}
                            </span>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>

                        {comboOpen && (
                            <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
                                <div className="p-2">
                                    <Input
                                        autoFocus
                                        placeholder="Search stock..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <ul className="max-h-[260px] overflow-y-auto py-1">
                                    {filteredSymbols.length === 0 ? (
                                        <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>
                                    ) : (
                                        filteredSymbols.map((s) => (
                                            <li
                                                key={s}
                                                className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm ${s === selectedSymbol ? 'bg-accent/60' : ''
                                                    }`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    setSelectedSymbol(s)
                                                    setComboOpen(false)
                                                    setQuery('')
                                                }}
                                            >
                                                <Check
                                                    className={`h-3.5 w-3.5 shrink-0 ${s === selectedSymbol ? 'opacity-100 text-primary' : 'opacity-0'
                                                        }`}
                                                />
                                                {s}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handlePredict}
                        disabled={isLoading || !selectedSymbol}
                        className="bg-foreground text-background hover:bg-foreground/90 min-w-[90px]"
                        size="sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                Loading
                            </>
                        ) : (
                            'Predict'
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {/* Chart area */}
                <div className="h-[300px] w-full">
                    {!hasPredicted && !isLoading && !error && (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Select a stock and click <span className="font-semibold text-orange-400">Predict</span> to view the forecast
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex h-full items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
                                <p className="text-sm text-muted-foreground">Generating prediction...</p>
                            </div>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {hasPredicted && !isLoading && chartData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    dy={10}
                                    tickFormatter={formatDate}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    dx={-10}
                                    domain={[domainMin, domainMax]}
                                    tickFormatter={(v) => v.toFixed(2)}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#f9fafb',
                                    }}
                                    labelStyle={{ color: '#9ca3af' }}
                                    labelFormatter={(label) => formatDate(label)}
                                    formatter={(value: number, name: string) => [
                                        value != null
                                            ? `฿${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            : '-',
                                        name === 'predictedClose' ? 'Predicted Close' : 'Actual Close',
                                    ]}
                                />
                                <Legend
                                    formatter={(value) =>
                                        value === 'predictedClose' ? 'Predicted Close' : 'Actual Close'
                                    }
                                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                                />

                                {/* Blue line: Actual price from Yahoo Finance */}
                                <Line
                                    type="monotone"
                                    dataKey="actualClose"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1 }}
                                    connectNulls={false}
                                    filter="url(#glowBlue)"
                                />

                                {/* Orange dashed line: Predicted price from LSTM model */}
                                <Line
                                    type="monotone"
                                    dataKey="predictedClose"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 1 }}
                                    strokeDasharray="5 3"
                                    connectNulls={false}
                                    filter="url(#glowOrange)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Predictions are generated using a trained LSTM model based on historical data.
                    These forecasts are for informational purposes only and should not be used as the sole basis for investment decisions.
                </p>
            </CardContent>
        </Card>
    )
}
