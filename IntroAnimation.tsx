import React, { useEffect, useState } from 'react';

export const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Sequence timing
    const timers = [
      setTimeout(() => setStage(1), 500),  // Colors sweep
      setTimeout(() => setStage(2), 2000), // Text reveal
      setTimeout(() => setStage(3), 4000), // Fade out
      setTimeout(() => onComplete(), 4800) // Unmount
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (stage === 4) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-1000 ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Kinetic Layers */}
      <div className={`absolute inset-0 bg-palestine-green transform transition-transform duration-1000 ease-in-out ${stage >= 1 ? 'translate-x-full delay-100' : '-translate-x-full'}`}></div>
      <div className={`absolute inset-0 bg-white transform transition-transform duration-1000 ease-in-out ${stage >= 1 ? 'translate-x-full delay-200' : '-translate-x-full'}`}></div>
      <div className={`absolute inset-0 bg-palestine-black transform transition-transform duration-1000 ease-in-out ${stage >= 1 ? 'translate-x-full delay-300' : '-translate-x-full'}`}></div>
      
      {/* Main Content Reveal */}
      <div className={`relative z-10 text-center transition-all duration-1000 transform ${stage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="flex justify-center mb-6">
           <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-palestine-red to-palestine-black rounded-full animate-spin-slow opacity-50 blur-xl"></div>
              <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center border-4 border-palestine-gold shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                 <span className="text-6xl animate-pulse">🇵🇸</span>
              </div>
           </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter drop-shadow-2xl">
          فلسطين
        </h1>
        <p className="text-2xl md:text-4xl text-palestine-gold font-serif mt-4 font-bold tracking-widest opacity-90">
          الأرض التي لا تموت
        </p>

        <div className="mt-8 flex justify-center gap-2">
            <span className="w-16 h-1 bg-palestine-red rounded-full animate-pulse"></span>
            <span className="w-4 h-1 bg-palestine-green rounded-full animate-pulse delay-100"></span>
            <span className="w-4 h-1 bg-palestine-white rounded-full animate-pulse delay-200"></span>
        </div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-palestine-gold rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-palestine-green rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};