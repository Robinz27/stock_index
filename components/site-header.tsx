"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const [searchValue, setSearchValue] = React.useState("")
  const [selectedStock, setSelectedStock] = React.useState("SET")

  const stocks = ["SET", "ADVANC", "AEON", "AIRASIA", "AMATA", "AOT", "BFIT", "BPP", "BTS"]

  const filteredStocks = stocks.filter((stock) =>
    stock.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Stock Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Stock:</span>
          <span className="text-base font-bold">{selectedStock}</span>
        </div>

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Search Input */}
        <div className="relative hidden sm:block">
          <div className="relative w-64">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              className="pl-8 h-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && filteredStocks.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-input rounded-md shadow-md z-50">
                {filteredStocks.slice(0, 5).map((stock) => (
                  <button
                    key={stock}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent rounded-none first:rounded-t-md last:rounded-b-md"
                    onClick={() => {
                      setSelectedStock(stock)
                      setSearchValue("")
                    }}
                  >
                    {stock}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
