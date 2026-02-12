import React, { useEffect } from 'react';

interface EasterEggProps {
  onClose: () => void;
}

const EasterEgg: React.FC<EasterEggProps> = ({ onClose }) => {
  useEffect(() => {
    // Auto close after 8 seconds
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-[fadeIn_0.5s_ease-out] border-y-8 border-yellow-500/20">
      <div className="text-center relative p-8 rounded-3xl border-2 border-yellow-500/50 bg-red-900/60 shadow-[0_0_60px_rgba(255,215,0,0.3)] max-w-2xl mx-4 overflow-hidden">
        
        {/* Glowing background behind the horse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="text-[8rem] animate-bounce relative z-10 drop-shadow-2xl filter saturate-150">🐎</div>
        
        <h2 className="text-6xl md:text-8xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-t from-yellow-400 to-yellow-100 mb-6 animate-[pulse_2s_infinite] drop-shadow-sm">
          万马奔腾！
        </h2>
        
        <div className="space-y-4 text-yellow-100/90 font-serif relative z-10">
            <p className="text-2xl font-bold text-yellow-300">
              恭喜您发现了隐藏彩蛋！
            </p>
            <p className="text-xl leading-relaxed">
              愿您在2026年马力全开，<br/>
              一马当先，前程似锦，万事如意！
            </p>
        </div>
        
        {/* Confetti simulation */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl">
             <div className="absolute top-10 left-10 text-5xl animate-[float_3s_infinite] opacity-80">🧧</div>
             <div className="absolute bottom-10 right-10 text-5xl animate-[float_4s_infinite] opacity-80">💰</div>
             <div className="absolute top-1/3 right-10 text-4xl animate-[float_5s_infinite] delay-75 opacity-60">✨</div>
             <div className="absolute bottom-1/3 left-10 text-4xl animate-[float_4s_infinite] delay-150 opacity-60">✨</div>
        </div>

        <button 
          onClick={onClose}
          className="mt-10 px-10 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-red-900 font-bold rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95 border-2 border-yellow-200"
        >
          收下祝福 (Close)
        </button>
      </div>
    </div>
  );
};

export default EasterEgg;