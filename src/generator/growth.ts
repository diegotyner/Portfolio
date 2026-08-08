import { randRange } from "./rng";
import type { RNG } from "./rng";
import type { Branch, GrowthConfig, Point, Soma } from "./types";

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
 * Finds the point on a soma's rendered boundary — a rotated ellipse, not a
 * plain circle — in the direction `angle` (world-frame radians) from the
 * soma's center. This is what PetriCanvas actually draws (rx = radius,
 * ry = radius * aspectRatio, rotated by soma.rotation), so stems need to
 * anchor here rather than on an unrotated circle of radius `soma.radius` —
 * otherwise the branch start point drifts inside/outside the visible blob
 * depending on launch angle vs. the soma's rotation.
 */
function ellipseEdgePoint(soma: Soma, angle: number): Point {
  const rotRad = (soma.rotation * Math.PI) / 180;
  const localAngle = angle - rotRad; // into the ellipse's own unrotated frame

  const rx = soma.radius;
  const ry = soma.radius * soma.aspectRatio;

  const cosL = Math.cos(localAngle);
  const sinL = Math.sin(localAngle);

  // Distance from center to the ellipse boundary along localAngle:
  // solving (r*cosL/rx)^2 + (r*sinL/ry)^2 = 1 for r.
  const r = 1 / Math.sqrt((cosL / rx) ** 2 + (sinL / ry) ** 2);

  const localX = r * cosL;
  const localY = r * sinL;

  // Rotate the local boundary point back into world space.
  return {
    x: soma.pos.x + localX * Math.cos(rotRad) - localY * Math.sin(rotRad),
    y: soma.pos.y + localX * Math.sin(rotRad) + localY * Math.cos(rotRad),
  };
}

// A soma at this radius renders branches at exactly `growthConfig.initialWidth`.
// Other soma sizes scale proportionally, so a small soma doesn't inherit the
// same flat starting thickness as a large one. Arbitrary reference point —
// tune alongside somaRadiusRange if the proportion looks off.
const REFERENCE_RADIUS = 13;

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
    // Scale this soma's starting branch width relative to its own radius,
    // rather than using growthConfig.initialWidth as a flat constant —
    // otherwise a small and a large soma produce identically thick branches,
    // which reads as visually wrong (the smaller neuron looks disproportionately
    // heavy-limbed relative to its own body size).
    const somaInitialWidth =
      growthConfig.initialWidth * (soma.radius / REFERENCE_RADIUS);

    // Launch `stemCount` initial dendrites around the soma, evenly spread
    // with jitter so they don't look mechanically uniform.
    for (let i = 0; i < growthConfig.stemCount; i++) {
      const baseAngle = (i / growthConfig.stemCount) * Math.PI * 2;

      const angle = baseAngle + randRange(rng, -0.3, 0.3);

      // Anchor to the soma's actual rendered ellipse boundary (accounting
      // for aspectRatio + rotation), not a plain circle of soma.radius —
      // otherwise the branch visibly doesn't touch the blob it belongs to.
      const startPoint = ellipseEdgePoint(soma, angle);

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
