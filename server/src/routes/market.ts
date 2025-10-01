import { Router, Request, Response } from 'express';
import { InfluxDBService } from '../services/influxdb.js';

const router = Router();
const influxService = new InfluxDBService();

// GET /api/market/overview - Get market overview data
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const overview = await influxService.getMarketOverview();
    
    if (!overview) {
      return res.status(404).json({ 
        success: false, 
        error: 'Market overview data not available' 
      });
    }
    
    res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Error fetching market overview:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch market overview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
