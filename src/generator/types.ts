export interface Point {
  x: number;
  y: number;
}

export interface Soma {
  id: number;
  pos: Point;
  radius: number; // base blob radius before z-scaling
  z: number; // depth: 0 = far, 1 = near
  aspectRatio: number; // NEW — ry/rx ratio, 1 = circular, <1 = flattened oval
  rotation: number; // NEW — degrees, orientation of the oval
}

export interface GeneratorConfig {
  width: number;
  height: number;
  seed: number;

  somaCount: number;
  somaRadiusRange: [number, number];
  somaMinSpacing: number; // reject placements closer than this (in canvas units)
  somaMaxAttempts: number; // per-soma placement retry budget before giving up

  // z-depth
  zRange: [number, number]; // usually [0, 1]
}

export const DEFAULT_CONFIG: GeneratorConfig = {
  width: 800,
  height: 800,
  seed: 1,

  somaCount: 9,
  somaRadiusRange: [8, 22],
  somaMinSpacing: 60,
  somaMaxAttempts: 40,

  zRange: [0, 1],
};

export interface Branch {
  id: number;
  somaId: number;
  parentId: number | null;
  start: Point;
  end: Point;
  startWidth: number;
  endWidth: number;
  depth: number;
  z: number;
}

export interface GrowthConfig {
  stemCount: number;
  initialWidth: number;
  widthThreshold: number;
  taperRate: number;
  segmentLength: number;
  terminalLength: number;
  daughterRatio: number;
  forkProbability: number;
  maxDepth: number;
  tropismStrength: number;
  jitterAmount: number;
}

export const DEFAULT_GROWTH_CONFIG: GrowthConfig = {
  stemCount: 3,
  initialWidth: 5,
  widthThreshold: 0.3,
  taperRate: 0.95,
  segmentLength: 30,
  terminalLength: 10,
  daughterRatio: 0.5,
  forkProbability: 0.5,
  maxDepth: 12,
  tropismStrength: 0.05,
  jitterAmount: 0.5,
};

export interface DepthConfig {
  scaleMin: number; // size multiplier at z=0 (far)
  scaleRange: number; // scale = scaleMin + z * scaleRange
  opacityMin: number; // opacity at z=0 (far)
  opacityRange: number; // opacity = opacityMin + z * opacityRange
}

export const DEFAULT_DEPTH_CONFIG: DepthConfig = {
  scaleMin: 0.5,
  scaleRange: 0.5,
  opacityMin: 0.4,
  opacityRange: 0.6,
};
