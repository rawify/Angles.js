const assert = require('node:assert/strict');
const { afterEach, describe, it } = require('node:test');
const Angles = require('..');

const TAU = 2 * Math.PI;

function approximately(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

describe('Angles', () => {
  afterEach(() => {
    Angles.SCALE = 360;
  });

  it('normalizes angles in full and signed ranges', () => {
    assert.equal(Angles.normalize(55 + 360), 55);
    assert.equal(Angles.normalize(-55), 305);
    assert.equal(Angles.normalizeHalf(55 + 360), 55);
    assert.equal(Angles.normalizeHalf(-190), 170);
    assert.equal(Angles.normalizeHalf(180), -180);
  });

  it('supports arbitrary positive angular scales', () => {
    Angles.SCALE = TAU;
    approximately(Angles.normalize(-Math.PI / 2), 3 * Math.PI / 2);
    approximately(Angles.normalizeHalf(3 * Math.PI / 2), -Math.PI / 2);
    approximately(Angles.toDeg(Math.PI), 180);

    Angles.SCALE = 400;
    approximately(Angles.toGon(100), 100);
    approximately(Angles.toRad(100), Math.PI / 2);
  });

  it('rejects invalid angular scales without changing the current scale', () => {
    for (const scale of [0, -360, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.throws(() => {
        Angles.SCALE = scale;
      }, RangeError);
      assert.equal(Angles.SCALE, 360);
    }
  });

  it('checks ordinary and wrapped inclusive intervals', () => {
    assert.equal(Angles.between(38, 13, 45), true);
    assert.equal(Angles.between(38, 40, 45), false);
    assert.equal(Angles.between(355, 350, 10), true);
    assert.equal(Angles.between(5, 350, 10), true);
    assert.equal(Angles.between(180, 350, 10), false);
    assert.equal(Angles.between(13 - 720, 13, 45 + 360), true);
  });

  it('calculates unsigned angular differences and wrapped equality', () => {
    assert.equal(Angles.diff(1, 359), 2);
    assert.equal(Angles.distance(358, 1), 3);
    assert.equal(Angles.equals(0, 360), true);
    assert.equal(Angles.equals(-180, 180), true);
    assert.equal(Angles.equals(90, 270), false);
    assert.equal(Angles.equals(0, 1e-7), false);
  });

  it('returns the shortest rotation direction', () => {
    assert.equal(Angles.shortestDirection(50, 60), -1);
    assert.equal(Angles.shortestDirection(60, 50), 1);
    assert.equal(Angles.shortestDirection(50, 50), 0);
    assert.equal(Angles.shortestDirection(60 + 3 * 360, 50 + 7 * 360), 1);
  });

  it('converts to standard angular units', () => {
    approximately(Angles.toRad(90), Math.PI / 2);
    approximately(Angles.toDeg(180), 180);
    approximately(Angles.toGon(90), 100);

    Angles.SCALE = TAU;
    approximately(Angles.toRad(Math.PI), Math.PI);
    approximately(Angles.toDeg(Math.PI), 180);
    approximately(Angles.toGon(Math.PI), 200);
  });

  it('reconstructs angles from sine/cosine and point slopes', () => {
    Angles.SCALE = TAU;
    approximately(Angles.fromSinCos(Math.sin(-0.3), Math.cos(-0.3)), TAU - 0.3);

    Angles.SCALE = 360;
    approximately(Angles.fromSlope([1, 1], [5, 10]), 66.03751102542182);
    assert.equal(Angles.fromSlope([1, 1], [1, 1]), Number.NaN);
  });

  it('classifies quadrants, boundaries, rotated systems, and octants', () => {
    for (let degrees = 0; degrees <= 360; degrees += 2) {
      const x = Math.cos(degrees / 180 * Math.PI);
      const y = Math.sin(degrees / 180 * Math.PI);
      const expected = degrees % 90 === 0 ? 0 : 1 + Math.floor(degrees / 90) % 4;
      assert.equal(Angles.quadrant(x, y), expected, `${degrees} degrees`);
    }

    assert.equal(Angles.quadrant(1, 1, 8), 0);
    assert.equal(Angles.quadrant(1, 0, 4, 45), 1);
    assert.equal(Angles.quadrant(1, 0, 4, -45), 4);
    assert.equal(Angles.quadrant(1, 0, 4, -405), 4);
  });

  it('maps normalized and wrapped courses to compass directions', () => {
    const expected = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    for (let index = 0; index < expected.length; index++) {
      assert.equal(Angles.compass(index * 45), expected[index]);
    }
    assert.equal(Angles.compass(-45), 'NW');
    assert.equal(Angles.compass(360), 'N');
    assert.equal(Angles.compass(Number.NaN), undefined);
  });

  it('interpolates across wraparound and honors forced directions', () => {
    assert.equal(Angles.lerp(45, 135, 0.4, -1), 81);
    assert.equal(Angles.lerp(300, 60, 0.25, -1), 330);
    assert.equal(Angles.lerp(300, 60, 0.25, 1), 240);
    assert.equal(Angles.lerp(-30, 30, 0.5, -1), 0);
    assert.equal(Angles.lerp(-30, 30, 0.5, 1), 180);
    assert.equal(Angles.lerp(10, 10, 0.5), 10);
    assert.equal(Angles.lerp(30, 90, 1.5, -1), 120);
  });

  it('calculates circular means', () => {
    approximately(Angles.average([350, 10]), 0);
    approximately(Angles.average([80, 90, 100]), 90);
    assert.equal(Angles.average([]), Number.NaN);
    assert.equal(Angles.average([0, 180]), Number.NaN);

    const balanced = Array.from({ length: 20_000 }, (_, index) => index % 2 * 180);
    assert.equal(Angles.average(balanced), Number.NaN);
  });
});
