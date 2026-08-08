import { useMemo } from 'react';
import { createRNG } from '../generator/rng';
import {
  DEFAULT_CONFIG,
  DEFAULT_GROWTH_CONFIG,
  generateSomas,
  generateBranches,
} from '../generator';
import { somaCountForArea } from '../generator/density';
import { useViewportSize } from '../hooks/useViewportSize';
import PetriCanvas from '../components/PetriCanvas';

export default function Homepage() {
  const { width, height } = useViewportSize();

  const config = useMemo(
    () => ({

      ...DEFAULT_CONFIG,
      width,

      height,
      somaCount: somaCountForArea(width, height),
    }),
    [width, height],
  );

  const somas = useMemo(() => generateSomas(config), [config]);
  const branches = useMemo(() => {
    const rng = createRNG(config.seed + 1);
    return generateBranches(somas, DEFAULT_GROWTH_CONFIG, rng);
  }, [somas, config.seed]);


  return (
    <div className="h-screen w-screen overflow-hidden" style={{ filter: 'blur(15px)' }}>
      <PetriCanvas config={config} somas={somas} branches={branches} />

    </div>
  );
}
