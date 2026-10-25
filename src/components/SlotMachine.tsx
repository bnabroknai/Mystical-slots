import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateReelStrip, 
  generateRandomGrid, 
  evaluateGrid, 
  SymbolType, 
  Archetype,
  ArchetypeDetails
} from '../lib/gameLogic';
import { AlchemicalSymbol } from './AlchemicalSymbol';
import { ArchetypeWheel } from './ArchetypeWheel';

const REEL_COUNT = 5;
const ROW_COUNT = 3;

export const SlotMachine: React.FC = () => {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  
  // Game State
  const [reelStrips, setReelStrips] = useState<SymbolType[][]>([]);
  const [grid, setGrid] = useState<SymbolType[][]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wins, setWins] = useState<any[]>([]);
  const [lastPayout, setLastPayout] = useState(0);
  const [showArchetypeWheel, setShowArchetypeWheel] = useState(false);
  const [activeArchetype, setActiveArchetype] = useState<Archetype | null>(null);
  const [message, setMessage] = useState<string>('Align the Elements');

  // Initialize strips
  useEffect(() => {
    const strips = Array(REEL_COUNT).fill(null).map(() => generateReelStrip());
    setReelStrips(strips);
    setGrid(generateRandomGrid(strips));
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || balance < bet) return;
    
    setBalance(prev => prev - bet);
    setIsSpinning(true);
    setWins([]);
    setLastPayout(0);
    setActiveArchetype(null);
    setMessage('Consulting the Aether...');

    // Simulate spinning delay per reel
    setTimeout(() => {
      const newGrid = generateRandomGrid(reelStrips);
      setGrid(newGrid);
      
      const result = evaluateGrid(newGrid, bet / 10); // betPerLine
      
      setIsSpinning(false);
      setWins(result.wins);
      setLastPayout(result.totalPayout);
      
      if (result.totalPayout > 0) {
        setBalance(prev => prev + result.totalPayout);
        setMessage(`Transmutation Successful! +${result.totalPayout}`);
      } else {
        setMessage('The elements remain inert.');
      }

      if (result.bonusTriggered) {
        setTimeout(() => setShowArchetypeWheel(true), 1000);
      }

    }, 2000); // Overall spin duration
  }, [balance, bet, isSpinning, reelStrips]);

  const handleArchetypeComplete = (archetype: Archetype) => {
    setShowArchetypeWheel(false);
    setActiveArchetype(archetype);
    setMessage(`${ArchetypeDetails[archetype].name} modifier active!`);
    
    // Simplistic handling of archetype features for demonstration.
    // In a full game, each feature would deeply modify gameLogic/grid state.
    if (archetype === Archetype.CAREGIVER) {
        setBalance(prev => prev + bet * 3); // Grant value of 3 free spins instantly
        setMessage("Caregiver protects your balance. 3 free spins value awarded.");
    } else if (archetype === Archetype.EXPLORER) {
        const multi = Math.floor(Math.random() * 9) + 2;
        if (lastPayout > 0) {
            setBalance(prev => prev + (lastPayout * multi) - lastPayout);
            setMessage(`Explorer multiplied win by ${multi}x!`);
        } else {
            setMessage(`Explorer grants a ${multi}x multiplier on next win!`);
        }
    }
  };

  if (grid.length === 0) return null;

  return (
    <div className="w-full min-h-screen bg-mystic-900 text-[#f5f5f4] flex flex-col items-center justify-between font-serif relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aether rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#991b1b] rounded-full blur-[120px]"></div>
      </div>
      
      {/* Header */}
      <header className="w-full pt-6 px-12 flex justify-between items-end border-b border-gold-400/10 pb-4 bg-gradient-to-b from-[#0a0a0d] to-transparent z-10">
        <div>
          <h1 className="text-xs tracking-[0.4em] uppercase text-aether font-sans mb-1">Opus Magnum</h1>
          <h2 className="text-4xl font-light tracking-tighter text-gold-400">ARS ALCHEMIA</h2>
        </div>
        <div className="flex flex-col items-center">
            <div className="h-8 text-gold-500 font-serif text-xl italic opacity-80 text-center">
                {message}
            </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-widest uppercase opacity-50 mb-1">Aetheric Balance</p>
          <p className="text-3xl font-mono text-gold-400 font-bold tracking-widest leading-none">
            <span className="opacity-30">Ω</span> {balance}
          </p>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 w-full flex items-center justify-center px-8 flex-col md:flex-row py-4 gap-4 z-10">
        
        {/* Left Side Archetypes */}
        <aside className="hidden md:flex flex-col gap-3">
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm">
            <span className="text-lg">⚖️</span>
            <span className="text-[8px] uppercase tracking-tighter opacity-70">Innocent</span>
          </div>
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm opacity-40">
            <span className="text-lg">🤝</span>
            <span className="text-[8px] uppercase tracking-tighter">Everyman</span>
          </div>
          <div className={`w-16 h-16 border ${activeArchetype === Archetype.HERO ? 'border-aether/50 bg-teal-900/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'border-gold-400/30 bg-black/40 opacity-40'} flex flex-col items-center justify-center rounded-sm transition-all`}>
            <span className="text-lg">🛡️</span>
            <span className={`text-[8px] uppercase tracking-tighter ${activeArchetype === Archetype.HERO ? 'text-aether font-bold' : ''}`}>Hero</span>
          </div>
          <div className={`w-16 h-16 border ${activeArchetype === Archetype.CAREGIVER ? 'border-aether/50 bg-teal-900/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'border-gold-400/30 bg-black/40 opacity-40'} flex flex-col items-center justify-center rounded-sm transition-all`}>
            <span className="text-lg">❤️</span>
            <span className={`text-[8px] uppercase tracking-tighter ${activeArchetype === Archetype.CAREGIVER ? 'text-aether font-bold' : ''}`}>Caregiver</span>
          </div>
          <div className={`w-16 h-16 border ${activeArchetype === Archetype.EXPLORER ? 'border-aether/50 bg-teal-900/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'border-gold-400/30 bg-black/40 opacity-40'} flex flex-col items-center justify-center rounded-sm transition-all`}>
            <span className="text-lg">🗺️</span>
            <span className={`text-[8px] uppercase tracking-tighter ${activeArchetype === Archetype.EXPLORER ? 'text-aether font-bold' : ''}`}>Explorer</span>
          </div>
          <div className="w-16 h-16 border border-red-500/50 flex flex-col items-center justify-center bg-red-900/20 rounded-sm shadow-[0_0_10px_rgba(153,27,27,0.2)]">
            <span className="text-lg">🔥</span>
            <span className="text-[8px] uppercase tracking-tighter text-red-400 font-bold">Outlaw</span>
          </div>
        </aside>

        {/* Reels Area */}
        <section className="flex-1 max-w-5xl h-[420px] bg-black/60 border-[3px] border-gold-400/50 rounded-xl p-2 flex gap-2 shadow-[0_0_50px_rgba(0,0,0,1)] relative">
          <div className="absolute -inset-4 border border-gold-400/20 rounded-2xl -z-10"></div>
          
          <div className="flex flex-1 gap-2 w-full h-full relative z-10">
            {grid.map((colSymbols, colIndex) => (
              <div key={colIndex} className="flex-1 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-white/5 flex flex-col justify-around p-2 gap-2 relative overflow-hidden">
                {colSymbols.map((symbol, rowIndex) => {
                  const isWinning = wins.some(w => w.positions.some(p => p.col === colIndex && p.row === rowIndex));
                  
                  return (
                    <div key={`${colIndex}-${rowIndex}`} className="flex-1 w-full relative flex flex-col items-center justify-center">
                      <AnimatePresence mode="wait">
                          {!isSpinning ? (
                              <motion.div
                                  key={`sym-${colIndex}-${rowIndex}-${symbol}`}
                                  initial={{ y: -50, opacity: 0, filter: 'blur(4px)' }}
                                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                  exit={{ y: 50, opacity: 0, filter: 'blur(4px)' }}
                                  transition={{ type: 'spring', bounce: 0.4, duration: 0.6, delay: colIndex * 0.1 }}
                                  className="absolute inset-0"
                              >
                                  <AlchemicalSymbol symbol={symbol} isWinning={isWinning} />
                              </motion.div>
                          ) : (
                              <motion.div
                                  key="spinning-ph"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
                              >
                                  <motion.div 
                                      className="w-16 h-64 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent blur-md"
                                      animate={{ y: ['-100%', '100%'] }}
                                      transition={{ duration: 0.2, repeat: Infinity, ease: 'linear', delay: colIndex * 0.05 }}
                                  />
                              </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-b from-[#050507] via-transparent to-[#050507] opacity-80 z-20"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-teal-500/30 -translate-y-1/2 shadow-[0_0_10px_#2dd4bf] pointer-events-none z-20"></div>
        </section>

        {/* Right Side Archetypes */}
        <aside className="hidden md:flex flex-col gap-3">
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm opacity-40">
            <span className="text-lg">🌹</span>
            <span className="text-[8px] uppercase tracking-tighter">Lover</span>
          </div>
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm opacity-40">
            <span className="text-lg">🎨</span>
            <span className="text-[8px] uppercase tracking-tighter">Creator</span>
          </div>
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm opacity-40">
            <span className="text-lg">🎭</span>
            <span className="text-[8px] uppercase tracking-tighter">Jester</span>
          </div>
          <div className="w-16 h-16 border border-white/40 flex flex-col items-center justify-center bg-white/5 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <span className="text-lg">📜</span>
            <span className="text-[8px] uppercase tracking-tighter text-white font-bold">Sage</span>
          </div>
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm opacity-40">
            <span className="text-lg">✨</span>
            <span className="text-[8px] uppercase tracking-tighter">Magician</span>
          </div>
          <div className="w-16 h-16 border border-gold-400/30 flex flex-col items-center justify-center bg-black/40 rounded-sm opacity-40">
            <span className="text-lg">👑</span>
            <span className="text-[8px] uppercase tracking-tighter">Ruler</span>
          </div>
        </aside>
      </main>

      {/* Footer Area */}
      <footer className="w-full h-44 bg-gradient-to-t from-mystic-800 to-[#0a0a0d] border-t border-gold-400/10 flex flex-wrap items-center justify-center gap-8 md:gap-12 z-10 py-4">
        
        <div className="flex gap-4 md:gap-8 items-center">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Win Line</p>
            <p className="text-xl font-mono text-aether">{lastPayout > 0 ? `+ ${lastPayout} Ω` : '-'}</p>
          </div>
          <div className="h-12 w-px bg-white/10 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Total Bet</p>
            <p className="text-xl font-mono text-gold-400">{bet} Ω</p>
          </div>
        </div>

        {/* Transmute Button */}
        <button 
          onClick={handleSpin}
          disabled={isSpinning || balance < bet}
          className="relative group disabled:opacity-50 disabled:cursor-not-allowed mx-4"
        >
          <div className="absolute -inset-4 bg-gold-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="w-24 h-24 md:w-28 md:h-28 bg-gold-400 rounded-full flex flex-col items-center justify-center border-4 border-black shadow-[0_0_30px_rgba(212,175,55,0.4)] cursor-pointer active:scale-95 transition-transform">
            <span className="text-black text-[10px] md:text-xs font-sans font-bold uppercase tracking-widest">{isSpinning ? '...' : 'Transmute'}</span>
            <span className="text-black text-xl md:text-2xl mt-1">☀️</span>
          </div>
        </button>

        <div className="flex gap-4 md:gap-8 items-center">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button 
                onClick={() => setBet(Math.max(10, bet - 10))}
                disabled={isSpinning || bet <= 10}
                className="px-4 py-1 text-[10px] uppercase tracking-widest border border-white/20 hover:border-gold-400 transition-colors disabled:opacity-50"
              >
                Min
              </button>
              <button 
                onClick={() => setBet(bet + 10)}
                disabled={isSpinning || balance < bet + 10}
                className="px-4 py-1 text-[10px] uppercase tracking-widest border border-white/20 hover:border-gold-400 transition-colors disabled:opacity-50"
              >
                Max
              </button>
            </div>
            <button className="w-full py-1 text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">Paytable</button>
          </div>
        </div>

      </footer>

      {/* Decorative vertical lines */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden md:flex flex-col gap-1 pointer-events-none">
        <div className="w-1 h-8 bg-gold-400/20"></div>
        <div className="w-1 h-20 bg-gold-400/50"></div>
        <div className="w-1 h-8 bg-gold-400/20"></div>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden md:flex flex-col gap-1 pointer-events-none">
        <div className="w-1 h-8 bg-gold-400/20"></div>
        <div className="w-1 h-20 bg-gold-400/50"></div>
        <div className="w-1 h-8 bg-gold-400/20"></div>
      </div>

      <AnimatePresence>
          {showArchetypeWheel && (
              <ArchetypeWheel onComplete={handleArchetypeComplete} />
          )}
      </AnimatePresence>

    </div>
  );
};
