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
    <div
      style={{

        padding: 16,

        background: '#0b0b0f',
        color: '#d8f5e3',
        fontFamily: 'monospace',
        fontSize: 13,
        overflowY: 'auto',
        borderRight: '1px solid #1a1a22',
      }}
    >
      <h2 style={{ fontSize: 14, marginBottom: 12 }}>petri-dish</h2>

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
        <div style={{ display: 'flex', gap: 8 }}>
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
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 4, opacity: 0.8 }}>{label}</label>
      {children}
    </div>

  );
}
