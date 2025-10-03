# Crypto Analytics Dashboard

Frontend application for analytics dashboard with modern React components and data visualization.

## Overview

This is a real-time cryptocurrency analytics dashboard built with React, TypeScript, and modern web technologies. It provides comprehensive market data, price tracking, and visualizations for cryptocurrency analysis.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Fetching**: Tanstack Query (React Query), Axios
- **Backend**: Express.js, InfluxDB
- **Data Source**: LiveCoinWatch API

## Features

### Current Features
- ✅ Real-time cryptocurrency market data
- ✅ Top coins table with pricing and market cap
- ✅ Market statistics overview
- ✅ Responsive design with Tailwind CSS

### Features Roadmap
- [x] Price charts using Recharts
- [ ] Historical price analysis
- [ ] Portfolio tracking
- [ ] Price alerts and notifications
- [ ] Advanced filtering and search
- [ ] Export data functionality
- [ ] Dark mode support
- [ ] Mobile app integration

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository
```bash
git clone https://github.com/jrbgit/analytics-front.git
cd analytics-front
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Start the backend server (in a separate terminal)
```bash
npm run server
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start backend server in watch mode
- `npm run server:build` - Build backend
- `npm run server:start` - Start production backend

## Project Structure

```
src/
├── components/          # React components
│   ├── CoinTable.tsx   # Main coins table
│   └── MarketStats.tsx # Market overview stats
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Data Sources

Data is sourced from the LiveCoinWatch API and stored in InfluxDB for real-time analytics and historical data tracking.
