"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/angles.ts
var angles_exports = {};
__export(angles_exports, {
  Angles: () => Angles,
  default: () => angles_default
});
module.exports = __toCommonJS(angles_exports);
/**
 * @license Angles.js v0.6.0 9/10/2026
 * https://raw.org/software/libraries/angles-js/
 *
 * Copyright (c) 2025-2026, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/
var TAU = 2 * Math.PI;
var EPSILON = 1e-12;
var DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function modulo(value, modulus) {
  return (value % modulus + modulus) % modulus;
}
var _Angles = class _Angles {
  constructor() {
  }
  static get SCALE() {
    return _Angles.scale;
  }
  static set SCALE(scale) {
    if (!Number.isFinite(scale) || scale <= 0) {
      throw new RangeError("SCALE must be a finite positive number");
    }
    _Angles.scale = scale;
  }
  /** Normalizes an angle to `[-SCALE / 2, SCALE / 2)`. */
  static normalizeHalf(angle) {
    const half = _Angles.SCALE / 2;
    return modulo(angle + half, _Angles.SCALE) - half;
  }
  /** Normalizes an angle to `[0, SCALE)`. */
  static normalize(angle) {
    return modulo(angle, _Angles.SCALE);
  }
  /** Returns `-1` clockwise, `1` counter-clockwise, or `0` when equal. */
  static shortestDirection(from, to) {
    const delta = _Angles.normalizeHalf(to - from);
    if (Math.abs(delta) < EPSILON) return 0;
    return delta < 0 ? 1 : -1;
  }
  /** Checks the clockwise wrapped interval from `start` to `end`, inclusively. */
  static between(angle, start, end) {
    const normalizedAngle = _Angles.normalize(angle);
    const normalizedStart = _Angles.normalize(start);
    const normalizedEnd = _Angles.normalize(end);
    return normalizedStart <= normalizedEnd ? normalizedStart - EPSILON <= normalizedAngle && normalizedAngle <= normalizedEnd + EPSILON : normalizedStart - EPSILON <= normalizedAngle || normalizedAngle <= normalizedEnd + EPSILON;
  }
  /** Returns the minimal unsigned angular difference. */
  static diff(a, b) {
    return Math.abs(_Angles.normalizeHalf(b - a));
  }
  /** Returns the minimal unsigned angular distance. */
  static distance(a, b) {
    return Math.abs(_Angles.normalizeHalf(a - b));
  }
  static toRad(angle) {
    return angle / _Angles.SCALE * TAU;
  }
  static toDeg(angle) {
    return angle / _Angles.SCALE * 360;
  }
  static toGon(angle) {
    return angle / _Angles.SCALE * 400;
  }
  /** Reconstructs a normalized angle from its sine and cosine. */
  static fromSinCos(sine, cosine) {
    return _Angles.normalize(Math.atan2(sine, cosine) * _Angles.SCALE / TAU);
  }
  /** Returns the direction of the line from `start` to `end`. */
  static fromSlope(start, end) {
    const deltaX = end[0] - start[0];
    const deltaY = end[1] - start[1];
    if (deltaX === 0 && deltaY === 0) return Number.NaN;
    return _Angles.normalize(Math.atan2(deltaY, deltaX) * _Angles.SCALE / TAU);
  }
  /**
   * Returns a one-based region index, or zero when the point lies on a boundary.
   * `regions=4` yields quadrants and `regions=8` yields octants.
   */
  static quadrant(x, y, regions = 4, shift = 0) {
    const angle = _Angles.normalize(Math.atan2(y, x) * _Angles.SCALE / TAU + shift);
    const binSize = _Angles.SCALE / regions;
    const offset = modulo(angle, binSize);
    const boundaryDistance = Math.min(offset, binSize - offset);
    if (boundaryDistance < EPSILON * binSize) return 0;
    return 1 + Math.floor(angle / binSize);
  }
  /** Returns the nearest eight-point compass direction (`0` is north). */
  static compass(course) {
    if (!Number.isFinite(course)) return void 0;
    const index = Math.floor(_Angles.normalize(course) / _Angles.SCALE * DIRECTIONS.length + 0.5);
    return DIRECTIONS[index % DIRECTIONS.length];
  }
  /** Interpolates angles, optionally forcing clockwise (`-1`) or counter-clockwise (`1`). */
  static lerp(a, b, amount, direction) {
    const start = _Angles.normalize(a);
    const end = _Angles.normalize(b);
    if (_Angles.distance(start, end) < EPSILON) return start;
    let delta = _Angles.normalizeHalf(end - start);
    if (direction === -1 && delta < 0) delta += _Angles.SCALE;
    else if (direction === 1 && delta > 0) delta -= _Angles.SCALE;
    return _Angles.normalize(start + amount * delta);
  }
  /** Returns the circular mean, or `NaN` for empty or ambiguous input. */
  static average(angles) {
    if (angles.length === 0) return Number.NaN;
    let cosineSum = 0;
    let sineSum = 0;
    const factor = TAU / _Angles.SCALE;
    for (const angle of angles) {
      const radians = angle * factor;
      cosineSum += Math.cos(radians);
      sineSum += Math.sin(radians);
    }
    const ambiguityThreshold = EPSILON * angles.length;
    if (cosineSum * cosineSum + sineSum * sineSum < ambiguityThreshold * ambiguityThreshold) {
      return Number.NaN;
    }
    return _Angles.normalize(Math.atan2(sineSum, cosineSum) * _Angles.SCALE / TAU);
  }
  static equals(a, b) {
    return _Angles.distance(a, b) < EPSILON;
  }
};
_Angles.scale = 360;
var Angles = _Angles;
var angles_default = Angles;
const AnglesExport=module.exports.default;AnglesExport.default=AnglesExport;AnglesExport.Angles=AnglesExport;module.exports=AnglesExport;
//# sourceMappingURL=angles.js.map
