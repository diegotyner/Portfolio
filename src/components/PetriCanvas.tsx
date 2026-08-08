import { useEffect, useMemo, useRef } from 'react';
import type { Branch, GeneratorConfig, Soma, DepthConfig } from '../generator';
import { DEFAULT_DEPTH_CONFIG } from '../generator';

interface Props {
  config: GeneratorConfig;
  somas: Soma[];
  branches?: Branch[];
  depthConfig?: DepthConfig;
  maxParallaxOffset?: number; // canvas units; final per-soma offset scales by soma.z
}

const depthScale = (z: number, cfg: DepthConfig) => cfg.scaleMin + z * cfg.scaleRange;
const depthOpacity = (z: number, cfg: DepthConfig) => cfg.opacityMin + z * cfg.opacityRange;


export default function PetriCanvas({
  config,
  somas,
  branches = [],
  depthConfig = DEFAULT_DEPTH_CONFIG,
  maxParallaxOffset = 100,
}: Props) {
  const neuronColor = "#0103DF";
  const dendriteColor = "#01E005";


  const branchesBySoma = useMemo(() => {
    const map = new Map<number, Branch[]>();
    for (const b of branches) {
      const list = map.get(b.somaId) ?? [];
      list.push(b);
      map.set(b.somaId, list);
    }

    return map;
  }, [branches]);


  const sortedSomas = useMemo(
    () => [...somas].sort((a, b) => a.z - b.z), // far-to-near draw order
    [somas],
  );

  const svgRef = useRef<SVGSVGElement>(null);
  // One <g> ref per soma, keyed by soma.id — populated via the callback-ref
  // below, so the rAF loop can write transforms directly without going

  // through React state/props at all.
  const groupRefs = useRef<Map<number, SVGGElement>>(new Map());
  const pointerRef = useRef({ x: 0, y: 0 }); // normalized [-1, 1], 0 = center
  const rafRef = useRef<number | null>(null);

  // Precompute each soma's static base transform pieces once per somas/config
  // change (not per frame) — the rAF loop only needs to add the parallax
  // offset on top and stringify, no recomputation of scale/depth per frame.
  const baseTransforms = useMemo(() => {
    const map = new Map<number, { x: number; y: number; scale: number; z: number }>();

    for (const soma of somas) {
      map.set(soma.id, {
        x: soma.pos.x,
        y: soma.pos.y,
        scale: depthScale(soma.z, depthConfig),
        z: soma.z,
      });
    }
    return map;
  }, [somas, depthConfig]);


  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Applies the current pointer offset to every soma's <g> directly via
    // setAttribute — skips React reconciliation entirely for the per-frame
    // hot path. Branches/ellipse inside each group never re-render; only
    // this one attribute on the outer group mutates.
    const applyParallax = () => {
      const { x: px, y: py } = pointerRef.current;
      for (const [id, base] of baseTransforms) {
        const el = groupRefs.current.get(id);
        if (!el) continue;
        const offsetX = px * maxParallaxOffset * base.z;
        const offsetY = py * maxParallaxOffset * base.z;
        el.setAttribute(
          'transform',
          `translate(${base.x + offsetX}, ${base.y + offsetY}) scale(${base.scale})`,
        );
      }
    };

    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerRef.current = { x: nx, y: ny };

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          applyParallax();
          rafRef.current = null;
        });
      }
    };

    svg.addEventListener('mousemove', handleMove);

    // Apply once on mount/base-transform-change so groups sit at their
    // resting position (pointerRef starts at {0,0}) rather than at origin.
    applyParallax();

    return () => {
      svg.removeEventListener('mousemove', handleMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [baseTransforms, maxParallaxOffset]);

  return (
    <svg

      ref={svgRef}

      viewBox={`0 0 ${config.width} ${config.height}`}
      className="flex-1 bg-[#050507]"
    >
      <defs>
        <radialGradient id="soma-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="25%" stopColor={neuronColor} stopOpacity={1} />
          <stop offset="100%" stopColor={neuronColor} stopOpacity={0.8} />
        </radialGradient>
      </defs>
      {sortedSomas.map((soma) => {
        const opacity = depthOpacity(soma.z, depthConfig);
        const somaBranches = branchesBySoma.get(soma.id) ?? [];
        const base = baseTransforms.get(soma.id)!;

        return (
          <g
            key={soma.id}
            ref={(el) => {
              if (el) groupRefs.current.set(soma.id, el);
              else groupRefs.current.delete(soma.id);

            }}
            // Initial transform for first paint, before the effect runs —
            // avoids a one-frame flash at the origin.
            transform={`translate(${base.x}, ${base.y}) scale(${base.scale})`}
          >
            {somaBranches.map((b) => (
              <line
                key={b.id}
                x1={b.start.x} y1={b.start.y}
                x2={b.end.x} y2={b.end.y}
                stroke={dendriteColor}
                strokeWidth={(b.startWidth + b.endWidth) / 2}
                strokeLinecap="round"
                opacity={opacity}

              />
            ))}
            <ellipse
              cx={0} cy={0}
              rx={soma.radius}
              ry={soma.radius * soma.aspectRatio}
              transform={`rotate(${soma.rotation}, 0, 0)`}
              fill="url(#soma-gradient)"
              opacity={opacity}
            />

          </g>
        );
      })}

    </svg>
  );
}
