import dotenv from 'dotenv';

// Load environment variables FIRST, before anything else
dotenv.config({ path: '/home/john/code/analytics-front/.env' });

// Debug: Log environment variables
console.log('📝 Environment variables loaded:');
console.log(`  INFLUXDB_URL: ${process.env.INFLUXDB_URL || 'NOT SET'}`);
console.log(`  INFLUXDB_ORG: ${process.env.INFLUXDB_ORG || 'NOT SET'}`);
console.log(`  INFLUXDB_BUCKET: ${process.env.INFLUXDB_BUCKET || 'NOT SET'}`);
console.log(`  INFLUXDB_TOKEN: ${process.env.INFLUXDB_TOKEN ? '***' + process.env.INFLUXDB_TOKEN.slice(-10) : 'NOT SET'}`);

export {};
