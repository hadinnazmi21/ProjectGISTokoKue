import { Cake } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10">
        {/* Spinning Loader */}
        <div className="relative w-32 h-32">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-rose-200"></div>
          
          {/* Spinning Gradient Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500 border-r-pink-500 animate-spin"></div>
          
          {/* Inner Spinning Ring */}
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-purple-500 border-l-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full shadow-2xl animate-pulse">
              <Cake className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 text-center relative z-10">
        <p className="text-xl text-slate-700 font-bold mb-2">
          Memuat Data Toko Kue
        </p>
        <p className="text-sm text-slate-500">
          Mohon tunggu sebentar...
        </p>
      </div>
      
      {/* Animated Dots */}
      <div className="mt-6 flex space-x-2 relative z-10">
        <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full overflow-hidden relative z-10">
        <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full animate-pulse" style={{ width: '70%', animation: 'progress 2s ease-in-out infinite' }}></div>
      </div>

      {/* Floating Cake Icons */}
      <div className="absolute top-1/4 left-1/3 animate-float">
        <div className="text-4xl opacity-30">🍰</div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '1s' }}>
        <div className="text-3xl opacity-20">🧁</div>
      </div>
      <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="text-3xl opacity-25">🎂</div>
      </div>

      <style>{`
        @keyframes progress {
          0%, 100% { width: 30%; }
          50% { width: 80%; }
        }
      `}</style>
    </div>
  );
}