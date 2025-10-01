# Crypto Analytics Dashboard

A modern cryptocurrency analytics dashboard that displays real-time price data and market metrics. Built with React, TypeScript, and powered by data from the LiveCoinWatch API via InfluxDB.

## Features

- 📊 **Real-time Price Data**: Live cryptocurrency prices with auto-refresh
- 📈 **Market Overview**: Total market cap, volume, liquidity, and BTC dominance
- 🔍 **Search & Filter**: Easily find coins by name or symbol
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Fast Performance**: Optimized data fetching with React Query
- 🎨 **Modern UI**: Clean interface similar to CoinMarketCap/CoinGecko

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for styling
- **TanStack Query** (React Query) for data fetching and caching
- **Axios** for HTTP requests
- **Recharts** for data visualization (ready for charts)

### Backend API
- **Express.js** with TypeScript
- **InfluxDB 2.0** client for time-series data
- RESTful API design

## Project Structure

```
analytics-front/
├── src/                      # Frontend React application
│   ├── components/           # UI components
│   │   ├── CoinTable.tsx    # Main coins table
│   │   └── MarketStats.tsx  # Market overview stats
│   ├── hooks/               # Custom React hooks
│   │   └── useCoins.ts      # Data fetching hooks
│   ├── services/            # API clients
│   │   └── api.ts           # Axios API client
│   ├── types/               # TypeScript definitions
│   │   └── coin.ts          # Coin data types
│   ├── utils/               # Utility functions
│   │   └── formatters.ts    # Number/currency formatters
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── server/                  # Backend Express API
│   └── src/
│       ├── routes/          # API route handlers
│       │   ├── coins.ts     # Coins endpoints
│       │   └── market.ts    # Market endpoints
│       ├── services/        # Business logic
│       │   └── influxdb.ts  # InfluxDB queries
│       ├── types/           # TypeScript types
│       │   └── coin.ts      # Shared types
│       └── index.ts         # Server entry point
├── .env                     # Environment variables
└── package.json             # Dependencies
```

## Prerequisites

- **Node.js** 18.x or higher
- **InfluxDB 2.x** instance (local or cloud)
- **lcw-fetch project** running to populate InfluxDB with data

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your InfluxDB credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# InfluxDB Configuration (from lcw-fetch project)
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your_influxdb_token_here
INFLUXDB_ORG=cryptocurrency
INFLUXDB_BUCKET=crypto_data

# Server Configuration
PORT=3001

# Vite Frontend Configuration
VITE_API_URL=http://localhost:3001
```

### 3. Ensure Data is Available

Make sure the `lcw-fetch` project is running and populating InfluxDB with cryptocurrency data:

```bash
cd /home/john/code/lcw-fetch
python -m lcw_fetcher.main start
```

### 4. Run the Application

Open two terminal windows:

**Terminal 1 - Start the backend API server:**
```bash
npm run server
```

The API will be available at `http://localhost:3001`

**Terminal 2 - Start the frontend development server:**
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### 5. Build for Production

```bash
# Build frontend
npm run build

# Build backend
npm run server:build

# Start production server
npm run server:start
# Then serve the frontend dist/ folder with a web server
```

## API Endpoints

The backend API provides the following endpoints:

- `GET /api/coins/top?limit=100` - Get top coins by market cap
- `GET /api/coins/:code` - Get specific coin data (e.g., BTC, ETH)
- `GET /api/coins/:code/history?hours=24` - Get coin price history
- `GET /api/market/overview` - Get market overview statistics
- `GET /health` - Health check endpoint

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run server` - Start backend API server with hot reload
- `npm run server:build` - Build backend TypeScript
- `npm run server:start` - Start production backend server
- `npm run lint` - Run ESLint

## Data Flow

1. **lcw-fetch** fetches data from LiveCoinWatch API
2. Data is stored in **InfluxDB** time-series database
3. **Express API** queries InfluxDB using Flux queries
4. **React frontend** fetches data from API using React Query
5. Data is displayed in the **dashboard UI**

## Features Roadmap

- [ ] Price charts using Recharts
- [ ] Individual coin detail pages
- [ ] Price alerts and notifications
- [ ] Historical data comparison
- [ ] Portfolio tracking
- [ ] Integration with blockchain analytics (from blockchain_data project)
- [ ] Dark mode support
- [ ] Export data to CSV/JSON

## Integration with blockchain_data

Future versions will integrate blockchain analytics from the `blockchain_data` project located at `/home/john/code/blockchain_data` to provide deeper insights into blockchain metrics and on-chain data.

## Troubleshooting

### API Connection Issues

If you see connection errors:
1. Verify InfluxDB is running: `curl http://localhost:8086/health`
2. Check that lcw-fetch is populating data
3. Verify environment variables in `.env` are correct

### No Data Showing

1. Ensure lcw-fetch has run at least once
2. Check InfluxDB has data: Query the `crypto_data` bucket
3. Check browser console for errors

### Port Conflicts

If ports 3001 or 5173 are in use, update `.env` and package.json scripts accordingly.

## License

MIT

## Related Projects

- **lcw-fetch**: `/home/john/code/lcw-fetch` - Data fetching service
- **blockchain_data**: `/home/john/code/blockchain_data` - Blockchain analytics (future integration)
