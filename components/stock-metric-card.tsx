'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockMetricCardProps {
  label: string
  value: number
  change: number
  description: string
  subtext: string
  currency?: string
  isVolume?: boolean
}

export function StockMetricCard({
  label,
  value,
  change,
  description,
  subtext,
  currency = '฿',
  isVolume = false,
}: StockMetricCardProps) {
  const isPositive = change >= 0
  const formattedValue = isVolume
    ? value.toLocaleString('en-US', { maximumFractionDigits: 1 })
    : `${currency}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
          </div>
        </div>
        
        <p className="mt-2 text-2xl font-bold text-foreground">{formattedValue}</p>
        
        <div className="mt-3 flex items-center gap-1.5">
          <p className="text-sm font-medium text-amber-400">{description}</p>
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-amber-400" />
          ) : (
            <TrendingDown className="h-3 w-3 text-amber-400" />
          )}
        </div>
        
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  )
}
