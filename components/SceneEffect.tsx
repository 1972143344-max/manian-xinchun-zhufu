import React from 'react';
import { VisualTheme } from '../types';

interface SceneEffectProps {
  theme: VisualTheme | null;
}

const SceneEffect: React.FC<SceneEffectProps> = ({ theme }) => {
  if (!theme) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden perspective-[1200px]">
      
      {/* ---------------- GOLDEN HORSE 3D CHARIOT EFFECT ---------------- */}
      {theme === 'golden_horse' && (
        <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
            {/* 
               The Chariot Group Container 
               Trajectory: Starts top right, ends in the "Dark Red Box" of the envelope.
               
               ANIMATION LOGIC:
               - Desktop: Ends at translateY(-115px) scale(0.9)
               - Mobile: Ends at translateY(-132px) scale(0.85) (Handled in <style> media query below)
            */}
            <div className="absolute top-1/2 left-1/2 animate-[chariotArrive_2.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards] transform-style-3d origin-center">
                
                {/* 1. Atmosphere/Glow */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[80px] bg-yellow-400/30 blur-[30px] rounded-full mix-blend-screen animate-pulse"></div>

                {/* CONTAINER FOR HORSE AND CART */}
                <div className="relative flex items-end transform-style-3d -translate-x-1/2">
                    
                    {/* --- A. THE HORSE (Leading in front/left) --- */}
                    <div className="relative z-30 mr-2">
                        {/* 6xl size, no extra translation to keep layout clean */}
                        <div className="text-6xl leading-none filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] animate-[gallop_0.4s_infinite_linear]">
                            🐎
                        </div>
                        {/* Dust kicking up under horse */}
                        <div className="absolute bottom-1 right-2 text-lg opacity-60 animate-[dust_0.6s_infinite] delay-100">💨</div>
                    </div>

                    {/* --- B. THE REINS (Connecting Horse and Cart) --- */}
                    {/* Positioned to bridge the gap created by mr-2/ml-2 */}
                    <div className="absolute left-[50px] bottom-[25px] w-10 h-1 bg-yellow-600 origin-left rotate-12 z-20"></div>

                    {/* --- C. THE CART (Following behind/right) --- */}
                    {/* Added ml-2 to separate from horse tail */}
                    <div className="relative z-20 ml-2 mb-1 transform-style-3d">
                        {/* Cart Body */}
                        <div className="relative w-24 h-16 bg-gradient-to-b from-red-800 to-red-900 border-2 border-yellow-600 rounded-lg shadow-xl flex items-center justify-center transform rotate-y-12">
                            
                            {/* Wheel */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black border-[2px] border-yellow-500 rounded-full flex items-center justify-center animate-[spin_0.3s_linear_infinite] shadow-md z-30">
                                <div className="w-full h-0.5 bg-yellow-500 absolute"></div>
                                <div className="w-full h-0.5 bg-yellow-500 absolute rotate-45"></div>
                                <div className="w-full h-0.5 bg-yellow-500 absolute rotate-90"></div>
                                <div className="w-full h-0.5 bg-yellow-500 absolute rotate-[135deg]"></div>
                            </div>

                            {/* --- THE CARGO --- */}
                            
                            {/* 1. Main "Fu" Doufang */}
                            <div className="absolute -top-6 z-10 animate-[bounceCargo_0.5s_infinite]">
                                <div className="relative w-10 h-10 bg-red-600 border-[1.5px] border-yellow-400 shadow-md transform rotate-45 flex items-center justify-center box-border">
                                     <div className="absolute inset-0.5 border border-dashed border-yellow-500/50"></div>
                                     <span className="transform -rotate-45 text-xl font-calligraphy text-yellow-100 drop-shadow-sm font-bold">
                                        福
                                     </span>
                                </div>
                            </div>

                            {/* 2. Red Envelopes */}
                            <div className="absolute -top-2 -left-3 text-xl transform -rotate-12 animate-[bounceCargo_0.6s_infinite] delay-75">🧧</div>
                            <div className="absolute -top-2 -right-3 text-xl transform rotate-12 animate-[bounceCargo_0.5s_infinite] delay-150">🧧</div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ---------------- WEALTH SHOWER ---------------- */}
      {theme === 'wealth_shower' && (
        <div className="w-full h-full relative">
          {[...Array(25)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-5xl animate-[fall_3s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                top: '-80px',
                filter: 'drop-shadow(0 0 5px gold)'
              }}
            >
              {i % 2 === 0 ? '💰' : '🧧'}
            </div>
          ))}
        </div>
      )}

      {/* ---------------- SPRING BLOSSOM ---------------- */}
      {theme === 'spring_blossom' && (
        <div className="w-full h-full relative">
           <div className="absolute bottom-0 left-0 text-[10rem] animate-[growUp_2s_ease-out_forwards] origin-bottom-left text-pink-400 opacity-80 filter drop-shadow-lg">🌸</div>
           <div className="absolute bottom-0 right-0 text-[8rem] animate-[growUp_2.5s_ease-out_forwards] origin-bottom-right text-pink-300 opacity-80 filter drop-shadow-lg" style={{animationDelay: '0.5s'}}>🌺</div>
           {[...Array(12)].map((_, i) => (
             <div 
               key={i}
               className="absolute text-4xl animate-[float_4s_ease-in-out_infinite]"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 2}s`,
                 opacity: 0.8
               }}
             >
               🌸
             </div>
           ))}
        </div>
      )}
      
      {/* ---------------- LANTERN FESTIVAL ---------------- */}
      {theme === 'lantern_festival' && (
         <div className="w-full h-full relative">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute text-7xl animate-[float_5s_ease-in-out_infinite]"
                style={{
                   left: `${5 + Math.random() * 90}%`,
                   bottom: '-150px',
                   animationName: 'floatUp',
                   animationDuration: `${12 + Math.random() * 10}s`,
                   animationDelay: `${Math.random() * 6}s`,
                   filter: 'drop-shadow(0 0 15px rgba(255, 69, 0, 0.6))'
                }}
              >
                🏮
              </div>
            ))}
         </div>
      )}

      {/* ---------------- FIREWORKS GRAND ---------------- */}
      {theme === 'fireworks_grand' && (
        <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-7xl md:text-[10rem] font-bold text-yellow-500/30 animate-[ping_1.5s_ease-out_infinite] blur-sm font-calligraphy">
              大吉大利
            </h2>
        </div>
      )}

      <style>{`
        /* 3D Chariot Arrival Animation */
        
        /* Default / Desktop Base */
        @keyframes chariotArrive {
          0% {
            opacity: 0;
            transform: translate3d(40vw, -40vh, -1500px) scale(0.5) rotateY(-15deg);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            /* Desktop: -115px looks perfect */
            transform: translate3d(0, -115px, 0) scale(0.9) rotateY(0deg);
            filter: blur(0);
          }
        }

        /* Mobile Override (Max Width 768px) */
        @media (max-width: 768px) {
          @keyframes chariotArrive {
            0% {
              opacity: 0;
              transform: translate3d(40vw, -40vh, -1500px) scale(0.5) rotateY(-15deg);
              filter: blur(5px);
            }
            100% {
              opacity: 1;
              /* Mobile: Lift it up higher (-132px) and shrink slightly (0.85) to fit */
              transform: translate3d(0, -132px, 0) scale(0.85) rotateY(0deg);
              filter: blur(0);
            }
          }
        }

        @keyframes gallop {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-2px) rotate(2deg); }
        }

        @keyframes bounceCargo {
          0%, 100% { transform: translateY(0) rotate(45deg); } 
          50% { transform: translateY(-2px) rotate(45deg); }
        }

        @keyframes dust {
            0% { transform: translate(0,0) scale(0.5); opacity: 0; }
            50% { opacity: 0.6; }
            100% { transform: translate(-10px, -5px) scale(1.2); opacity: 0; }
        }

        @keyframes spin {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(-360deg); }
        }

        @keyframes fall {
          to { transform: translateY(110vh) rotate(360deg); }
        }
        @keyframes growUp {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 0.8; }
        }
        @keyframes floatUp {
           from { transform: translateY(0) rotate(0deg); }
           to { transform: translateY(-120vh) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default SceneEffect;