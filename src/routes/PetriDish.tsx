import { useMemo, useState } from 'react';
import { createRNG } from '../generator/rng';
import {
  DEFAULT_CONFIG,
  DEFAULT_GROWTH_CONFIG,
  generateSomas,
  generateBranches,

  type GeneratorConfig,
  type GrowthConfig,
} from '../generator';
import ControlPanel from '../components/SomaPanel';
import GrowthPanel from '../components/GrowthPanel';
import PetriCanvas from '../components/PetriCanvas';

export default function PetriDish() {
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);

  const [growthConfig, setGrowthConfig] = useState<GrowthConfig>(DEFAULT_GROWTH_CONFIG);
  const [blurEnabled, setBlurEnabled] = useState(false); // default OFF so structure is visible first

  const somas = useMemo(() => generateSomas(config), [config]);
  const branches = useMemo(() => {
    const rng = createRNG(config.seed + 1);

    return generateBranches(somas, growthConfig, rng);
  }, [somas, growthConfig, config.seed]);

  return (
    <div className="flex h-screen bg-[#050507]">
      <div className="w-[300px] border-r border-[#1a1a22] flex flex-col overflow-y-auto">
        <ControlPanel
          config={config}
          onChange={setConfig}
          blurEnabled={blurEnabled}
          onBlurToggle={setBlurEnabled}

          placedCount={somas.length}
        />
        <GrowthPanel growthConfig={growthConfig} onChange={setGrowthConfig} />
      </div>
      <div className="flex-1" style={{ filter: blurEnabled ? 'blur(15px)' : 'none' }}>
        <PetriCanvas config={config} somas={somas} branches={branches} />
      </div>
    </div>
  );
}
