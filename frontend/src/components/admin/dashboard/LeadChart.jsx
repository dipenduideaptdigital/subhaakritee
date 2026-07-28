import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { dashboardApi } from '../../../api/dashboard';

const LeadChart = () => {
  const [chartRange, setChartRange] = useState('30D');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await dashboardApi.getChartTimeline(chartRange);
        setChartData(res.data || []);
      } catch (err) {
        console.error("Failed to load chart data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [chartRange]);

  // SVG Path Generator Mathematics
  const generateChartPath = (data) => {
    if (!data || data.length === 0) return { line: "", fill: "" };

    const width = 400;
    const height = 100;
    const maxCount = Math.max(...data.map(d => d.count), 1);
    
    // Create standard line points
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.count / maxCount) * (height - 20)) - 10;
      return `${x},${y}`;
    });

    const linePath = `M${points.join(' L')}`; // For a sharp line graph. Use bezier for curves if needed.
    const fillPath = `${linePath} L${width},${height} L0,${height} Z`;

    return { line: linePath, fill: fillPath };
  };

  const { line, fill } = generateChartPath(chartData);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 flex flex-col relative overflow-hidden h-full min-h-[300px] transition-colors duration-300">
      <div className="flex justify-between items-center mb-8 z-20 relative">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 transition-colors">Lead Generation</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1 transition-colors">Inquiries received over time</p>
        </div>
        <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 transition-colors duration-300">
          {['7D', '30D', '1Y'].map(range => (
            <button 
              key={range}
              onClick={() => setChartRange(range)}
              disabled={loading}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                chartRange === range 
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full relative mt-auto z-10 flex items-end">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-30 transition-colors duration-300">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        ) : chartData.length > 1 ? (
          <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.0"/>
              </linearGradient>
            </defs>
            <path d={fill} fill="url(#chartGradient)"/>
            <path d={line} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
          </svg>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500 italic transition-colors">
            Not enough data to generate graph.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadChart;