import { createRNG, randRange } from "./rng";
import type { GeneratorConfig, Soma } from "./types";

function biasedZ(
  rng: import("./rng").RNG,
  x: number,
  y: number,
  config: GeneratorConfig,
): number {
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxDist = Math.hypot(cx, cy); // center to corner
  const distFromCenter = Math.hypot(x - cx, y - cy) / maxDist; // 0 (center) .. 1 (corner)
  const centerBias = 1 - distFromCenter; // 1 (center) .. 0 (corner)

  const randomZ = randRange(rng, config.zRange[0], config.zRange[1]);
  const biasStrength = config.zBiasStrength;

  // lerp between pure-random and distance-determined
  return randomZ + (centerBias - randomZ) * biasStrength;
}

/**
 * Places somas via rejection sampling: pick a random point, accept it only if
 * it's at least `somaMinSpacing` away from every previously placed soma.
 * This avoids the "polka dot" clumping of pure uniform-random placement
 * without the complexity of a full Poisson-disc grid — good enough at these
 * soma counts (order of tens, not thousands).
 */
export function generateSomas(config: GeneratorConfig): Soma[] {
  const rng = createRNG(config.seed);
  const somas: Soma[] = [];

  for (let i = 0; i < config.somaCount; i++) {
    for (let attempt = 0; attempt < config.somaMaxAttempts; attempt++) {
      const x = randRange(rng, 0, config.width);
      const y = randRange(rng, 0, config.height);

      const tooClose = somas.some((s) => {
        const dx = s.pos.x - x;
        const dy = s.pos.y - y;
        return Math.hypot(dx, dy) < config.somaMinSpacing;
      });

      if (!tooClose) {
        const z = biasedZ(rng, x, y, config);
        const radius = randRange(
          rng,
          config.somaRadiusRange[0],
          config.somaRadiusRange[1],
        );
        const aspectRatio = randRange(rng, 0.6, 0.95); // ovular, not perfectly circular
        const rotation = randRange(rng, 0, 180);

        somas.push({ id: i, pos: { x, y }, radius, z, aspectRatio, rotation });
        break;
      }
    }

    // If we exhaust attempts, we just skip this soma rather than placing an
    // overlapping one — a slightly sparser result is better than violating
    // the spacing rule. Worth surfacing this in the UI later (e.g. "placed
    // 11/14 somas") so it's visible when spacing is too aggressive for the count.
  }

  return somas;
}
