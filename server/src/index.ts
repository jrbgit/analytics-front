import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import coinsRouter from './routes/coins.js';
import marketRouter from './routes/market.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/coins', coinsRouter);
app.use('/api/market', marketRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: API endpoints:`);
  console.log(`  - GET /api/coins/top?limit=100`);
  console.log(`  - GET /api/coins/:code`);
  console.log(`  - GET /api/coins/:code/history?hours=24`);
  console.log(`  - GET /api/market/overview`);
});
