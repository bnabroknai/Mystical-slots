export enum SymbolType {
  STONE = 'STONE',     // Jackpot
  SUN = 'SUN',       
  MOON = 'MOON',      
  MERCURY = 'MERCURY', 
  VENUS = 'VENUS',     
  MARS = 'MARS',       
  JUPITER = 'JUPITER', 
  SATURN = 'SATURN',   
  FIRE = 'FIRE',       
  WATER = 'WATER',     
  EARTH = 'EARTH',     
  AIR = 'AIR',         
  BONUS = 'BONUS',     // Triggers Archetype
}

export const SymbolValues: Record<SymbolType, { payout: number[], frequency: number, label: string, color: string }> = {
  // Payouts for [3, 4, 5] matches
  [SymbolType.STONE]: { payout: [100, 500, 5000], frequency: 1, label: 'Philosopher\'s Stone', color: 'text-rose-500 glow-text' },
  [SymbolType.SUN]: { payout: [25, 100, 500], frequency: 3, label: 'Sun / Gold', color: 'text-amber-400' },
  [SymbolType.MOON]: { payout: [20, 80, 400], frequency: 4, label: 'Moon / Silver', color: 'text-slate-300' },
  [SymbolType.MERCURY]: { payout: [15, 60, 300], frequency: 5, label: 'Mercury', color: 'text-cyan-400' },
  [SymbolType.VENUS]: { payout: [10, 40, 200], frequency: 6, label: 'Venus / Copper', color: 'text-orange-400' },
  [SymbolType.MARS]: { payout: [10, 35, 150], frequency: 6, label: 'Mars / Iron', color: 'text-red-500' },
  [SymbolType.JUPITER]: { payout: [8, 30, 100], frequency: 7, label: 'Jupiter / Tin', color: 'text-indigo-400' },
  [SymbolType.SATURN]: { payout: [8, 25, 80], frequency: 7, label: 'Saturn / Lead', color: 'text-zinc-500' },
  [SymbolType.FIRE]: { payout: [5, 15, 50], frequency: 10, label: 'Fire', color: 'text-orange-500' },
  [SymbolType.WATER]: { payout: [5, 15, 50], frequency: 10, label: 'Water', color: 'text-blue-500' },
  [SymbolType.EARTH]: { payout: [5, 15, 50], frequency: 10, label: 'Earth', color: 'text-emerald-500' },
  [SymbolType.AIR]: { payout: [5, 15, 50], frequency: 10, label: 'Air', color: 'text-sky-300' },
  [SymbolType.BONUS]: { payout: [0, 0, 0], frequency: 3, label: 'Bonus Portal', color: 'text-purple-400 glow-text' },
};

export enum Archetype {
  INNOCENT = 'INNOCENT',
  ORPHAN = 'ORPHAN',
  HERO = 'HERO',
  CAREGIVER = 'CAREGIVER',
  EXPLORER = 'EXPLORER',
  REBEL = 'REBEL',
  LOVER = 'LOVER',
  CREATOR = 'CREATOR',
  JESTER = 'JESTER',
  SAGE = 'SAGE',
  MAGICIAN = 'MAGICIAN',
  RULER = 'RULER'
}

export const ArchetypeDetails: Record<Archetype, { name: string, description: string }> = {
  [Archetype.INNOCENT]: { name: 'The Innocent', description: 'Renewal: Respins all non-winning symbols.' },
  [Archetype.ORPHAN]: { name: 'The Orphan', description: 'Connection: Adjacent matching symbols become an expanded win.' },
  [Archetype.HERO]: { name: 'The Hero', description: 'Mastery: Slashes low-value symbols and upgrades them.' },
  [Archetype.CAREGIVER]: { name: 'The Caregiver', description: 'Protection: Grants 3 Free Spins.' },
  [Archetype.EXPLORER]: { name: 'The Explorer', description: 'Discovery: Multiplies base win by 2x-10x.' },
  [Archetype.REBEL]: { name: 'The Rebel', description: 'Disruption: Shuffles the board for a guaranteed win.' },
  [Archetype.LOVER]: { name: 'The Lover', description: 'Harmony: Groups scattered symbols together.' },
  [Archetype.CREATOR]: { name: 'The Creator', description: 'Artistry: Drops a 2x2 Wild onto the board.' },
  [Archetype.JESTER]: { name: 'The Jester', description: 'Chaos: Randomly transforms 3-5 symbols into top-tier stones.' },
  [Archetype.SAGE]: { name: 'The Sage', description: 'Truth: Upgrades all winning symbols to the next tier.' },
  [Archetype.MAGICIAN]: { name: 'The Magician', description: 'Transformation: Turns all mid-tier to High-tier.' },
  [Archetype.RULER]: { name: 'The Ruler', description: 'Control: Locks winning symbols and respins until non-winning.' },
};

// Generate an array of symbols based on frequency to use as a reel strip
export function generateReelStrip(): SymbolType[] {
  const strip: SymbolType[] = [];
  (Object.keys(SymbolValues) as SymbolType[]).forEach(symbol => {
    for (let i = 0; i < SymbolValues[symbol].frequency; i++) {
      strip.push(symbol);
    }
  });
  // Shuffle securely
  for (let i = strip.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [strip[i], strip[j]] = [strip[j], strip[i]];
  }
  return strip;
}

export type Grid = SymbolType[][];

// 5 reels, 3 rows
export function generateRandomGrid(reelStrips: SymbolType[][]): Grid {
  const grid: Grid = [];
  for (let col = 0; col < 5; col++) {
    const colSymbols: SymbolType[] = [];
    const strip = reelStrips[col];
    const startIndex = Math.floor(Math.random() * strip.length);
    for (let row = 0; row < 3; row++) {
      colSymbols.push(strip[(startIndex + row) % strip.length]);
    }
    grid.push(colSymbols); // We store it as grid[col][row]
  }
  return grid;
}

export interface WinLine {
  symbol: SymbolType;
  count: number;
  payout: number;
  positions: { col: number, row: number }[];
}

export interface SpinResult {
  grid: Grid;
  wins: WinLine[];
  totalPayout: number;
  bonusTriggered: boolean;
}

// Very simple 10-line paylines for intuitive traditional slots
export const PAYLINES = [
  // Straight lines
  [{c:0, r:1}, {c:1, r:1}, {c:2, r:1}, {c:3, r:1}, {c:4, r:1}], // Center
  [{c:0, r:0}, {c:1, r:0}, {c:2, r:0}, {c:3, r:0}, {c:4, r:0}], // Top
  [{c:0, r:2}, {c:1, r:2}, {c:2, r:2}, {c:3, r:2}, {c:4, r:2}], // Bottom
  // V and Inverse V
  [{c:0, r:0}, {c:1, r:1}, {c:2, r:2}, {c:3, r:1}, {c:4, r:0}], // V shape
  [{c:0, r:2}, {c:1, r:1}, {c:2, r:0}, {c:3, r:1}, {c:4, r:2}], // Invite V
  // Zig Zags
  [{c:0, r:1}, {c:1, r:0}, {c:2, r:1}, {c:3, r:0}, {c:4, r:1}],
  [{c:0, r:1}, {c:1, r:2}, {c:2, r:1}, {c:3, r:2}, {c:4, r:1}],
  [{c:0, r:0}, {c:1, r:0}, {c:2, r:1}, {c:3, r:2}, {c:4, r:2}],
  [{c:0, r:2}, {c:1, r:2}, {c:2, r:1}, {c:3, r:0}, {c:4, r:0}],
  [{c:0, r:1}, {c:1, r:2}, {c:2, r:2}, {c:3, r:2}, {c:4, r:1}],
];

export function evaluateGrid(grid: Grid, betPerLine: number = 1): Omit<SpinResult, 'grid'> {
  let totalPayout = 0;
  const wins: WinLine[] = [];
  let bonusCount = 0;

  // Count bonuses anywhere
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 3; r++) {
      if (grid[c][r] === SymbolType.BONUS) bonusCount++;
    }
  }

  // Check paylines left to right
  for (const line of PAYLINES) {
    const firstSymbol = grid[line[0].c][line[0].r];
    if (firstSymbol === SymbolType.BONUS) continue; // Bonus doesn't pay conventionally

    let count = 1;
    const positions = [{ col: line[0].c, row: line[0].r }];

    for (let i = 1; i < 5; i++) {
      const sym = grid[line[i].c][line[i].r];
      if (sym === firstSymbol) {
        count++;
        positions.push({ col: line[i].c, row: line[i].r });
      } else {
        break; // Match ends
      }
    }

    if (count >= 3) {
      const payoutMultiplier = SymbolValues[firstSymbol].payout[count - 3];
      const payout = payoutMultiplier * betPerLine;
      if (payout > 0) {
        totalPayout += payout;
        wins.push({ symbol: firstSymbol, count, payout, positions });
      }
    }
  }

  return {
    wins,
    totalPayout,
    bonusTriggered: bonusCount >= 3
  };
}
