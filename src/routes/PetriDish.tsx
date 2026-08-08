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
import ControlPanel from '../components/ControlPanel';
import GrowthPanel from '../components/GrowthPanel';
import PetriCanvas from '../components/PetriCanvas';

export default function PetriDish() {
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);
  const [growthConfig, setGrowthConfig] = useState<GrowthConfig>(DEFAULT_GROWTH_CONFIG);

  const [blurEnabled, setBlurEnabled] = useState(false); // default OFF so structure is visible first


  // Regenerate whenever config changes. Cheap at these counts — no need to debounce yet.
  const somas = useMemo(() => generateSomas(config), [config]);
  const branches = useMemo(() => {
    const rng = createRNG(config.seed + 1);
    return generateBranches(somas, growthConfig, rng);
  }, [somas, growthConfig, config.seed]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050507' }}>
      <div style={{ width: 300, borderRight: '1px solid #1a1a22', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <ControlPanel
          config={config}
          onChange={setConfig}
          blurEnabled={blurEnabled}
          onBlurToggle={setBlurEnabled}
          placedCount={somas.length}
        />
        <GrowthPanel growthConfig={growthConfig} onChange={setGrowthConfig} />
      </div>
      <PetriCanvas config={config} somas={somas} branches={branches} blurEnabled={blurEnabled} />
    </div>
  );
}
