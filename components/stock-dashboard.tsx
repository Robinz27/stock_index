'use client'

import React from "react"

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StockMetricCard } from '@/components/stock-metric-card'
import { StockChart } from '@/components/stock-chart'
import { FuturePredictionCard } from '@/components/future-prediction-card'
import { Search, Sun, Moon, Clock, LayoutDashboard } from 'lucide-react'
import { useTheme } from "next-themes"
import type { StockData, TimePeriod } from '@/lib/types'
import { UserMenu } from '@/components/user-menu'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StockDashboard({ symbol: initialSymbol = 'PTT.BK' }: { symbol?: string }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [symbol, setSymbol] = useState(initialSymbol)
  const [searchInput, setSearchInput] = useState('')
  const [period, setPeriod] = useState<TimePeriod>('30d')
  const [showHistory, setShowHistory] = useState(false)

  // Update internal symbol if prop changes
  useEffect(() => {
    if (initialSymbol !== symbol) {
      setSymbol(initialSymbol)
    }
  }, [initialSymbol])

  const { data: history, mutate: mutateHistory } = useSWR<any[]>(
    '/api/search-history',
    fetcher
  )

  const { data, error, isLoading } = useSWR<StockData>(
    `/api/stock?symbol=${symbol}&period=${period}`,
    fetcher,
    { refreshInterval: 60000 }
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      let newSymbol = searchInput.trim().toUpperCase()
      if (!newSymbol.includes('.') && /^[A-Z]+$/.test(newSymbol)) {
        newSymbol = `${newSymbol}.BK`
      }
      setSearchInput('')
      setShowHistory(false)

      // Use Pretty URL
      router.push(`/stock/${newSymbol}`)

      // Save to history
      try {
        await fetch('/api/search-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: newSymbol }),
        })
        mutateHistory()
      } catch (err) {
        console.error("Failed to save history", err)
      }
    }
  }

  const selectFromHistory = (histSymbol: string) => {
    router.push(`/stock/${histSymbol}`)
    setSearchInput('')
    setShowHistory(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getCurrency = () => {
    if (!data?.currency) return '฿'
    if (data.currency === 'THB') return '฿'
    if (data.currency === 'USD') return '$'
    return data.currency
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <UserMenu />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Stock:</span>
            <span className="font-semibold">{symbol.replace('.BK', '')}</span>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Popover open={showHistory && history && history.length > 0} onOpenChange={setShowHistory}>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value)
                      if (!showHistory) setShowHistory(true)
                    }}
                    onFocus={() => setShowHistory(true)}
                    className="pl-9 bg-muted/50 focus-visible:ring-primary/20 transition-all"
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 border-border/50 bg-card/95 backdrop-blur-xl"
                  align="start"
                  sideOffset={8}
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      <Clock className="h-3.5 w-3.5" />
                      Recent Searches
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // In a real app, you'd call a delete API here. 
                        // For now, let's just mutate local state to empty.
                        mutateHistory([], false);
                        toast.success("History cleared");
                      }}
                      className="text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="p-1">
                    {history?.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectFromHistory(item.symbol)}
                        className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-muted/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
                          <span className="font-medium text-foreground/90">{item.symbol}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60">
                          {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" size="sm" className="px-4">
              Search
            </Button>
          </form>

          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        {isLoading && (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
              <p className="text-sm text-muted-foreground">Loading stock data...</p>
            </div>
          </div>
        )}

        {(error || (data && data.error)) && (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-destructive">Error loading data</p>
              <p className="text-sm text-muted-foreground">
                {data?.error || 'Please try again or search for a different stock'}
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Try: PTT, EA, BANPU, IRPC, NOVA
              </p>
            </div>
          </div>
        )}

        {data && !isLoading && !data.error && (
          <div className="space-y-4">
            {/* Metrics Grid - Row 1: Opening Price, Highest Price, Trading Volume */}
            <div className="grid gap-4 md:grid-cols-3">
              <StockMetricCard
                label={data.metrics.open.label}
                value={data.metrics.open.value}
                change={data.metrics.open.change}
                description={data.metrics.open.description}
                subtext={data.metrics.open.subtext}
                currency={getCurrency()}
              />
              <StockMetricCard
                label={data.metrics.high.label}
                value={data.metrics.high.value}
                change={data.metrics.high.change}
                description={data.metrics.high.description}
                subtext={data.metrics.high.subtext}
                currency={getCurrency()}
              />
              <StockMetricCard
                label={data.metrics.volume.label}
                value={data.metrics.volume.value}
                change={data.metrics.volume.change}
                description={data.metrics.volume.description}
                subtext={data.metrics.volume.subtext}
                isVolume
              />
            </div>

            {/* Metrics Grid - Row 2: Close Price, Lowest Price, Adj Close Price */}
            <div className="grid gap-4 md:grid-cols-3">
              <StockMetricCard
                label={data.metrics.close.label}
                value={data.metrics.close.value}
                change={data.metrics.close.change}
                description={data.metrics.close.description}
                subtext={data.metrics.close.subtext}
                currency={getCurrency()}
              />
              <StockMetricCard
                label={data.metrics.low.label}
                value={data.metrics.low.value}
                change={data.metrics.low.change}
                description={data.metrics.low.description}
                subtext={data.metrics.low.subtext}
                currency={getCurrency()}
              />
              <StockMetricCard
                label={data.metrics.adjClose.label}
                value={data.metrics.adjClose.value}
                change={data.metrics.adjClose.change}
                description={data.metrics.adjClose.description}
                subtext={data.metrics.adjClose.subtext}
                currency={getCurrency()}
              />
            </div>

            {/* Chart */}
            <StockChart
              data={data.chartData}
              period={period}
              onPeriodChange={setPeriod}
            />

            {/* Future Price Prediction */}
            <FuturePredictionCard />
          </div>
        )}
      </main>
    </div>
  )
}
