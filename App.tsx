import React, { useState, useRef, useEffect, useCallback } from 'react';
import Fireworks from './components/Fireworks';
import FallingParticles from './components/FallingParticles';
import RedEnvelope from './components/RedEnvelope';
import ResultCard from './components/ResultCard';
import SceneEffect from './components/SceneEffect';
import EasterEgg from './components/EasterEgg';
import { generateRandomBlessing } from './services/geminiService';
import { BlessingResult } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'processing' | 'result'>('intro');
  const [result, setResult] = useState<BlessingResult | null>(null);
  
  // Audio state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicUrl = `${import.meta.env.BASE_URL}gongxi.mp3`;

  // Easter Egg state
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (titleClickCount > 0) {
      const timer = setTimeout(() => setTitleClickCount(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [titleClickCount]);

  const handleTitleClick = () => {
    if (titleClickCount + 1 >= 3) {
      setShowEasterEgg(true);
      setTitleClickCount(0);
    } else {
      setTitleClickCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    let listenersRemoved = false;

    function removeInteractionListeners() {
      if (listenersRemoved) return;
      listenersRemoved = true;
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    }

    async function tryAutoPlay(source: 'load' | 'interaction') {
      const audio = audioRef.current;
      if (!audio || audioError || !audio.paused) return;

      try {
        await audio.play();
        removeInteractionListeners();
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn(
          source === 'load'
            ? `Auto-play on page load blocked: ${errorMessage}`
            : `Auto-play after first interaction failed: ${errorMessage}`
        );
      }
    }

    function handleFirstInteraction() {
      void tryAutoPlay('interaction');
    }

    // Try immediately, then retry once when user first interacts with the page.
    void tryAutoPlay('load');
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      removeInteractionListeners();
    };
  }, [audioError]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    
    // If we had an error before, try reloading the source
    if (audioError) {
      audioRef.current.load();
      setAudioError(false);
    }

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        // State update handled in onPause
      } else {
        await audioRef.current.play();
        // State update handled in onPlay
      }
    } catch (e) {
      // Avoid logging full objects that might contain circular references
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("Audio toggle failed:", errorMessage);
      setIsMusicPlaying(false);
    }
  };

  const handleGenerate = async () => {
    // Attempt to play music on first user interaction if not already playing and no error
    if (!isMusicPlaying && audioRef.current && !audioError) {
      audioRef.current.play()
        .catch(e => {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.warn("Auto-play blocked or failed:", errorMessage);
        });
    }

    setStep('processing'); 
    setResult(null);

    try {
      const [aiResult] = await Promise.all([
        generateRandomBlessing(),
        new Promise(resolve => setTimeout(resolve, 500)) // Keep a short transition, but feel faster
      ]);
      setResult(aiResult);
    } catch (e) {
      console.error(e);
      // Fallback handled in service, but good to have reset
      setStep('intro');
    }
  };

  const handleOpenEnvelope = () => {
    setStep('result');
  };

  const resetApp = () => {
    setStep('intro');
    setResult(null);
  };

  // Callback from FallingParticles when background is clicked
  const handleBackgroundClick = useCallback((x: number, y: number) => {
    const event = new CustomEvent('triggerFirework', { detail: { x, y } });
    window.dispatchEvent(event);
  }, []);

  // Logic to determine which theme to show in SceneEffect
  const activeTheme = (step === 'result' && result?.visualTheme === 'golden_horse') 
    ? null 
    : (result?.visualTheme || null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#450a0a] to-[#7f1d1d] text-yellow-100 selection:bg-yellow-500 selection:text-red-900 font-sans">
      <Fireworks />
      <FallingParticles onBackgroundClick={handleBackgroundClick} />
      <SceneEffect theme={activeTheme} />
      
      {/* Audio Element with robust event handling */}
      <audio 
        ref={audioRef} 
        loop 
        src={musicUrl} 
        autoPlay
        preload="auto"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
        onError={(e) => {
          // Prevent circular structure JSON error by logging specific properties only
          const target = e.currentTarget;
          console.error(`Audio Load Error. Code: ${target.error?.code}, Message: ${target.error?.message || 'Unknown error'}`);
          
          // 4 indicates MEDIA_ERR_SRC_NOT_SUPPORTED (often 404 or bad format)
          setAudioError(true);
          setIsMusicPlaying(false);
        }}
      />

      {/* Music Toggle Control */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
        <button 
          onClick={toggleMusic}
          className={`p-3 rounded-full border transition-all text-xl shadow-lg flex items-center justify-center w-12 h-12
            ${audioError 
              ? 'bg-red-800/80 border-red-500 text-white animate-pulse' 
              : 'bg-red-900/50 backdrop-blur-md border-yellow-500/50 hover:bg-red-800'
            }`}
          title={audioError ? "Music File Not Found" : "Toggle Music"}
        >
          {audioError ? '⚠️' : (isMusicPlaying ? '🔊' : '🔇')}
        </button>
        {audioError && (
          <div className="bg-black/80 text-white text-xs p-2 rounded max-w-[150px] text-right shadow-lg border border-red-500/30">
             <p className="font-bold text-red-400 mb-1">无法播放</p>
             <p className="opacity-80">请检查 public 文件夹内是否有 gongxi.mp3</p>
          </div>
        )}
      </div>
      
      {/* Decorative lanterns */}
      <div className="fixed top-0 left-8 w-16 h-24 bg-red-600 rounded-b-3xl shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-float z-10 border-x-4 border-yellow-800 flex justify-center items-center pointer-events-none">
        <div className="border-2 border-yellow-500 w-12 h-16 flex items-center justify-center">
           <span className="text-yellow-400 font-calligraphy text-3xl">春</span>
        </div>
        <div className="absolute -bottom-8 w-1 h-8 bg-yellow-600"></div>
        <div className="absolute -bottom-10 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
      </div>
      
      <div className="fixed top-0 right-16 w-16 h-24 bg-red-600 rounded-b-3xl shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-float z-10 border-x-4 border-yellow-800 flex justify-center items-center pointer-events-none" style={{ animationDelay: '1.5s' }}>
        <div className="border-2 border-yellow-500 w-12 h-16 flex items-center justify-center">
          <span className="text-yellow-400 font-calligraphy text-3xl">福</span>
        </div>
        <div className="absolute -bottom-8 w-1 h-8 bg-yellow-600"></div>
        <div className="absolute -bottom-10 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pointer-events-none">
        
        {/* Header Logo/Title */}
        <div className={`transition-all duration-700 ${step === 'intro' ? 'scale-100 mb-6 md:mb-8' : 'scale-75 mb-0'} text-center cursor-pointer pointer-events-auto`} onClick={handleTitleClick}>
           <h1 className="font-calligraphy text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] filter">
             {step === 'result' ? '吉星高照' : '金马贺岁'}
           </h1>
           <p className="text-yellow-200/80 tracking-[0.5em] mt-2 font-serif uppercase text-xs md:text-lg">
             2026 Year of the Horse
           </p>
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center justify-center min-h-[400px]">
          {step === 'intro' && (
            <div className="text-center animate-[fadeIn_1s_ease-out] flex flex-col items-center pointer-events-none px-4">
              
              {/* Info Text */}
              <div className="max-w-sm md:max-w-md mx-auto mb-8 pointer-events-none relative z-10">
                 <p className="text-2xl md:text-3xl text-yellow-300 font-calligraphy leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] mb-6 tracking-wider">
                   点击下方按钮<br/>领取金马赐予的神秘祝福
                 </p>
                 <div className="flex flex-col gap-3">
                    <p className="text-sm md:text-base text-yellow-100 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2">
                       <span className="animate-bounce">🧧</span> 点击飘落红包获取额外好运
                    </p>
                    <p className="text-sm md:text-base text-yellow-100 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2">
                       <span className="animate-pulse">🎆</span> 点击屏幕空白处点燃绚丽烟花
                    </p>
                 </div>
              </div>

              {/* Main Button */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 group transition-transform duration-300 hover:scale-105 active:scale-95 pointer-events-none">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-yellow-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] md:shadow-[0_0_50px_rgba(220,38,38,0.6)] group-hover:shadow-[0_0_80px_rgba(234,179,8,0.8)] transition-all duration-300"></div>
                  <div className="absolute inset-2 border-2 border-dashed border-yellow-500/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-5xl md:text-6xl mb-2 animate-bounce">🧧</span>
                    <span className="text-xl md:text-2xl font-bold text-yellow-100 font-calligraphy">赐福 (Blessing)</span>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    className="absolute inset-0 w-full h-full rounded-full cursor-pointer pointer-events-auto"
                    style={{ clipPath: 'circle(50% at 50% 50%)' }}
                    aria-label="Generate Blessing"
                  ></button>
              </div>
            </div>
          )}

          {(step === 'processing' || (step === 'result' && !result)) && (
            <div className="w-full animate-[fadeIn_0.5s_ease-out]">
               <RedEnvelope 
                 isOpen={false} 
                 isLoading={!result} 
                 disabled={!result} 
                 onOpen={handleOpenEnvelope}
               />
               {result && (
                  <div className="text-center mt-6 pointer-events-auto">
                    <p className="text-yellow-300 font-bold text-2xl drop-shadow-md bg-black/30 p-3 rounded-xl inline-block backdrop-blur-md animate-pulse cursor-pointer" onClick={handleOpenEnvelope}>
                      ✨ 祥瑞已至，点击拆开！<br/>(Tap Envelope)
                    </p>
                  </div>
               )}
            </div>
          )}

          {step === 'result' && result && (
             <ResultCard data={result} onReset={resetApp} />
          )}
        </div>
      </main>

      {showEasterEgg && <EasterEgg onClose={() => setShowEasterEgg(false)} />}

      <footer className="absolute bottom-2 w-full text-center text-yellow-500/30 text-xs font-serif z-10 pointer-events-none">
        Powered by Local Blessing Library • 恭喜发财
      </footer>
    </div>
  );
};

export default App;
