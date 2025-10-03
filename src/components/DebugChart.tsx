import { useEffect, useState } from 'react';

export const DebugChart = () => {
  const [mounted, setMounted] = useState(false);
  const [rechartsLoaded, setRechartsLoaded] = useState(false);

  useEffect(() => {
    console.log('DebugChart mounted');
    setMounted(true);

    // Test if Recharts can be imported
    import('recharts').then(() => {
      console.log('Recharts loaded successfully');
      setRechartsLoaded(true);
    }).catch((error) => {
      console.error('Failed to load Recharts:', error);
      setRechartsLoaded(false);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>Component mounted: {mounted ? '✅ Yes' : '❌ No'}</div>
        <div>Recharts loaded: {rechartsLoaded ? '✅ Yes' : '❌ No'}</div>
        <div>Browser: {navigator.userAgent}</div>
      </div>

      {/* Simple SVG chart without any external libraries */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Simple SVG Chart (No Libraries)</h4>
        <svg width="400" height="200" className="border border-gray-200">
          <rect width="400" height="200" fill="#f8f9fa" />
          <polyline
            points="20,180 80,120 140,160 200,100 260,140 320,80 380,120"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text x="20" y="15" fontSize="12" fill="#666">Simple SVG Line Chart</text>
          {/* Data points */}
          {[
            {x: 20, y: 180},
            {x: 80, y: 120},
            {x: 140, y: 160},
            {x: 200, y: 100},
            {x: 260, y: 140},
            {x: 320, y: 80},
            {x: 380, y: 120}
          ].map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="3" fill="#3b82f6" />
          ))}
        </svg>
      </div>

      {/* Canvas chart */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Canvas Chart (No Libraries)</h4>
        <canvas 
          ref={(canvas) => {
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Clear canvas
                ctx.fillStyle = '#f8f9fa';
                ctx.fillRect(0, 0, 400, 200);
                
                // Draw line chart
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                const points = [
                  {x: 20, y: 180},
                  {x: 80, y: 140},
                  {x: 140, y: 100},
                  {x: 200, y: 160},
                  {x: 260, y: 80},
                  {x: 320, y: 120},
                  {x: 380, y: 100}
                ];
                
                points.forEach((point, index) => {
                  if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                  } else {
                    ctx.lineTo(point.x, point.y);
                  }
                });
                ctx.stroke();

                // Draw points
                ctx.fillStyle = '#ef4444';
                points.forEach(point => {
                  ctx.beginPath();
                  ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                  ctx.fill();
                });

                // Add title
                ctx.fillStyle = '#666';
                ctx.font = '12px sans-serif';
                ctx.fillText('Canvas Line Chart', 10, 15);
              }
            }
          }}
          width={400} 
          height={200}
          className="border border-gray-200"
        />
      </div>
    </div>
  );
};
