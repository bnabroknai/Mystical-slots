import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Archetype, ArchetypeDetails } from '../lib/gameLogic';
import { Sparkles, X } from 'lucide-react';

interface Props {
  onComplete: (archetype: Archetype) => void;
}

export const ArchetypeWheel: React.FC<Props> = ({ onComplete }) => {
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<Archetype | null>(null);

  const archetypes = Object.values(Archetype);

  const startSpin = () => {
    setSpinning(true);
    // Simulate spin duration
    setTimeout(() => {
      const randomArch = archetypes[Math.floor(Math.random() * archetypes.length)];
      setSelected(randomArch);
      setSpinning(false);
    }, 3000);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-mystic-900/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-2xl p-8 flex flex-col items-center">
        {!selected ? (
          <>
            <motion.h2 
              className="text-4xl font-serif text-gold-400 mb-12 glow-text text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              The Portal Opens...
            </motion.h2>

            <div className="relative w-64 h-64 mb-12">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-aether/30 border-t-gold-400"
                animate={spinning ? { rotate: 360 * 5 } : { rotate: 0 }}
                transition={spinning ? { duration: 3, ease: "circOut" } : { duration: 0 }}
              />
              <motion.div 
                className="absolute inset-2 rounded-full border-2 border-mystic-800 border-b-purple-500"
                animate={spinning ? { rotate: -360 * 4 } : { rotate: 0 }}
                transition={spinning ? { duration: 3, ease: "circOut" } : { duration: 0 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-gold-400 w-16 h-16 opacity-50" />
              </div>
            </div>

            <button
              onClick={startSpin}
              disabled={spinning}
              className="px-8 py-4 bg-aether text-white font-serif text-xl rounded-full glow-box hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Consult the Collective Unconscious
            </button>
          </>
        ) : (
          <motion.div 
            className="flex flex-col items-center text-center max-w-md bg-mystic-800 p-8 rounded-2xl border border-gold-500/30 glow-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-3xl font-serif text-gold-400 mb-4">{ArchetypeDetails[selected].name}</h3>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              {ArchetypeDetails[selected].description}
            </p>
            <button
              onClick={() => onComplete(selected)}
              className="px-6 py-3 border border-gold-500/50 text-gold-400 rounded-full hover:bg-gold-500/10 transition-colors"
            >
              Accept Guidance
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
