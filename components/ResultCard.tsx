import React, { useRef } from 'react';
import { BlessingResult } from '../types';

interface ResultCardProps {
  data: BlessingResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const text = `${data.title}\n\n${data.content}\n\n🐎 2026马年运势: ${data.luckyPrediction}`;
    navigator.clipboard.writeText(text);
    alert('祝福语已复制！Blessing copied!');
  };

  return (
    <div className="animate-[fadeIn_1s_ease-out] w-full max-w-lg mx-auto p-4 z-20 relative pointer-events-auto">
      <div 
        ref={cardRef}
        className="bg-[#fff1f2] border-[6px] border-double border-red-800 p-8 rounded-sm shadow-2xl text-center relative overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(circle, #fff1f2 0%, #ffe4e6 100%)' }}
      >
        {/* Traditional Corner Patterns */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-red-900"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-red-900"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-red-900"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-red-900"></div>

        <div className="mb-6 animate-float">
          <span className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-yellow-100 px-6 py-1 rounded-full text-sm font-bold tracking-[0.2em] uppercase shadow-lg mb-4 border border-yellow-500">
            Year of the Horse
          </span>
          <h2 className="font-calligraphy text-5xl md:text-7xl text-red-700 mt-2 drop-shadow-md leading-tight">
            {data.title}
          </h2>
        </div>

        <div className="space-y-6 relative z-10">
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed font-serif font-medium px-2">
            {data.content}
          </p>
          
          <div className="py-5 border-t border-b border-red-200/50 bg-red-50/50 rounded-lg mt-4">
            <h4 className="text-red-600 font-bold mb-2 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <span>🥠</span> Lucky Fortune <span>🥠</span>
            </h4>
            <p className="text-red-800 italic font-serif text-lg font-semibold">
              "{data.luckyPrediction}"
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <button 
            onClick={handleCopy}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold rounded-full shadow-lg transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
          >
            <span>📋</span> 复制 (Copy)
          </button>
          <button 
            onClick={onReset}
            className="px-6 py-3 bg-white border-2 border-red-800 text-red-800 font-bold rounded-full hover:bg-red-50 transition-colors shadow-sm"
          >
            再来一个 (New)
          </button>
        </div>
        
        {/* Horse Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
           <span className="text-[12rem] font-calligraphy text-red-900">马</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;