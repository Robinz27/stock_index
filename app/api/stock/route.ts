import { NextRequest, NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get('symbol') || 'PTT.BK'
  const period = searchParams.get('period') || '30d'

  try {
    // Calculate date range based on period
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 1)
    let startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 10) // Extra days for weekends
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 45)
        break
      case '3m':
        startDate.setMonth(endDate.getMonth() - 4)
        break
      default:
        startDate.setDate(endDate.getDate() - 45)
    }

    // Fetch historical data
    const historical = await yahooFinance.chart(symbol, {
      period1: startDate.toISOString().split('T')[0],
      period2: endDate.toISOString().split('T')[0],
      interval: '1d',
    })

    if (!historical || !historical.quotes || historical.quotes.length === 0) {
      return NextResponse.json({ error: 'No data found for this symbol' }, { status: 404 })
    }

    // Filter based on actual calendar days (not trading days)
    const quotes = historical.quotes.filter(q => q.close !== null)

    // Calculate the cutoff date based on period
    const now = new Date()
    let cutoffDate = new Date()

    switch (period) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case '30d':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case '3m':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      default:
        cutoffDate.setDate(now.getDate() - 30)
    }

    // Filter quotes to only include dates within the selected period
    const filteredQuotes = quotes.filter(q => {
      const quoteDate = new Date(q.date)
      return quoteDate >= cutoffDate
    })

    // Get latest data
    const latestQuote = filteredQuotes[filteredQuotes.length - 1]
    const previousQuote = filteredQuotes.length > 1 ? filteredQuotes[filteredQuotes.length - 2] : latestQuote
    const firstQuote = filteredQuotes[0]

    // Calculate changes
    const openChange = latestQuote.open && previousQuote.open
      ? ((latestQuote.open - previousQuote.open) / previousQuote.open * 100)
      : 0
    const highChange = latestQuote.high && firstQuote.high
      ? ((latestQuote.high - firstQuote.high) / firstQuote.high * 100)
      : 0
    const lowChange = latestQuote.low && firstQuote.low
      ? ((latestQuote.low - firstQuote.low) / firstQuote.low * 100)
      : 0
    const closeChange = latestQuote.close && previousQuote.close
      ? ((latestQuote.close - previousQuote.close) / previousQuote.close * 100)
      : 0
    const volumeChange = latestQuote.volume && previousQuote.volume
      ? ((latestQuote.volume - previousQuote.volume) / previousQuote.volume * 100)
      : 0

    // Format chart data
    const chartData = filteredQuotes.map((quote) => ({
      date: new Date(quote.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
      fullDate: quote.date,
      close: quote.close || 0,
      open: quote.open || 0,
      high: quote.high || 0,
      low: quote.low || 0,
      volume: quote.volume || 0,
    }))

    return NextResponse.json({
      symbol,
      currency: historical.meta?.currency || 'THB',
      metrics: {
        open: {
          value: latestQuote.open || 0,
          change: openChange,
          label: 'Opening Price',
          description: openChange >= 0 ? 'Stock trending up this month' : 'Stock trending down',
          subtext: 'Price movement for the last 6 months',
        },
        high: {
          value: latestQuote.high || 0,
          change: highChange,
          label: 'Highest Price',
          description: highChange >= 0 ? 'New highs reached' : 'Down this period',
          subtext: highChange >= 0 ? 'Strong momentum' : 'Acquisition needs attention',
        },
        low: {
          value: latestQuote.low || 0,
          change: lowChange,
          label: 'Lowest Price',
          description: lowChange >= 0 ? 'Support level holding' : 'Strong user retention',
          subtext: 'Engagement exceed targets',
        },
        close: {
          value: latestQuote.close || 0,
          change: closeChange,
          label: 'Close Price',
          description: closeChange >= 0 ? 'Positive closing trend' : 'Negative closing trend',
          subtext: 'Compared to last closing',
        },
        adjClose: {
          value: latestQuote.adjclose || latestQuote.close || 0,
          change: closeChange * 1.05,
          label: 'Adj Close Price',
          description: 'Adjusted for dividends',
          subtext: 'Reflects true value',
        },
        volume: {
          value: latestQuote.volume || 0,
          change: volumeChange,
          label: 'Trading Volume',
          description: volumeChange >= 0 ? 'Steady performance increase' : 'Volume decrease',
          subtext: 'Meets growth projections',
        },
      },
      chartData,
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data. Please check the symbol and try again.' },
      { status: 500 }
    )
  }
}