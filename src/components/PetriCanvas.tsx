import type { Branch, GeneratorConfig, Soma, DepthConfig } from '../generator';
import { DEFAULT_DEPTH_CONFIG } from '../generator';

interface Props {
  config: GeneratorConfig;
  somas: Soma[];
  branches?: Branch[];
  blurEnabled: boolean;
  depthConfig?: DepthConfig;
}

const depthScale = (z: number, cfg: DepthConfig) => cfg.scaleMin + z * cfg.scaleRange;
const depthOpacity = (z: number, cfg: DepthConfig) => cfg.opacityMin + z * cfg.opacityRange;

export default function PetriCanvas({
  config,
  somas,
  branches = [],
  blurEnabled,
  depthConfig = DEFAULT_DEPTH_CONFIG,
}: Props) {
  const neuronColor = "#0103DF"; // #3B5BDB
  const dendriteColor = "#01E005"; // #5fffb0

  return (
    <svg viewBox={`0 0 ${config.width} ${config.height}`} className="flex-1 bg-[#050507]">
      <defs>
        <radialGradient id="soma-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="25%" stopColor={neuronColor} stopOpacity={1} />
          <stop offset="100%" stopColor={neuronColor} stopOpacity={0.8} />
        </radialGradient>
        {blurEnabled && (
          <filter id="soma-blur" x="-50%" y="-50%" width="200%" height="200%">

            <feGaussianBlur stdDeviation="3" />
          </filter>
        )}

      </defs>

      {branches.map((b) => {
        const scale = depthScale(b.z, depthConfig);
        return (

          <line
            key={b.id}
            x1={b.start.x} y1={b.start.y}
            x2={b.end.x} y2={b.end.y}
            stroke={dendriteColor}
            strokeWidth={((b.startWidth + b.endWidth) / 2) * scale}
            strokeLinecap="round"
            opacity={depthOpacity(b.z, depthConfig)}
          />
        );
      })}

      {somas.map((soma) => {
        const scale = soma.radius * depthScale(soma.z, depthConfig);

        return (
          <ellipse
            key={soma.id}

            cx={soma.pos.x} cy={soma.pos.y}
            rx={scale}
            ry={scale * soma.aspectRatio}
            transform={`rotate(${soma.rotation}, ${soma.pos.x}, ${soma.pos.y})`}
            fill="url(#soma-gradient)"
            filter={blurEnabled ? 'url(#soma-blur)' : undefined}
            opacity={depthOpacity(soma.z, depthConfig)}
          />
        );
      })}
    </svg>
  );
}
