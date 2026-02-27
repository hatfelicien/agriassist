interface PriceTrendProps {
  data: { price: number; timestamp: number }[];
  product: string;
}

export default function PriceTrend({ data, product }: PriceTrendProps) {
  if (data.length < 2) return null;

  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const range = maxPrice - minPrice || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.price - minPrice) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const trend = data[data.length - 1].price > data[0].price ? 'up' : 'down';

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">{product}</span>
        <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(data[data.length - 1].price - data[0].price)} RWF
        </span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-16">
        <polyline
          points={points}
          fill="none"
          stroke={trend === 'up' ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
