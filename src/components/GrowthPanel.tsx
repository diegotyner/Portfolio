import { DEFAULT_GROWTH_CONFIG, type GrowthConfig } from '../generator';

interface Props {
  growthConfig: GrowthConfig;
  onChange: (config: GrowthConfig) => void;
}

function useSetField<K extends keyof GrowthConfig>(
  config: GrowthConfig,
  onChange: (c: GrowthConfig) => void,
  key: K
) {
  return (value: GrowthConfig[K]) => onChange({ ...config, [key]: value });
}

export default function GrowthPanel({ growthConfig, onChange }: Props) {
  const setStemCount = useSetField(growthConfig, onChange, 'stemCount');
  const setInitialWidth = useSetField(growthConfig, onChange, 'initialWidth');
  const setWidthThreshold = useSetField(growthConfig, onChange, 'widthThreshold');
  const setTaperRate = useSetField(growthConfig, onChange, 'taperRate');
  const setSegmentLength = useSetField(growthConfig, onChange, 'segmentLength');
  const setForkProbability = useSetField(growthConfig, onChange, 'forkProbability');
  const setMaxDepth = useSetField(growthConfig, onChange, 'maxDepth');
  const setTropismStrength = useSetField(growthConfig, onChange, 'tropismStrength');
  const setJitterAmount = useSetField(growthConfig, onChange, 'jitterAmount');

  return (
    <div className="p-4 bg-[#0b0b0f] text-[#d8f5e3] font-mono text-[13px] overflow-y-auto">
      <h3 className="text-[13px] mb-3 opacity-80">growth</h3>

      <Field
        label="stem count"
        value={growthConfig.stemCount}
        defaultValue={DEFAULT_GROWTH_CONFIG.stemCount}
      >
        <input type="range" min={1} max={8} step={1}
          value={growthConfig.stemCount}
          onChange={(e) => setStemCount(Number(e.target.value))} />
      </Field>

      <Field
        label="initial width"
        value={growthConfig.initialWidth}
        defaultValue={DEFAULT_GROWTH_CONFIG.initialWidth}
      >
        <input type="range" min={1} max={20} step={0.5}
          value={growthConfig.initialWidth}
          onChange={(e) => setInitialWidth(Number(e.target.value))} />
      </Field>

      <Field
        label="width threshold"
        value={growthConfig.widthThreshold}
        defaultValue={DEFAULT_GROWTH_CONFIG.widthThreshold}
      >
        <input type="range" min={0.1} max={3} step={0.1}
          value={growthConfig.widthThreshold}
          onChange={(e) => setWidthThreshold(Number(e.target.value))} />
      </Field>

      <Field
        label="taper rate"
        value={growthConfig.taperRate}
        defaultValue={DEFAULT_GROWTH_CONFIG.taperRate}
      >
        <input type="range" min={0.7} max={0.99} step={0.01}
          value={growthConfig.taperRate}
          onChange={(e) => setTaperRate(Number(e.target.value))} />
      </Field>

      <Field
        label="segment length"
        value={growthConfig.segmentLength}
        defaultValue={DEFAULT_GROWTH_CONFIG.segmentLength}
      >
        <input type="range" min={4} max={40}
          value={growthConfig.segmentLength}
          onChange={(e) => setSegmentLength(Number(e.target.value))} />
      </Field>

      <Field
        label="fork probability"
        value={growthConfig.forkProbability}
        defaultValue={DEFAULT_GROWTH_CONFIG.forkProbability}
      >
        <input type="range" min={0} max={1} step={0.05}
          value={growthConfig.forkProbability}
          onChange={(e) => setForkProbability(Number(e.target.value))} />
      </Field>

      <Field
        label="max depth"
        value={growthConfig.maxDepth}
        defaultValue={DEFAULT_GROWTH_CONFIG.maxDepth}
      >
        <input type="range" min={1} max={30}
          value={growthConfig.maxDepth}
          onChange={(e) => setMaxDepth(Number(e.target.value))} />
      </Field>

      <Field
        label="tropism strength"
        value={growthConfig.tropismStrength}
        defaultValue={DEFAULT_GROWTH_CONFIG.tropismStrength}
      >
        <input type="range" min={0} max={1} step={0.05}
          value={growthConfig.tropismStrength}
          onChange={(e) => setTropismStrength(Number(e.target.value))} />
      </Field>

      <Field
        label="jitter amount"
        value={growthConfig.jitterAmount}
        defaultValue={DEFAULT_GROWTH_CONFIG.jitterAmount}
      >
        <input type="range" min={0} max={1} step={0.05}
          value={growthConfig.jitterAmount}
          onChange={(e) => setJitterAmount(Number(e.target.value))} />
      </Field>
    </div>
  );
}

function Field({
  label,
  value,
  defaultValue,
  children,
}: {
  label: string;
  value: number;
  defaultValue: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[14px]">
      <label className="block mb-1 opacity-80">
        {label}: {value} <span className="opacity-60">(ex: {defaultValue})</span>
      </label>
      {children}
    </div>
  );
}
