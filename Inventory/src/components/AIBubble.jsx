import { Brain } from "lucide-react";

// AI/Brain Bubble
export function AIBubble({ size = 50, className = "" }) {
  return (
    <div 
      className={` fixed top-56 right-20 group cursor-pointer animate-float ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className="w-full h-full bg-red-900/20 backdrop-blur-sm rounded-full border border-gray-300/20 flex items-center justify-center hover:bg-gray-800/30 hover:border-gray-200/30 transition-all duration-300 hover:scale-110">
        <Brain 
          className="text-red-600 group-hover:text-gray-800 transition-colors duration-300" 
          size={size * 0.35} 
        />
      </div>
      <div className="absolute inset-0 bg-gray-400/10 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      <div className="absolute inset-0 border-2 border-gray-400/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-12px) rotate(180deg); }
          75% { transform: translateY(-28px) rotate(270deg); }
        }
        .animate-float { animation: float 35s linear infinite; }
        .animate-float:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}