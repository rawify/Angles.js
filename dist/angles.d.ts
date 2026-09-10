/**
 * @license Angles.js v0.6.0 9/10/2026
 * https://raw.org/software/libraries/angles-js/
 *
 * Copyright (c) 2025-2026, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/
declare const DIRECTIONS: readonly ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
type CompassDirection = typeof DIRECTIONS[number];
type RotationDirection = -1 | 1;
type ShortestDirection = RotationDirection | 0;
type PointTuple = readonly [x: number, y: number];
/** Utilities for angles measured in a configurable number of units per turn. */
declare class Angles {
    private static scale;
    private constructor();
    static get SCALE(): number;
    static set SCALE(scale: number);
    /** Normalizes an angle to `[-SCALE / 2, SCALE / 2)`. */
    static normalizeHalf(angle: number): number;
    /** Normalizes an angle to `[0, SCALE)`. */
    static normalize(angle: number): number;
    /** Returns `-1` clockwise, `1` counter-clockwise, or `0` when equal. */
    static shortestDirection(from: number, to: number): ShortestDirection;
    /** Checks the clockwise wrapped interval from `start` to `end`, inclusively. */
    static between(angle: number, start: number, end: number): boolean;
    /** Returns the minimal unsigned angular difference. */
    static diff(a: number, b: number): number;
    /** Returns the minimal unsigned angular distance. */
    static distance(a: number, b: number): number;
    static toRad(angle: number): number;
    static toDeg(angle: number): number;
    static toGon(angle: number): number;
    /** Reconstructs a normalized angle from its sine and cosine. */
    static fromSinCos(sine: number, cosine: number): number;
    /** Returns the direction of the line from `start` to `end`. */
    static fromSlope(start: PointTuple, end: PointTuple): number;
    /**
     * Returns a one-based region index, or zero when the point lies on a boundary.
     * `regions=4` yields quadrants and `regions=8` yields octants.
     */
    static quadrant(x: number, y: number, regions?: number, shift?: number): number;
    /** Returns the nearest eight-point compass direction (`0` is north). */
    static compass(course: number): CompassDirection | undefined;
    /** Interpolates angles, optionally forcing clockwise (`-1`) or counter-clockwise (`1`). */
    static lerp(a: number, b: number, amount: number, direction?: RotationDirection): number;
    /** Returns the circular mean, or `NaN` for empty or ambiguous input. */
    static average(angles: readonly number[]): number;
    static equals(a: number, b: number): boolean;
}
declare namespace Angles {
  type CompassDirection = typeof DIRECTIONS[number];
  type RotationDirection = -1 | 1;
  type ShortestDirection = RotationDirection | 0;
  type PointTuple = readonly [x: number, y: number];
}
export = Angles;
