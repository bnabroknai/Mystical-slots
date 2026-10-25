import React from 'react';
import { SymbolType, SymbolValues } from '../lib/gameLogic';
import { Mountain, Wind, Flame, Droplets, Anchor, Sword, Coins, Moon, Sun, Gem, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const icons: Record<SymbolType, React.ElementType> = {
  [SymbolType.EARTH]: Mountain,
  [SymbolType.AIR]: Wind,
  [SymbolType.FIRE]: Flame,
  [SymbolType.WATER]: Droplets,
  [SymbolType.SATURN]: Anchor,
  [SymbolType.JUPITER]: Coins, // Tin/Wealth
  [SymbolType.MARS]: Sword,
  [SymbolType.VENUS]: Sparkles, // Copper/Beauty
  [SymbolType.MERCURY]: Sparkles,
  [SymbolType.MOON]: Moon,
  [SymbolType.SUN]: Sun,
  [SymbolType.STONE]: Gem,
  [SymbolType.BONUS]: Sparkles,
};

// Alchemical Unicode Characters for flavor
const alchemicalChars: Record<SymbolType, string> = {
  [SymbolType.EARTH]: '🜃',
  [SymbolType.AIR]: '🜁',
  [SymbolType.FIRE]: '🜂',
  [SymbolType.WATER]: '🜄',
  [SymbolType.SATURN]: '♄',
  [SymbolType.JUPITER]: '♃',
  [SymbolType.MARS]: '♂',
  [SymbolType.VENUS]: '♀',
  [SymbolType.MERCURY]: '☿',
  [SymbolType.MOON]: '☽',
  [SymbolType.SUN]: '☉',
  [SymbolType.STONE]: '🜍',
  [SymbolType.BONUS]: '🌀',
};

interface Props {
  symbol: SymbolType;
  isWinning?: boolean;
}

export const AlchemicalSymbol: React.FC<Props> = ({ symbol, isWinning }) => {
  const Icon = icons[symbol] || Sparkles;
  const val = SymbolValues[symbol];

  return (
    <motion.div
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 rounded-lg border border-transparent transition-all duration-300 ${val.color}
        ${isWinning ? 'bg-mystic-800/80 border-gold-500/50 glow-box scale-110 z-10' : 'opacity-80 scale-100'}
      `}
      animate={isWinning ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={isWinning ? { duration: 0.5, repeat: Infinity, repeatType: "reverse" } : {}}
    >
      <div className="absolute top-1 right-2 text-xs opacity-40 font-serif">
        {alchemicalChars[symbol]}
      </div>
      <Icon size={48} strokeWidth={isWinning ? 2.5 : 1.5} className={isWinning ? "filter drop-shadow-[0_0_8px_currentColor]" : ""} />
      {isWinning && symbol === SymbolType.STONE && (
        <motion.div 
          className="absolute inset-0 bg-rose-500/20 mix-blend-screen rounded-lg"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};
