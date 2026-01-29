import React, { useState, useEffect } from 'react';
import { generateMysteryWord } from '../services/geminiService';
import { MysteryWordData, GameState } from '../types';
import { Button } from './Button';
import { Lightbulb, HelpCircle, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';

export const MysteryWord: React.FC = () => {
  const [data, setData] = useState<MysteryWordData | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [guess, setGuess] = useState('');
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadGame = async () => {
    setGameState(GameState.LOADING);
    setRevealedHints(0);
    setGuess('');
    setFeedback(null);
    setData(null);
    try {
      const wordData = await generateMysteryWord('easy');
      setData(wordData);
      setGameState(GameState.PLAYING);
    } catch (e) {
      setGameState(GameState.ERROR);
    }
  };

  useEffect(() => {
    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !guess.trim()) return;

    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedTarget = data.word.toLowerCase();

    if (normalizedGuess === normalizedTarget) {
      setGameState(GameState.SUCCESS);
      setFeedback("Correct! You nailed it.");
    } else {
      setFeedback("Not quite. Try again or use a hint!");
      // Simple logic: if incorrect, shake input (handled via feedback visually)
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const revealHint = () => {
    if (revealedHints < 3) {
      setRevealedHints(prev => prev + 1);
    }
  };

  if (gameState === GameState.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-xl text-brand-200 font-display">Summoning the Oracle...</p>
      </div>
    );
  }

  if (gameState === GameState.ERROR) {
    return (
      <div className="text-center p-8 bg-red-900/20 rounded-2xl border border-red-500/50">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-200 mb-2">Connection Severed</h3>
        <p className="text-red-300 mb-6">The ancient spirits failed to retrieve a word.</p>
        <Button onClick={loadGame} variant="secondary">Try Again</Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header Info */}
      <div className="bg-slate-800/50 p-6 rounded-3xl backdrop-blur-sm border border-slate-700/50 shadow-2xl mb-8">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-brand-900/50 text-brand-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-700">
            {data.partOfSpeech}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i < revealedHints ? 'bg-yellow-500' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8 tracking-tight">
          {gameState === GameState.SUCCESS ? (
            <span className="text-green-400 drop-shadow-lg">{data.word.toUpperCase()}</span>
          ) : (
            <span className="tracking-[0.5em] text-slate-500">
              {data.word.split('').map(c => c === ' ' ? ' ' : '_').join('')}
            </span>
          )}
        </h2>

        {gameState === GameState.SUCCESS && (
          <div className="text-center mb-6 animate-bounce">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <p className="text-green-300 font-bold">{data.definition}</p>
          </div>
        )}
      </div>

      {/* Hints Section */}
      <div className="space-y-3 mb-8">
        {data.hints.map((hint, idx) => (
          <div 
            key={idx}
            className={`transition-all duration-500 overflow-hidden ${
              idx < revealedHints || gameState === GameState.SUCCESS
                ? 'opacity-100 max-h-20 scale-100' 
                : 'opacity-0 max-h-0 scale-95'
            }`}
          >
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-slate-200">{hint}</p>
            </div>
          </div>
        ))}
        
        {revealedHints < 3 && gameState !== GameState.SUCCESS && (
          <button 
            onClick={revealHint}
            className="w-full py-3 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-brand-300 hover:border-brand-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Reveal Next Hint
          </button>
        )}
      </div>

      {/* Controls */}
      {gameState !== GameState.SUCCESS ? (
        <form onSubmit={handleGuess} className="relative">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess..."
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl py-4 px-6 text-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all shadow-inner"
            autoFocus
          />
          <div className="absolute right-2 top-2 bottom-2">
            <Button type="submit" variant="primary" className="h-full rounded-xl">Guess</Button>
          </div>
          {feedback && (
            <p className="absolute -bottom-8 left-0 right-0 text-center text-red-400 font-semibold animate-pulse">
              {feedback}
            </p>
          )}
        </form>
      ) : (
        <div className="flex justify-center">
          <Button onClick={loadGame} variant="primary" className="w-full md:w-auto min-w-[200px]">
            <RotateCcw className="w-5 h-5" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
};