# Quick Start Guide

Get the Crypto Analytics Dashboard up and running in 3 steps!

## Prerequisites

1. ✅ Node.js 22.x installed (you have this)
2. ✅ InfluxDB running with crypto data (from lcw-fetch project)
3. ✅ Environment variables configured in `.env`

## Step 1: Verify Environment Variables

Your `.env` file should have:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your_super_secret_admin_token
INFLUXDB_ORG=cryptocurrency
INFLUXDB_BUCKET=crypto_data
PORT=3001
VITE_API_URL=http://localhost:3001
```

## Step 2: Start the Backend API

Open a terminal and run:

```bash
cd /home/john/code/analytics-front
npm run server
```

You should see:
```
⚡️[server]: Server is running at http://localhost:3001
```

Test it: `curl http://localhost:3001/health`

## Step 3: Start the Frontend

Open a **second terminal** and run:

```bash
cd /home/john/code/analytics-front
npm run dev
```

You should see:
```
VITE v7.1.7  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Step 4: Open Your Browser

Navigate to **http://localhost:5173/**

You should see:
- Market overview stats (Total Market Cap, Volume, Liquidity, BTC Dominance)
- A table with top cryptocurrencies
- Real-time price data updating every 60 seconds

## Troubleshooting

### "Error loading coins data"

**Problem**: No connection to backend API  
**Solution**: 
1. Make sure backend is running (`npm run server`)
2. Check `http://localhost:3001/health` returns `{"status":"ok"}`

### "Failed to fetch top coins"

**Problem**: Backend can't connect to InfluxDB  
**Solution**:
1. Verify InfluxDB is running: `curl http://localhost:8086/health`
2. Check credentials in `.env` match your InfluxDB setup
3. Ensure lcw-fetch has populated data

### No data in tables

**Problem**: InfluxDB has no data yet  
**Solution**:
```bash
cd /home/john/code/lcw-fetch
python -m lcw_fetcher.main run-once
```

Wait a minute, then refresh your dashboard.

## Development Tips

### Auto-Refresh
- Coins data refreshes every 60 seconds
- Market overview refreshes every 60 seconds
- History data refreshes every 5 minutes

### Search Feature
Use the search box to filter coins by name or symbol (e.g., "Bitcoin", "BTC")

### API Testing
Test API endpoints directly:
```bash
# Get top 10 coins
curl http://localhost:3001/api/coins/top?limit=10

# Get Bitcoin data
curl http://localhost:3001/api/coins/BTC

# Get market overview
curl http://localhost:3001/api/market/overview
```

## Next Steps

Once running, you can:
1. Customize the number of coins displayed
2. Add price charts using the history endpoint
3. Integrate blockchain analytics from the blockchain_data project
4. Deploy to production

## Production Build

```bash
# Build frontend
npm run build

# Build backend
npm run server:build

# Start production server
npm run server:start

# Serve frontend (use nginx, serve, or similar)
npx serve -s dist
```

Enjoy your crypto analytics dashboard! 🚀
