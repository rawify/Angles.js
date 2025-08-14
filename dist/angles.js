'use strict';

var TAU = 2 * Math.PI;
var EPS = 1e-12;

// var DIRECTIONS = ["N", "E", "S", "W"];
var DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
// var DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

/**
 * Mathematical modulo
 *
 * @param {number} x
 * @param {number} m
 * @returns {number}
 */
function mod(x, m) {
  return (x % m + m) % m;
}

var Angles = {
  'SCALE': 360,

  /**
   * Normalize an arbitrary angle to the interval [-SCALE/2, SCALE/2)
   *
   * @param {number} n
   * @returns {number}
   */
  'normalizeHalf': function (n) {
    const c = this['SCALE'];
    const h = c / 2;
    return mod(n + h, this['SCALE']) - h;
  },

  /**
   * Normalize an arbitrary angle to the interval [0, SCALE)
   *
   * @param {number} n
   * @returns {number}
   */
  'normalize': function (n) {
    return mod(n, this['SCALE']);
  },

  /**
   * Gets the shortest direction to rotate to another angle
   *
   * @param {number} from
   * @param {number} to
   * @returns {number}
   */
  'shortestDirection': function (from, to) {
    const d = this['normalizeHalf'](to - from); // + => CW, - => CCW
    if (Math.abs(d) < EPS) return 0;
    return d < 0 ? +1 : -1;
  },

  /**
   * Checks if an angle is between two other angles (endpoints inclusive, EPS tolerance)
   *
   * @param {number} n
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */
  'between': function (n, a, b) {
    const c = this['SCALE'];
    n = mod(n, c);
    a = mod(a, c);
    b = mod(b, c);

    return a <= b
      ? (a - EPS <= n && n <= b + EPS)
      : (a - EPS <= n || n <= b + EPS);
  },

  /**
   * Minimal unsigned angular difference between two angles (in SCALE units)
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  'diff': function (a, b) {
    const c = this['SCALE'], h = c / 2;
    return Math.abs(((b - a + h) % c + c) % c - h);
  },

  /**
   * Minimal distance between two angles (unsigned), in SCALE units
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  'distance': function (a, b) {
    return Math.abs(this['normalizeHalf'](a - b));
  },

  /**
   * Calculate radians from current angle units
   *
   * @param {number} n
   * @returns {number}
   */
  'toRad': function (n) {
    return n / this['SCALE'] * TAU;
  },

  /**
   * Calculate degrees from current angle units
   *
   * @param {number} n
   * @returns {number}
   */
  'toDeg': function (n) {
    return n / this['SCALE'] * 360;
  },

  /**
   * Calculate gons from current angle units
   *
   * @param {number} n
   * @returns {number}
   */
  'toGon': function (n) {
    return n / this['SCALE'] * 400;
  },

  /**
   * Given sine and cosine of an angle, return the original angle in current units
   *
   * @param {number} sin
   * @param {number} cos
   * @returns {number}
   */
  'fromSinCos': function (sin, cos) {
    return ((Math.atan2(sin, cos) + TAU) % TAU) * this['SCALE'] / TAU;
  },

  /**
   * Angle of the line p1 -> p2, in current units
   *
   * @param {Array} p1
   * @param {Array} p2
   * @returns {number}
   */
  'fromSlope': function (p1, p2) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    if (dx === 0 && dy === 0) return NaN; // undefined direction
    const angle = (Math.atan2(dy, dx) + TAU) % TAU;
    return angle * this['SCALE'] / TAU;
  },

  /**
   * Returns the region index (quadrant/octant/…); 0 if exactly on a boundary (within EPS)
   *
   * @param {number} x The point x-coordinate
   * @param {number} y The point y-coordinate
   * @param {number=} k The optional number of regions in the coordinate-system, 4 = quadrant, 8 = octant, …
   * @param {number=} shift An optional angle (in current units) to rotate the coordinate system
   * @returns {number}
   */
  'quadrant': function (x, y, k = 4, shift = 0) {
    const s = this['SCALE'];

    // angle in [0,1) turns
    const phiTurns = (Math.atan2(y, x) + TAU) / TAU;

    // Bin size in current units and scaled tolerance for boundary detection
    const bin = s / k;
    // distance to nearest bin boundary (mod bin)
    const u = (phiTurns * s + shift) % bin;
    const d = Math.min(u, bin - u);

    if (d < EPS * bin) return 0;

    const idx = Math.floor((phiTurns * s + shift) / bin);
    return 1 + mod(idx, k);
  },

  /**
   * Calculates the compass direction of the given angle
   *
   * @param {number} course
   * @returns {string}
   */
  'compass': function (course) {
    // 0° = N; 90° = E; 180° = S; 270° = W (for SCALE=360 and DIRECTIONS length = 8)
    const s = this['SCALE'];
    const k = DIRECTIONS.length;
    const idx = Math.floor(mod(course, s) / s * k + 0.5);
    return DIRECTIONS[idx % k];
  },

  /**
   * Linear interpolation between two angles
   *
   * @param {number} a Angle one
   * @param {number} b Angle two
   * @param {number} p Percentage
   * @param {number} dir Direction (either 1 [=CW] or -1 [=CCW])
   * @returns {number}
   */
  'lerp': function (a, b, p, dir) {
    const s = this['SCALE'];

    a = mod(a, s);
    b = mod(b, s);

    if (this['distance'](a, b) < EPS) return a;

    // delta along shortest path
    let delta = this['normalizeHalf'](b - a);

    // honor forced direction: dir = -1 (CW) or +1 (CCW)
    if (dir === -1 && delta < 0) delta += s;
    else if (dir === +1 && delta > 0) delta -= s;

    return mod(a + p * delta, s);
  },

  /**
   * Average (mean) angle of an array of angles (returns NaN if ambiguous)
   *
   * @param {Array<number>} angles Angle array
   * @returns {number}
   */
  'average': function (angles) {
    const s = this['SCALE'];
    if (!angles.length) return NaN;

    let sx = 0, sy = 0;
    const f = TAU / s;
    for (let i = 0; i < angles.length; i++) {
      const t = angles[i] * f;
      sx += Math.cos(t);
      sy += Math.sin(t);
    }
    const r2 = sx * sx + sy * sy;
    if (r2 < EPS * EPS) return NaN; // ambiguous / opposite angles
    return (Math.atan2(sy, sx) * s / TAU + s) % s;
  },

  /**
   * Determines if two angles are equal within tolerance
   *
   * @param {number} angle1
   * @param {number} angle2
   * @returns {boolean}
   */
  'equals': function (angle1, angle2) {
    return this['distance'](angle1, angle2) < EPS;
  }
};

Object.defineProperty(Angles, "__esModule", { 'value': true });
Angles['default'] = Angles;
Angles['Angles'] = Angles;
module['exports'] = Angles;
