import React from 'react';

interface RedEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const RedEnvelope: React.FC<RedEnvelopeProps> = ({ isOpen, onOpen, isLoading, disabled }) => {
  return (
    <div className="relative w-72 h-96 cursor-pointer group perspective-1000 mx-auto my-8 pointer-events-auto">
      <div 
        className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${isOpen ? 'rotate-y-180' : ''}`}
        onClick={() => !disabled && !isOpen && onOpen()}
      >
        {/* Front of the Envelope */}
        <div className={`absolute w-full h-full bg-red-600 rounded-lg shadow-2xl border-2 border-yellow-500 flex flex-col items-center justify-center backface-hidden ${isOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          <div className="absolute top-0 w-full h-24 bg-red-700 rounded-t-lg border-b-2 border-yellow-500 z-10"></div>
          
          <div className="z-20 w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-4 border-yellow-200 overflow-hidden relative">
            {/* Horse Icon / Text */}
            <span className="font-calligraphy text-6xl text-red-600 select-none relative z-10">马</span>
             {/* Subtle pattern inside circle */}
            <div className="absolute inset-0 border-2 border-red-500/20 rounded-full scale-90"></div>
          </div>
          
          <div className="mt-10 text-yellow-200 font-serif text-lg tracking-widest text-center px-4">
             {isLoading ? "Generating Luck..." : "点击开启 (Open)"}
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-30 backdrop-blur-sm">
               <div className="flex flex-col items-center">
                 <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                 <span className="text-yellow-200 text-xs font-bold animate-pulse">祈福中...</span>
               </div>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 text-4xl animate-bounce" style={{animationDuration: '2s'}}>🐎</div>
          <div className="absolute bottom-4 right-4 text-4xl animate-pulse">✨</div>
        </div>
      </div>
    </div>
  );
};

export default RedEnvelope;