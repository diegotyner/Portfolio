import type { GeneratorConfig } from '../generator';

interface Props {
  config: GeneratorConfig;
  onChange: (config: GeneratorConfig) => void;
  blurEnabled: boolean;
  onBlurToggle: (v: boolean) => void;
  placedCount: number;
}

// Small helper to patch one field on the config without repeating spread logic everywhere.
function useSetField<K extends keyof GeneratorConfig>(
  config: GeneratorConfig,
  onChange: (c: GeneratorConfig) => void,
  key: K
) {
  return (value: GeneratorConfig[K]) => onChange({ ...config, [key]: value });
}


export default function ControlPanel({ config, onChange, blurEnabled, onBlurToggle, placedCount }: Props) {
  const setSeed = useSetField(config, onChange, 'seed');

  const setSomaCount = useSetField(config, onChange, 'somaCount');
  const setSomaMinSpacing = useSetField(config, onChange, 'somaMinSpacing');
  const setSomaRadiusRange = useSetField(config, onChange, 'somaRadiusRange');

  return (
    <div className="p-4 bg-[#0b0b0f] text-[#d8f5e3] font-mono text-[13px] overflow-y-auto border-r border-[#1a1a22]">
      <h2 className="text-[14px] mb-3">petri-dish</h2>

      <Field label={`seed: ${config.seed}`}>
        <input
          type="number"

          value={config.seed}
          onChange={(e) => setSeed(Number(e.target.value))}
        />
      </Field>

      <Field label={`soma count: ${config.somaCount} (placed: ${placedCount})`}>
        <input
          type="range"
          min={1}

          max={60}
          value={config.somaCount}
          onChange={(e) => setSomaCount(Number(e.target.value))}
        />
      </Field>

      <Field label={`min spacing: ${config.somaMinSpacing}`}>
        <input
          type="range"
          min={10}
          max={200}
          value={config.somaMinSpacing}
          onChange={(e) => setSomaMinSpacing(Number(e.target.value))}
        />
      </Field>

      <Field label={`radius: ${config.somaRadiusRange[0]}–${config.somaRadiusRange[1]}`}>
        <div className="flex gap-2">
          <input

            type="range"
            min={1}
            max={60}
            value={config.somaRadiusRange[0]}
            onChange={(e) =>
              setSomaRadiusRange([Number(e.target.value), config.somaRadiusRange[1]])

            }
          />
          <input
            type="range"
            min={1}
            max={60}
            value={config.somaRadiusRange[1]}
            onChange={(e) =>
              setSomaRadiusRange([config.somaRadiusRange[0], Number(e.target.value)])
            }
          />
        </div>
      </Field>


      <Field label="blur (glow preview)">
        <input
          type="checkbox"
          checked={blurEnabled}
          onChange={(e) => onBlurToggle(e.target.checked)}
        />
      </Field>
    </div>

  );
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-[14px]">
      <label className="block mb-1 opacity-80">{label}</label>
      {children}
    </div>

  );
}
