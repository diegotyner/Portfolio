import { randRange } from "./rng";
import type { RNG } from "./rng";
import type { Branch, GrowthConfig, Point, Soma } from "./types";

function stepForward(origin: Point, angle: number, length: number): Point {
  return {
    x: origin.x + Math.cos(angle) * length,

    y: origin.y + Math.sin(angle) * length,
  };
}

function angleDelta(from: number, to: number): number {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

/**
 * Finds the point on a soma's rendered ellipse boundary, in LOCAL space
 * (soma center = origin). PetriCanvas positions the whole neuron via a
 * <g transform="translate(soma.pos) scale(depth)">, so nothing in this
 * file ever needs to know soma.pos — that's applied once, at render time,
 * to the whole group at once.
 */
function ellipseEdgePoint(soma: Soma, angle: number): Point {
  const rotRad = (soma.rotation * Math.PI) / 180;
  const localAngle = angle - rotRad;

  const rx = soma.radius;
  const ry = soma.radius * soma.aspectRatio;

  const cosL = Math.cos(localAngle);
  const sinL = Math.sin(localAngle);
  const r = 1 / Math.sqrt((cosL / rx) ** 2 + (sinL / ry) ** 2);

  const localX = r * cosL;

  const localY = r * sinL;

  return {
    x: localX * Math.cos(rotRad) - localY * Math.sin(rotRad),
    y: localX * Math.sin(rotRad) + localY * Math.cos(rotRad),
  };
}

const REFERENCE_RADIUS = 15;

function growBranch(
  soma: Soma,
  start: Point,
  angle: number,
  width: number,
  depth: number,
  parentId: number | null,
  config: GrowthConfig,
  rng: RNG,

  branches: Branch[],
  idRef: { current: number },
  isTerminalPass = false,
) {
  if (depth > config.maxDepth) return;

  // start is a LOCAL point now, and soma.pos is the soma's LOCAL origin —
  // conceptually (0,0) — so this outward-angle math is unchanged: it was
  // always "direction from soma center," it just used to be computed in

  // world coordinates and now happens in local ones.
  const outwardAngle = Math.atan2(start.y - 0, start.x - 0);
  const jitter = randRange(rng, -config.jitterAmount, config.jitterAmount);
  const newAngle =
    angle + angleDelta(angle, outwardAngle) * config.tropismStrength + jitter;
  const end = stepForward(start, newAngle, config.segmentLength);
  const endWidth = width * config.taperRate;

  const id = idRef.current++;
  branches.push({
    id,
    somaId: soma.id,
    parentId,
    start,
    end,

    startWidth: width,
    endWidth,
    depth,
    z: soma.z,
  });

  if (isTerminalPass) return;

  if (endWidth < config.widthThreshold) {
    growBranch(
      soma,
      end,
      newAngle,
      endWidth,
      depth + 1,
      id,
      { ...config, segmentLength: config.terminalLength },
      rng,
      branches,
      idRef,
      true,
    );
    return;
  }

  const shouldFork = rng() < config.forkProbability;

  if (shouldFork) {
    const widthA = endWidth * config.daughterRatio;
    const widthB = endWidth * (1 - config.daughterRatio);
    const forkSpread = randRange(rng, 0.3, 0.8);
    const angleA = newAngle + forkSpread / 2;
    const angleB = newAngle - forkSpread / 2;

    growBranch(
      soma,
      end,
      angleA,
      widthA,
      depth + 1,
      id,
      config,
      rng,
      branches,
      idRef,
    );
    growBranch(
      soma,
      end,
      angleB,
      widthB,
      depth + 1,
      id,
      config,
      rng,
      branches,
      idRef,
    );
  } else {
    growBranch(
      soma,
      end,
      newAngle,
      endWidth,
      depth + 1,
      id,
      config,
      rng,
      branches,
      idRef,
    );
  }
}

export function generateBranches(
  somas: Soma[],
  growthConfig: GrowthConfig,
  rng: RNG,
): Branch[] {
  const branches: Branch[] = [];
  const idRef = { current: 0 };

  for (const soma of somas) {
    const somaInitialWidth =
      growthConfig.initialWidth * (soma.radius / REFERENCE_RADIUS);

    for (let i = 0; i < growthConfig.stemCount; i++) {
      const baseAngle = (i / growthConfig.stemCount) * Math.PI * 2;

      const angle = baseAngle + randRange(rng, -0.3, 0.3);
      const startPoint = ellipseEdgePoint(soma, angle); // local point now

      growBranch(
        soma,
        startPoint,
        angle,
        somaInitialWidth,
        0,
        null,
        growthConfig,
        rng,
        branches,
        idRef,
      );
    }
  }

  return branches;
}
