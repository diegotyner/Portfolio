// src/generator/density.ts
const SOMA_DENSITY_PER_PIXEL = 5e-6; // tuned starting point, adjust by eye

export function somaCountForArea(width: number, height: number): number {
  return Math.max(1, Math.round(width * height * SOMA_DENSITY_PER_PIXEL));
}
