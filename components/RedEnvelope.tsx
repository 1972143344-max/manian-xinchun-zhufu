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
        <div
          className={`absolute w-full h-full bg-red-600 rounded-lg shadow-2xl border-2 border-yellow-500 flex flex-col items-center justify-center backface-hidden ${isOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        >
          <div className="absolute top-0 w-full h-24 bg-red-700 rounded-t-lg border-b-2 border-yellow-500 z-10"></div>

          {/* Always-visible horse chariot in the top red panel */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
            <div className="relative flex items-end animate-[miniChariotRide_2.6s_ease-in-out_infinite]">
              <div className="text-[2.1rem] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] animate-[miniHorseNod_0.45s_linear_infinite]">
                🐎
              </div>
              <div className="mb-3 mx-1 w-9 h-[2px] rounded-full bg-yellow-300/90"></div>

              <div className="relative mb-[2px] w-16 h-10 rounded-md border border-yellow-300 bg-gradient-to-b from-red-500 to-red-700 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 border border-yellow-300 transform rotate-45 flex items-center justify-center">
                  <span className="text-[0.7rem] leading-none text-yellow-100 font-calligraphy font-bold -rotate-45">
                    福
                  </span>
                </div>
                <div className="absolute -top-2 left-1 text-sm drop-shadow-sm">🧧</div>
                <div className="absolute -top-2 right-1 text-sm drop-shadow-sm">🧧</div>

                <div className="absolute -bottom-2 left-2.5 w-4 h-4 rounded-full border border-yellow-300 bg-red-950 animate-[miniWheel_0.35s_linear_infinite]">
                  <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-yellow-300/80"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-yellow-300/80"></div>
                </div>
                <div className="absolute -bottom-2 right-2.5 w-4 h-4 rounded-full border border-yellow-300 bg-red-950 animate-[miniWheel_0.35s_linear_infinite]">
                  <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-yellow-300/80"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-yellow-300/80"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="z-20 w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-4 border-yellow-200 overflow-hidden relative">
            <span className="font-calligraphy text-6xl text-red-600 select-none relative z-10">马</span>
            <div className="absolute inset-0 border-2 border-red-500/20 rounded-full scale-90"></div>
          </div>

          <div className="mt-10 text-yellow-200 font-serif text-lg tracking-widest text-center px-4">
            {isLoading ? 'Generating Luck...' : '点击开启 (Open)'}
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-30 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-yellow-200 text-xs font-bold animate-pulse">祈福中...</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
            🐎
          </div>
          <div className="absolute bottom-4 right-4 text-4xl animate-pulse">✨</div>
        </div>
      </div>

      <style>{`
        @keyframes miniChariotRide {
          0%, 100% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
        }

        @keyframes miniHorseNod {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }

        @keyframes miniWheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default RedEnvelope;
