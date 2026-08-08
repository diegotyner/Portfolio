import type { Branch, GeneratorConfig, Soma } from '../generator';

interface Props {
  config: GeneratorConfig;
  somas: Soma[];
  branches?: Branch[];
  blurEnabled: boolean;
}

export default function PetriCanvas({ config, somas, branches = [], blurEnabled }: Props) {
  return (

    <svg viewBox={`0 0 ${config.width} ${config.height}`} style={{ flex: 1, background: '#050507' }}>
      <defs>
        <radialGradient id="soma-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="25%" stopColor="#3B5BDB" stopOpacity={1} />
          <stop offset="100%" stopColor="#3B5BDB" stopOpacity={0.8} />
        </radialGradient>
        {blurEnabled && (
          <filter id="soma-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        )}
      </defs>


      {branches.map((b) => {
        const zScale = 0.4 + b.z;

        return <line
          key={b.id}
          x1={b.start.x} y1={b.start.y}
          x2={b.end.x} y2={b.end.y}
          stroke="#5fffb0"
          strokeWidth={((b.startWidth + b.endWidth) / 2) * zScale}
          strokeLinecap="round"
          opacity={0.4 + b.z * 0.6}
        />
      })}


      {somas.map((soma) => {
        const scale = soma.radius * (0.6 + soma.z * 0.6);
        return (
          <ellipse
            key={soma.id}
            cx={soma.pos.x} cy={soma.pos.y}
            rx={scale}
            ry={scale * soma.aspectRatio}
            transform={`rotate(${soma.rotation}, ${soma.pos.x}, ${soma.pos.y})`}
            fill="url(#soma-gradient)"
            filter={blurEnabled ? 'url(#soma-blur)' : undefined}
            opacity={0.5 + soma.z * 0.5}
          />
        );
      })}
    </svg>
  );
}
