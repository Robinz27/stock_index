"""
Python script to fetch Thai stock market data
This simulates fetching data from SET (Stock Exchange of Thailand)
In production, you would use actual APIs like SET API or Yahoo Finance
"""

import json
import random
from datetime import datetime, timedelta

def generate_mock_stock_data(symbol, name, days=30):
    """Generate mock stock data for demonstration"""
    data = []
    base_price = random.uniform(800, 1800)
    
    for i in range(days):
        date = datetime.now() - timedelta(days=days-i)
        
        # Simulate price movement
        change = random.uniform(-50, 50)
        base_price += change
        
        open_price = base_price + random.uniform(-20, 20)
        high_price = max(open_price, base_price) + random.uniform(0, 30)
        low_price = min(open_price, base_price) - random.uniform(0, 30)
        close_price = base_price
        volume = random.randint(10000000, 50000000)
        
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volume": volume
        })
    
    return {
        "symbol": symbol,
        "name": name,
        "current_price": round(base_price, 2),
        "change": round(random.uniform(-50, 50), 2),
        "change_percent": round(random.uniform(-3, 3), 2),
        "open": round(data[-1]["open"], 2),
        "high": round(data[-1]["high"], 2),
        "low": round(data[-1]["low"], 2),
        "volume": data[-1]["volume"],
        "market_cap": round(base_price * random.randint(1000000, 5000000), 2),
        "historical_data": data
    }

def fetch_thai_indices():
    """Fetch Thai stock indices data"""
    indices = [
        {"symbol": "SET", "name": "SET Index"},
        {"symbol": "SET50", "name": "SET50 Index"},
        {"symbol": "SET100", "name": "SET100 Index"},
        {"symbol": "sSET", "name": "sSET Index"},
        {"symbol": "MAI", "name": "MAI Index"},
    ]
    
    result = []
    for index in indices:
        data = generate_mock_stock_data(index["symbol"], index["name"])
        result.append(data)
    
    return result

if __name__ == "__main__":
    # Fetch data
    indices_data = fetch_thai_indices()
    
    # Print as JSON
    print(json.dumps(indices_data, indent=2, ensure_ascii=False))
