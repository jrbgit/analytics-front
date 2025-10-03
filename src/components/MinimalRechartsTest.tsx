import { useEffect, useState } from 'react';

// Lazy import to catch any loading errors
const LazyRechartsTest = () => {
  const [RechartsComponents, setRechartsComponents] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Attempting to load Recharts components...');
    
    Promise.all([
      import('recharts').then(recharts => recharts.ResponsiveContainer),
      import('recharts').then(recharts => recharts.LineChart),
      import('recharts').then(recharts => recharts.Line),
      import('recharts').then(recharts => recharts.XAxis),
      import('recharts').then(recharts => recharts.YAxis),
    ]).then(([ResponsiveContainer, LineChart, Line, XAxis, YAxis]) => {
      console.log('All Recharts components loaded successfully');
      setRechartsComponents({
        ResponsiveContainer,
        LineChart, 
        Line,
        XAxis,
        YAxis
      });
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to load Recharts:', err);
      setError(err.message || 'Unknown error loading Recharts');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-yellow-50 p-4 rounded border">
        <div className="animate-pulse">Loading Recharts components...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded border">
        <div className="text-red-700 font-medium">Recharts Loading Error:</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
      </div>
    );
  }

  if (!RechartsComponents) {
    return (
      <div className="bg-red-50 p-4 rounded border">
        <div className="text-red-700">Recharts components not available</div>
      </div>
    );
  }

  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis } = RechartsComponents;

  const testData = [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 150 },
    { name: 'D', value: 300 },
    { name: 'E', value: 250 },
  ];

  console.log('Rendering Recharts chart with data:', testData);

  try {
    return (
      <div className="bg-white p-4 rounded border">
        <h4 className="font-medium mb-2">Minimal Recharts Test</h4>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer>
            <LineChart data={testData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (renderError: any) {
    console.error('Error rendering Recharts:', renderError);
    return (
      <div className="bg-red-50 p-4 rounded border">
        <div className="text-red-700 font-medium">Recharts Render Error:</div>
        <div className="text-red-600 text-sm mt-1">{renderError?.message || 'Unknown render error'}</div>
      </div>
    );
  }
};

export const MinimalRechartsTest = LazyRechartsTest;
