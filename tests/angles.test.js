
var assert = require("assert");
var angles = require('angles');

var tests = [
  { m: 'between', p: [38, 13, 45], r: true, s: 360 },
  { m: 'between', p: [38, 40, 45], r: false, s: 360 },
  { m: 'between', p: [12, 5, 18], r: true, s: 60 },
  { m: 'between', p: [15, 2, 18], r: true, s: 12 },
  { m: 'between', p: [38 + 360 * 3, 13 - 360 * 2, 45 + 360], r: true, s: 360 },
  { m: 'toRad', p: [90], r: Math.PI / 2, s: 360 },
  { m: 'toDeg', p: [Math.PI], r: 180, s: Math.PI * 2 },
  { m: 'toRad', p: [180], r: Math.PI, s: 360 },
  { m: 'toDeg', p: [Math.PI], r: 180, s: Math.PI * 2 },
  { m: 'distance', p: [1, 359], r: 2, s: 360 },
  { m: 'distance', p: [358, 1], r: 3, s: 360 },
  { m: 'distance', p: [18, 25], r: 7, s: 360 },
  { m: 'distance', p: [1, 359], r: 2, s: 360 },
  { m: 'normalize', p: [55], r: 55, s: 360 },
  { m: 'normalize', p: [55 + 360], r: 55, s: 360 },
  { m: 'normalize', p: [-55], r: 305, s: 360 },
  { m: 'normalize', p: [-190], r: 170, s: 360 },
  { m: 'normalizeHalf', p: [55], r: 55, s: 360 },
  { m: 'normalizeHalf', p: [55 + 360], r: 55, s: 360 },
  { m: 'normalizeHalf', p: [-55], r: -55, s: 360 },
  { m: 'normalizeHalf', p: [-190], r: 170, s: 360 },
  { m: 'fromSlope', p: [[1, 1], [5, 10]], r: 66.03751102542182, s: 360 },
  { m: 'fromSlope', p: [[124, 8984], [234, 10322]], r: 85.30015415271286, s: 360 },
  { m: 'fromSlope', p: [[424, 8984], [234, 10322]], r: 98.08213603676147, s: 360 },
  { m: 'fromSlope', p: [[345, -78445], [3475890, 8495]], r: 1.4329425927144732, s: 360 },
  { m: 'shortestDirection', p: [50, 60], r: -1, s: 360 },
  { m: 'shortestDirection', p: [60, 50], r: 1, s: 360 },
  { m: 'shortestDirection', p: [50, 50], r: 0, s: 360 },
  { m: 'shortestDirection', p: [60 + 360 * 3, 50 + 360 * 7], r: 1, s: 360 },
  { m: 'shortestDirection', p: [60 - 360 * 3, 50 - 360 * 7], r: 1, s: 360 },
  { m: 'fromSinCos', p: [Math.sin(0.3), Math.cos(0.3)], r: 0.3, s: Math.PI * 2 },
  { m: 'fromSinCos', p: [Math.sin(-0.3), Math.cos(-0.3)], r: Math.PI * 2 - 0.3, s: Math.PI * 2 },
  { m: 'fromSinCos', p: [Math.sin(0.7), Math.cos(0.7)], r: 0.7, s: Math.PI * 2 },
  { m: 'fromSinCos', p: [Math.sin(-0.7), Math.cos(-0.7)], r: Math.PI * 2 - 0.7, s: Math.PI * 2 },
  { m: 'lerp', p: [45, 135, 0.4, -1], r: 81, s: 360 },
  { m: 'lerp', p: [0, Math.PI * 2, 0.5], r: 0, s: Math.PI * 2 },
  { m: 'lerp', p: [0, Math.PI, 0.5, -1], r: Math.PI * 0.5, s: Math.PI * 2 },
  { m: 'lerp', p: [45, 360 + 315, 0.5, -1], r: 180, s: 360 },
  { m: 'lerp', p: [45, 360 + 315, 0.5, 1], r: 0, s: 360 },
  { m: 'lerp', p: [45, 360 + 315, 0, -1], r: 45, s: 360 },
  { m: 'lerp', p: [45, 360 + 315, 1, -1], r: 315, s: 360 },
  { m: 'lerp', p: [30, 90, 0.25, -1], r: 45, s: 360 },
  { m: 'lerp', p: [30, 90, 0.25, 1], r: 315, s: 360 },
  { m: 'lerp', p: [300, 60, 0.25, -1], r: 330, s: 360 },
  { m: 'lerp', p: [300, 60, 0.25, 1], r: 240, s: 360 },
  { m: 'lerp', p: [-30, 30, 0.5, -1], r: 0, s: 360 },
  { m: 'lerp', p: [-30, 30, 0.5, 1], r: 180, s: 360 },
  { m: 'lerp', p: [-30, 30, 0.25, -1], r: 345, s: 360 },
  { m: 'lerp', p: [-30, 30, 0.25, 1], r: 255, s: 360 },
  { m: 'lerp', p: [10, 10, 0.5, -1], r: 10, s: 360 },
  { m: 'lerp', p: [10, 10, 0.5, 1], r: 10, s: 360 },
  { m: 'equals', p: [0, 360], r: true, s: 360 },
  { m: 'equals', p: [90, -270], r: true, s: 360 },
  { m: 'equals', p: [-180, 180], r: true, s: 360 },
  { m: 'equals', p: [45, 405], r: true, s: 360 },
  { m: 'equals', p: [180, 540], r: true, s: 360 },
  { m: 'equals', p: [30, -330], r: true, s: 360 },
  { m: 'equals', p: [90, 270], r: false, s: 360 }, // Should be different
  { m: 'equals', p: [-720, 0], r: true, s: 360 }, // -2 full turns
  { m: 'equals', p: [0, 1e-14 * 180 / Math.PI], r: true, s: 360 }, // Small difference within tolerance
  { m: 'equals', p: [0, 1e-7 * 180 / Math.PI], r: false, s: 360 }, // Small difference outside tolerance
  { m: 'equals', p: [359.999999999999999, 0], r: true, s: 360 }, // Edge case close to wrap-around
  { m: 'equals', p: [-180, -180 - 1e-13], r: true, s: 360 }, // Slightly below -180°
  { m: 'equals', p: [180, -179.9999999999999], r: true, s: 360 }, // Slightly above -180°
  { m: 'equals', p: [0, 2 * Math.PI], r: true, s: 2 * Math.PI },
  { m: 'equals', p: [Math.PI / 2, -3 * Math.PI / 2], r: true, s: 2 * Math.PI },
  { m: 'equals', p: [-Math.PI, Math.PI], r: true, s: 2 * Math.PI },
  { m: 'equals', p: [Math.PI / 4, 9 * Math.PI / 4], r: true, s: 2 * Math.PI },
  { m: 'equals', p: [Math.PI, 3 * Math.PI], r: true, s: 2 * Math.PI },
  { m: 'equals', p: [Math.PI / 6, -11 * Math.PI / 6], r: true, s: 2 * Math.PI },
  { m: 'equals', p: [Math.PI / 2, 3 * Math.PI / 2], r: false, s: 2 * Math.PI }, // Should be different
  { m: 'equals', p: [-4 * Math.PI, 0], r: true, s: 2 * Math.PI }, // -2 full turns
  { m: 'equals', p: [0, 1e-13], r: true, s: 2 * Math.PI }, // Small difference within tolerance
  { m: 'equals', p: [0, 1e-7], r: false, s: 2 * Math.PI }, // Small difference outside tolerance
  { m: 'equals', p: [2 * Math.PI - 1e-13, 0], r: true, s: 2 * Math.PI }, // Edge case close to wrap-around
  { m: 'equals', p: [Math.PI, -Math.PI - 1e-13], r: true, s: 2 * Math.PI }, // Slightly below -π
  { m: 'equals', p: [Math.PI, -Math.PI + 1e-13], r: true, s: 2 * Math.PI } // Slightly above -π
];

for (var i = 0; i <= 360; i += 2) {

  if (i % 90 === 0)
    kl = 0;
  else if (i < 90)
    kl = 1;
  else if (i < 180)
    kl = 2;
  else if (i < 270)
    kl = 3;
  else
    kl = 4;

  if (i < 22.5 + 45 * 0) {
    dir = 'N';
  } else if (i < 22.5 + 45 * 1) {
    dir = 'NE';
  } else if (i < 22.5 + 45 * 2) {
    dir = 'E';
  } else if (i < 22.5 + 45 * 3) {
    dir = 'SE';
  } else if (i < 22.5 + 45 * 4) {
    dir = 'S';
  } else if (i < 22.5 + 45 * 5) {
    dir = 'SW';
  } else if (i < 22.5 + 45 * 6) {
    dir = 'W';
  } else if (i < 22.5 + 45 * 7) {
    dir = 'NW';
  } else {
    dir = 'N';
  }

  tests.push({
    m: 'quadrant', p: [
      Math.cos(i / 180 * Math.PI),
      Math.sin(i / 180 * Math.PI)
    ], r: kl, s: 360, label: 'Quadrant of angle ' + i
  });

  tests.push({ m: 'compass', p: [i], r: dir, s: 360, label: 'Direction of angle ' + i });
}

describe('Angles', function () {

  for (var i = 0; i < tests.length; i++) {

    (function (i) {

      it('Should work with ' + (tests[i].label || "->" + tests[i].m + "(" + tests[i].p.join(", ") + ")"), function () {

        var c = tests[i];
        angles.SCALE = c.s;
        if (typeof c.r !== 'number')
          assert.equal(angles[c.m].apply(angles, c.p), c.r)
        else
          assert(Math.abs(angles[c.m].apply(angles, c.p) - c.r) < 1e-13)
      });

    })(i);
  }
});

