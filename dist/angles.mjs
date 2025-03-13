'use strict';

var TAU = 2 * Math.PI;
var EPS = 1e-10;

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
   * Normalize an arbitrary angle to the interval [-180, 180)
   *
   * @param {number} n
   * @returns {number}
   */
  'normalizeHalf': function (n) {

    var c = this['SCALE'];
    var h = c / 2;

    return mod(n + h, c) - h;
  },
  /**
   * Normalize an arbitrary angle to the interval [0, 360)
   *
   * @param {number} n
   * @returns {number}
   */
  'normalize': function (n) {

    var c = this['SCALE'];

    return mod(n, c);
  },
  /**
   * Gets the shortest direction to rotate to another angle
   *
   * @param {number} from
   * @param {number} to
   * @returns {number}
   */
  'shortestDirection': function (from, to) {

    var z = from - to;
    // mod(-z, 360) < mod(z, 360) <=> mod(z + 180, 360) < 180       , for all z \ 180

    if (from === to) {
      return 0;
      // if (mod(-z, 360) < mod(z, 360)) {
    } else if (this['normalizeHalf'](z) < 0) {
      return -1; // Left
    } else {
      return +1; // Right
    }
  },
  /**
   * Checks if an angle is between two other angles
   *
   * @param {number} n
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */
  'between': function (n, a, b) { // Check if an angle n is between a and b

    var c = this['SCALE'];
    n = mod(n, c);
    a = mod(a, c);
    b = mod(b, c);

    if (a < b)
      return a <= n && n <= b;
    // return 0 <= n && n <= b || a <= n && n < 360;
    return a <= n || n <= b;
  },
  /**
   * Calculates the angular difference between two angles
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  'diff': function (a, b) {
    return Math.abs(b - a) % this['SCALE'];
  },
  /**
   * Calculate the minimal distance between two angles
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  'distance': function (a, b) {

    var m = this['SCALE'];
    var h = m / 2;

    // One-Liner:
    //return Math.min(mod(a - b, m), mod(b - a, m));

    var diff = this['normalizeHalf'](a - b);

    if (diff > h)
      diff = diff - m;

    return Math.abs(diff);
  },
  /**
   * Calculate radians from current angle
   *
   * @param {number} n
   * @returns {number}
   */
  'toRad': function (n) {
    // https://en.wikipedia.org/wiki/Radian
    return n / this['SCALE'] * TAU;
  },
  /**
   * Calculate degrees from current angle
   *
   * @param {number} n
   * @returns {number}
   */
  'toDeg': function (n) {
    // https://en.wikipedia.org/wiki/Degree_(angle)
    return n / this['SCALE'] * 360;
  },
  /**
   * Calculate gons from current angle
   *
   * @param {number} n
   * @returns {number}
   */
  'toGon': function (n) {
    // https://en.wikipedia.org/wiki/Gradian
    return n / this['SCALE'] * 400;
  },
  /**
   * Given the sine and cosine of an angle, what is the original angle?
   *
   * @param {number} sin
   * @param {number} cos
   * @returns {number}
   */
  'fromSinCos': function (sin, cos) {

    var s = this['SCALE'];
    var angle = (1 + Math.acos(cos) / TAU) * s;

    if (sin < 0) {
      angle = s - angle;
    }
    return mod(angle, s);
  },
  /**
   * What is the angle of two points making a line
   *
   * @param {Array} p1
   * @param {Array} p2
   * @returns {number}
   */
  'fromSlope': function (p1, p2) {

    var s = this['SCALE'];
    var angle = (TAU + Math.atan2(p2[1] - p1[1], p2[0] - p1[0])) % TAU;

    return angle / TAU * s;
  },
  /**
   * Returns the quadrant
   *
   * @param {number} x The point x-coordinate
   * @param {number} y The point y-coordinate
   * @param {number=} k The optional number of regions in the coordinate-system
   * @param {number=} shift An optional angle to rotate the coordinate system
   * @returns {number}
   */
  'quadrant': function (x, y, k, shift) {

    var s = this['SCALE'];

    if (k === undefined)
      k = 4; // How many regions? 4 = quadrant, 8 = octant, ...

    if (shift === undefined)
      shift = 0; // Rotate the coordinate system by shift° (positiv = counter-clockwise)

    /* shift = PI / k, k = 4:
     *   I) 45-135
     *  II) 135-225
     * III) 225-315
     *  IV) 315-360
     */

    /* shift = 0, k = 4:
     *   I) 0-90
     *  II) 90-180
     * III) 180-270
     *  IV) 270-360
     */

    var phi = (Math.atan2(y, x) + TAU) / TAU;

    if (Math.abs(phi * s % (s / k)) < EPS) {
      return 0;
    }

    return 1 + mod(Math.floor(k * shift / s + k * phi), k);
  },
  /**
   * Calculates the compass direction of the given angle
   *
   * @param {number} course
   * @returns {string}
   */
  'compass': function (course) {

    // 0° = N
    // 90° = E
    // 180° = S
    // 270° = W

    var s = this['SCALE'];
    var k = DIRECTIONS.length;

    // floor((2ck + s) / (2s)) = round((c / s) * k)
    var dir = Math.round(course / s * k);

    return DIRECTIONS[mod(dir, k)];
  },
  /**
   * Calculates the linear interpolation of two angles
   *
   * @param {number} a Angle one
   * @param {number} b Angle two
   * @param {number} p Percentage
   * @param {number} dir Direction (either 1 [=CW] or -1 [=CCW])
   * @returns {number}
   */
  'lerp': function (a, b, p, dir) {

    var s = this['SCALE'];
    a = mod(a, s);
    b = mod(b, s);

    if (a === b)
      return a;

    // dir becomes an offset if we have to add a full revolution (=scale)
    if (!dir)
      dir = -s;
    else if ((dir === 1) === (a < b))
      dir *= s;
    else
      dir = 0;

    return mod(a + p * (b - a - dir), s);
  },
  /**
   * Calculates the average (mean) angle of an array of angles
   *
   * @param {Array<number>} angles Angle array
   * @returns {number}
   */
  'average': function (angles) {
    var s = this['SCALE'];

    // Basically treat each angle as a vector, add all the vecotrs up,
    // and return the angle of the resultant vector.

    var y = angles.map(a => Math.sin(a * TAU / s)).reduce((a, b) => a + b);
    var x = angles.map(a => Math.cos(a * TAU / s)).reduce((a, b) => a + b);

    // If the resultant vector is very short, this means the average angle is likely wrong or ambiguous.
    // For instance, what if a users asks for the average of the angles [0, PI]?

    // TODO: Warn user (or return undefined / null / NaN) when using opposite angles
    // Could be as simple as:
    //if (x * x + y * y < EPS * EPS) return NaN;

    return Math.atan2(y, x) * s / TAU;
  },
  /**
   * Determines if two angles are equal
   * 
   * @param {number} angle1 
   * @param {number} angle2 
   * @returns {boolean}
   */
  'equals': function (angle1, angle2) {

    var m = this['SCALE'];

    const normalizedAngle1 = mod(angle1, m);
    const normalizedAngle2 = mod(angle2, m);

    const diff1 = Math.abs(normalizedAngle1 - normalizedAngle2);
    const diff2 = Math.abs(diff1 - 2 * Math.PI);

    return diff1 < EPS || diff2 < EPS;
  }
};
export {
  Angles as default, Angles
};
