
import React from 'react';

interface MiniSparklineProps {
  data: number[];
  color: string;
  trend: 'up' | 'down' | 'stable';
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({ data, color, trend }) => {
  const width = 60;
  const height = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex items-center space-x-1">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
      <div className={`w-3 h-3 flex items-center justify-center text-xs ${
        trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
      }`}>
        <i className={`ri-arrow-${trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'right'}-line`}></i>
      </div>
    </div>
  );
};
