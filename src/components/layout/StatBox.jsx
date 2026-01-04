import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

function AnimatedNumber({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return (
    <span>
      {typeof value === 'number' && !value.toString().includes('.') 
        ? Math.floor(count) 
        : count.toFixed(1)}
    </span>
  );
}

export default function StatBox({ stats }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const gradients = [
    'from-rose-500 to-pink-500',
    'from-orange-500 to-amber-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500'
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
      {stats.map((s, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative bg-white border-2 border-slate-100 rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
        >
          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          {/* Animated Border Glow */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradients[i]} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
          
          <div className="relative">
            {/* Icon with Animation */}
            <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${gradients[i]} text-white text-3xl transform transition-transform duration-300 ${hoveredIndex === i ? 'scale-110 rotate-12' : ''}`}>
              {s.icon}
            </div>

            {/* Trending Indicator */}
            {hoveredIndex === i && (
              <div className="absolute top-0 right-0 flex items-center gap-1 text-green-500 text-xs font-semibold animate-fadeUp">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
            )}

            {/* Value with Animation */}
            <div className={`text-4xl font-bold bg-gradient-to-r ${gradients[i]} bg-clip-text text-transparent mb-2`}>
              <AnimatedNumber value={s.value} />
            </div>

            {/* Label */}
            <p className="text-slate-600 font-medium">{s.label}</p>

            {/* Decorative Line */}
            <div className={`mt-4 h-1 w-0 group-hover:w-full mx-auto rounded-full bg-gradient-to-r ${gradients[i]} transition-all duration-500`}></div>
          </div>

          {/* Corner Decoration */}
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradients[i]} opacity-5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500`}></div>
        </div>
      ))}
    </div>
  );
}