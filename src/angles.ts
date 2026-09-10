/**
 * @license Angles.js v0.6.0 9/10/2026
 * https://raw.org/software/libraries/angles-js/
 *
 * Copyright (c) 2025-2026, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/

const TAU = 2 * Math.PI;
const EPSILON = 1e-12;

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export type CompassDirection = typeof DIRECTIONS[number];
export type RotationDirection = -1 | 1;
export type ShortestDirection = RotationDirection | 0;
export type PointTuple = readonly [x: number, y: number];

function modulo(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

/** Utilities for angles measured in a configurable number of units per turn. */
export class Angles {
  private static scale = 360;

  private constructor() {}

  static get SCALE(): number {
    return Angles.scale;
  }

  static set SCALE(scale: number) {
    if (!Number.isFinite(scale) || scale <= 0) {
      throw new RangeError('SCALE must be a finite positive number');
    }
    Angles.scale = scale;
  }

  /** Normalizes an angle to `[-SCALE / 2, SCALE / 2)`. */
  static normalizeHalf(angle: number): number {
    const half = Angles.SCALE / 2;
    return modulo(angle + half, Angles.SCALE) - half;
  }

  /** Normalizes an angle to `[0, SCALE)`. */
  static normalize(angle: number): number {
    return modulo(angle, Angles.SCALE);
  }

  /** Returns `-1` clockwise, `1` counter-clockwise, or `0` when equal. */
  static shortestDirection(from: number, to: number): ShortestDirection {
    const delta = Angles.normalizeHalf(to - from);
    if (Math.abs(delta) < EPSILON) return 0;
    return delta < 0 ? 1 : -1;
  }

  /** Checks the clockwise wrapped interval from `start` to `end`, inclusively. */
  static between(angle: number, start: number, end: number): boolean {
    const normalizedAngle = Angles.normalize(angle);
    const normalizedStart = Angles.normalize(start);
    const normalizedEnd = Angles.normalize(end);

    return normalizedStart <= normalizedEnd
      ? normalizedStart - EPSILON <= normalizedAngle && normalizedAngle <= normalizedEnd + EPSILON
      : normalizedStart - EPSILON <= normalizedAngle || normalizedAngle <= normalizedEnd + EPSILON;
  }

  /** Returns the minimal unsigned angular difference. */
  static diff(a: number, b: number): number {
    return Math.abs(Angles.normalizeHalf(b - a));
  }

  /** Returns the minimal unsigned angular distance. */
  static distance(a: number, b: number): number {
    return Math.abs(Angles.normalizeHalf(a - b));
  }

  static toRad(angle: number): number {
    return angle / Angles.SCALE * TAU;
  }

  static toDeg(angle: number): number {
    return angle / Angles.SCALE * 360;
  }

  static toGon(angle: number): number {
    return angle / Angles.SCALE * 400;
  }

  /** Reconstructs a normalized angle from its sine and cosine. */
  static fromSinCos(sine: number, cosine: number): number {
    return Angles.normalize(Math.atan2(sine, cosine) * Angles.SCALE / TAU);
  }

  /** Returns the direction of the line from `start` to `end`. */
  static fromSlope(start: PointTuple, end: PointTuple): number {
    const deltaX = end[0] - start[0];
    const deltaY = end[1] - start[1];
    if (deltaX === 0 && deltaY === 0) return Number.NaN;
    return Angles.normalize(Math.atan2(deltaY, deltaX) * Angles.SCALE / TAU);
  }

  /**
   * Returns a one-based region index, or zero when the point lies on a boundary.
   * `regions=4` yields quadrants and `regions=8` yields octants.
   */
  static quadrant(x: number, y: number, regions: number = 4, shift: number = 0): number {
    const angle = Angles.normalize(Math.atan2(y, x) * Angles.SCALE / TAU + shift);
    const binSize = Angles.SCALE / regions;
    const offset = modulo(angle, binSize);
    const boundaryDistance = Math.min(offset, binSize - offset);

    if (boundaryDistance < EPSILON * binSize) return 0;
    return 1 + Math.floor(angle / binSize);
  }

  /** Returns the nearest eight-point compass direction (`0` is north). */
  static compass(course: number): CompassDirection | undefined {
    if (!Number.isFinite(course)) return undefined;

    const index = Math.floor(Angles.normalize(course) / Angles.SCALE * DIRECTIONS.length + 0.5);
    return DIRECTIONS[index % DIRECTIONS.length];
  }

  /** Interpolates angles, optionally forcing clockwise (`-1`) or counter-clockwise (`1`). */
  static lerp(
    a: number,
    b: number,
    amount: number,
    direction?: RotationDirection,
  ): number {
    const start = Angles.normalize(a);
    const end = Angles.normalize(b);

    if (Angles.distance(start, end) < EPSILON) return start;

    let delta = Angles.normalizeHalf(end - start);
    if (direction === -1 && delta < 0) delta += Angles.SCALE;
    else if (direction === 1 && delta > 0) delta -= Angles.SCALE;

    return Angles.normalize(start + amount * delta);
  }

  /** Returns the circular mean, or `NaN` for empty or ambiguous input. */
  static average(angles: readonly number[]): number {
    if (angles.length === 0) return Number.NaN;

    let cosineSum = 0;
    let sineSum = 0;
    const factor = TAU / Angles.SCALE;
    for (const angle of angles) {
      const radians = angle * factor;
      cosineSum += Math.cos(radians);
      sineSum += Math.sin(radians);
    }

    const ambiguityThreshold = EPSILON * angles.length;
    if (cosineSum * cosineSum + sineSum * sineSum < ambiguityThreshold * ambiguityThreshold) {
      return Number.NaN;
    }
    return Angles.normalize(Math.atan2(sineSum, cosineSum) * Angles.SCALE / TAU);
  }

  static equals(a: number, b: number): boolean {
    return Angles.distance(a, b) < EPSILON;
  }
}

export default Angles;
