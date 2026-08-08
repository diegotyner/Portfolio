import { useEffect, useMemo, useState } from 'react';
import { createRNG } from '../generator/rng';
import {
  DEFAULT_GROWTH_CONFIG,
  generateBranches,
  type GrowthConfig,
  type Soma,
} from '../generator';
import GrowthPanel from '../components/GrowthPanel';
import PetriCanvas from '../components/PetriCanvas';

const CANVAS_SIZE = 800;

export default function SingleCellCulture() {
  const [growthConfig, setGrowthConfig] = useState<GrowthConfig>(DEFAULT_GROWTH_CONFIG);
  const [seed, setSeed] = useState(1);

  const soma: Soma = useMemo(
    () => ({ id: 0, pos: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }, radius: 14, z: 1, aspectRatio: 0.8, rotation: 0 }),
    []
  );
  // Full tree, computed once per config/seed change — same as before.
  const allBranches = useMemo(() => {
    const rng = createRNG(seed);
    return generateBranches([soma], growthConfig, rng);
  }, [soma, growthConfig, seed]);

  const maxDepth = useMemo(
    () => allBranches.reduce((max, b) => Math.max(max, b.depth), 0),
    [allBranches]
  );

  // -1 = "show everything" (normal mode). 0..maxDepth = step-through mode.
  const [visibleDepth, setVisibleDepth] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset the step position whenever the tree itself changes, so an old

  // depth value from a bushier tree doesn't leave you stuck mid-way on a
  // sparser one.

  useEffect(() => {
    setVisibleDepth(-1);
    setIsPlaying(false);
  }, [allBranches]);

  // Simple auto-play: advance one depth level every 400ms while playing.
  useEffect(() => {
    if (!isPlaying) return;
    if (visibleDepth >= maxDepth) {
      setIsPlaying(false);
      return;

    }
    const timer = setTimeout(() => setVisibleDepth((d) => d + 1), 400);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleDepth, maxDepth]);

  const branches = useMemo(() => {
    if (visibleDepth === -1) return allBranches;
    return allBranches.filter((b) => b.depth <= visibleDepth);
  }, [allBranches, visibleDepth]);


  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050507' }}>
      <div style={{ width: 280, borderRight: '1px solid #1a1a22', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16 }}>
          <h2 style={{ fontSize: 14, marginBottom: 12, color: '#d8f5e3', fontFamily: 'monospace' }}>
            single-cell-culture
          </h2>
          <label style={{ display: 'block', color: '#d8f5e3', fontFamily: 'monospace', fontSize: 13, marginBottom: 4 }}>
            seed: {seed}
          </label>
          <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
        </div>

        <div style={{ padding: '0 16px 16px', color: '#d8f5e3', fontFamily: 'monospace', fontSize: 13 }}>
          <h3 style={{ fontSize: 13, marginBottom: 8, opacity: 0.8 }}>growth step</h3>
          <label style={{ display: 'block', marginBottom: 4 }}>
            {visibleDepth === -1 ? `full tree (max depth ${maxDepth})` : `depth: ${visibleDepth} / ${maxDepth}`}
          </label>
          <input
            type="range"
            min={-1}
            max={maxDepth}
            value={visibleDepth}
            onChange={(e) => {
              setIsPlaying(false);
              setVisibleDepth(Number(e.target.value));
            }}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              onClick={() => {
                if (visibleDepth === -1 || visibleDepth >= maxDepth) setVisibleDepth(0);
                setIsPlaying((p) => !p);
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => { setIsPlaying(false); setVisibleDepth(-1); }}>
              Show Full
            </button>
          </div>
        </div>

        <GrowthPanel growthConfig={growthConfig} onChange={setGrowthConfig} />
      </div>
      <PetriCanvas
        config={{ width: CANVAS_SIZE, height: CANVAS_SIZE, seed, somaCount: 1, somaRadiusRange: [14, 14], somaMinSpacing: 0, somaMaxAttempts: 1, zRange: [1, 1] }}
        somas={[soma]}
        branches={branches}
        blurEnabled={false}
      />
    </div>
  );
}
