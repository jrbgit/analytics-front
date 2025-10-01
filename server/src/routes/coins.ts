import { Router, Request, Response } from 'express';
import { InfluxDBService } from '../services/influxdb.js';

const router = Router();
const influxService = new InfluxDBService();

// GET /api/coins/top - Get top coins by market cap
router.get('/top', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const coins = await influxService.getTopCoins(limit);
    res.json({ success: true, data: coins });
  } catch (error) {
    console.error('Error fetching top coins:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch top coins',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/coins/:code - Get specific coin data
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const coin = await influxService.getCoinByCode(code.toUpperCase());
    
    if (!coin) {
      return res.status(404).json({ 
        success: false, 
        error: 'Coin not found' 
      });
    }
    
    res.json({ success: true, data: coin });
  } catch (error) {
    console.error('Error fetching coin:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch coin data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/coins/:code/history - Get coin price history
router.get('/:code/history', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const hours = parseInt(req.query.hours as string) || 24;
    const history = await influxService.getCoinHistory(code.toUpperCase(), hours);
    
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching coin history:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch coin history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
