import React, { useState, useEffect } from 'react';
import { generateTranslationChallenge, validateTranslation } from '../services/geminiService';
import { TranslationChallengeData, TranslationResult, GameState } from '../types';
import { Button } from './Button';
import { Languages, CheckCircle2, XCircle, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';

export const TranslationDuel: React.FC = () => {
  const [data, setData] = useState<TranslationChallengeData | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [userTranslation, setUserTranslation] = useState('');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadChallenge = async () => {
    setGameState(GameState.LOADING);
    setResult(null);
    setUserTranslation('');
    setData(null);
    try {
      const challengeData = await generateTranslationChallenge(targetLang);
      setData(challengeData);
      setGameState(GameState.PLAYING);
    } catch (e) {
      setGameState(GameState.ERROR);
    }
  };

  useEffect(() => {
    loadChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !userTranslation.trim()) return;

    setIsSubmitting(true);
    try {
      const validation = await validateTranslation(data.phrase, userTranslation, data.context);
      setResult(validation);
      setGameState(validation.isCorrect ? GameState.SUCCESS : GameState.FAILURE);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameState === GameState.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <RefreshCw className="w-10 h-10 text-accent-500 animate-spin" />
        <p className="text-accent-200">Consulting the Polyglot Engine...</p>
      </div>
    );
  }

  if (gameState === GameState.ERROR) {
    return (
        <div className="text-center p-8 bg-red-900/20 rounded-2xl border border-red-500/50">
        <h3 className="text-xl font-bold text-red-200 mb-2">Error</h3>
        <p className="text-red-300 mb-6">Could not load translation challenge.</p>
        <Button onClick={loadChallenge} variant="secondary">Retry</Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex justify-end mb-4">
         <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:ring-accent-500 focus:border-accent-500"
         >
           <option value="Spanish">Spanish</option>
           <option value="French">French</option>
           <option value="German">German</option>
           <option value="Japanese">Japanese</option>
           <option value="Italian">Italian</option>
         </select>
      </div>

      {/* Challenge Card */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 p-8 rounded-3xl border border-indigo-500/30 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Languages className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-indigo-300 text-sm font-semibold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            Context: {data.context}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            "{data.phrase}"
          </h2>
          <p className="text-slate-400 text-lg">Translate this into <span className="text-indigo-400 font-bold">English</span></p>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            disabled={gameState === GameState.SUCCESS || gameState === GameState.FAILURE}
            placeholder="Enter your translation here..."
            className={`w-full bg-slate-900 border-2 ${
                result?.isCorrect ? 'border-green-500/50' : result ? 'border-red-500/50' : 'border-slate-700'
            } rounded-2xl p-6 text-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/20 transition-all resize-none min-h-[120px]`}
          />
          
          {(!result) && (
             <div className="mt-4 flex justify-end">
                <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isSubmitting}
                    disabled={!userTranslation.trim()}
                >
                    Submit Translation
                </Button>
             </div>
          )}
        </form>

        {/* Result Area */}
        {result && (
            <div className={`p-6 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                result.isCorrect ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
            }`}>
                <div className="flex items-start gap-4 mb-4">
                    {result.isCorrect ? (
                        <CheckCircle2 className="w-8 h-8 text-green-400 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${result.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                            {result.isCorrect ? 'Excellent Translation!' : 'Needs Improvement'}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            {result.feedback}
                        </p>
                    </div>
                </div>

                {!result.isCorrect && result.betterTranslation && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-400 uppercase">Better:</span>
                        <span className="text-white font-medium">{result.betterTranslation}</span>
                    </div>
                )}
                
                <div className="mt-6 flex justify-end">
                     <Button onClick={loadChallenge} variant="secondary" className="gap-2">
                        Next Challenge <ArrowRight className="w-4 h-4" />
                     </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};