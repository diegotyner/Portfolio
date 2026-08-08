import { randRange } from "./rng";
import type { RNG } from "./rng";
import type { Branch, GrowthConfig, Soma } from "./types";

/**

 * Grows one segment forward from `origin` in direction `angle` (radians),
 * returning the new endpoint. Pure geometry, no growth-rule logic.
 */
function stepForward(
  origin: { x: number; y: number },
  angle: number,
  length: number,
) {
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
 * Recursively grows one dendrite branch starting at `start`, following
 * Hillman's algorithm: elongate one segment, taper width, and either
 * terminate (below threshold), fork into two daughters, or continue
 * straight — repeating until termination or maxDepth safety cap.
 *
 * `angle` is centrifugal tropism: each new segment's direction is biased
 * outward from the soma, with random jitter so branches don't grow in
 * perfectly straight lines.
 */
function growBranch(
  soma: Soma,
  start: { x: number; y: number },
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

  // Centrifugal tropism: nudge angle to point away from the soma center,
  // blended with the branch's current heading so it doesn't snap outward
  // instantly — plus random jitter so it's not a perfectly straight radial line.
  const outwardAngle = Math.atan2(start.y - soma.pos.y, start.x - soma.pos.x);
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

  // Hillman's stopping rule: once width drops below threshold, grow exactly
  // one more "terminal length" segment, then stop — don't fork or recurse further.
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
      true, // mark this as the terminal pass so it doesn't recurse again
    );
    return;
  }

  // Otherwise: probabilistically fork into two daughters, or just continue.
  const shouldFork = rng() < config.forkProbability;

  if (shouldFork) {
    // Rall's power rule (simplified): daughter widths split the parent's
    // width according to daughterRatio rather than each independently
    // tapering — this is what keeps total cross-sectional area roughly
    // conserved across a fork instead of branches getting thicker than
    // their parent by coincidence.
    const widthA = endWidth * config.daughterRatio;

    const widthB = endWidth * (1 - config.daughterRatio);

    const forkSpread = randRange(rng, 0.3, 0.8); // angle between daughters
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
    // Launch `stemCount` initial dendrites around the soma, evenly spread
    // with jitter so they don't look mechanically uniform.

    for (let i = 0; i < growthConfig.stemCount; i++) {
      const baseAngle = (i / growthConfig.stemCount) * Math.PI * 2;
      const angle = baseAngle + randRange(rng, -0.3, 0.3);
      const startPoint = stepForward(soma.pos, angle, soma.radius); // start at soma edge, not center

      growBranch(
        soma,
        startPoint,
        angle,
        growthConfig.initialWidth,
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
