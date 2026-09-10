# Angles.js

[![NPM Package](https://img.shields.io/npm/v/angles.svg?style=flat)](https://www.npmjs.com/package/angles)
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

Angles.js is a small, dependency-free TypeScript library for normalized angles,
wrapped ranges, shortest-path interpolation, circular means, unit conversion,
compass labels, and directions derived from points.

Angles are expressed in a configurable number of units per full turn. The
default is `360`, but `2 * Math.PI` supports radians and `400` supports gradians.
All operations are exposed as static methods on the `Angles` class.

## Installation

```bash
npm install angles
```

ES modules:

```ts
import Angles, {
  type CompassDirection,
  type PointTuple,
  type RotationDirection,
  type ShortestDirection,
} from 'angles';

Angles.SCALE = 360;
console.log(Angles.normalize(-10)); // 350
```

CommonJS:

```js
const Angles = require('angles');

Angles.SCALE = 360;
console.log(Angles.normalize(-10)); // 350
```

The package requires Node.js 20 or newer and includes CommonJS, ES module,
browser, source-map, and TypeScript declaration files.

## Browser

### Browser global with jsDelivr

The minified browser build creates the global `Angles` class:

```html
<script src="https://cdn.jsdelivr.net/npm/angles@0.6.0/dist/angles.min.js"></script>
<script>
  Angles.SCALE = 360;
  console.log(Angles.normalize(-725)); // 355
  console.log(Angles.compass(225));    // "SW"
</script>
```

### Browser global with unpkg

```html
<script src="https://unpkg.com/angles@0.6.0/dist/angles.min.js"></script>
<script>
  const midpoint = Angles.lerp(350, 10, 0.5, -1);
  console.log(midpoint); // 0
</script>
```

Pinning the version in CDN URLs prevents an update from changing behavior
without a corresponding application deployment.

### Browser ES module

```html
<script type="module">
  import Angles from 'https://cdn.jsdelivr.net/npm/angles@0.6.0/dist/angles.min.mjs';

  Angles.SCALE = 2 * Math.PI;
  console.log(Angles.normalize(-Math.PI / 2)); // 3π / 2
</script>
```

Bundlers can use the dedicated browser subpath:

```ts
import Angles from 'angles/browser';
```

The global build also supports AMD loaders.

## Angular scale

### `Angles.SCALE`

The number of units in one full turn. It defaults to `360` and must be a finite
positive number.

```ts
Angles.SCALE = 360;         // degrees
Angles.SCALE = 2 * Math.PI; // radians
Angles.SCALE = 400;         // gradians
```

`SCALE` is shared mutable state. Do not switch it between unit systems while
independent operations are running concurrently. Convert values explicitly
when an application uses multiple units at the same time.

Assigning zero, a negative value, `NaN`, or infinity throws a `RangeError`.

## Normalization and comparison

### `Angles.normalize(angle)`

Normalizes `angle` to the half-open interval `[0, SCALE)`.

```ts
Angles.SCALE = 360;
Angles.normalize(-55); // 305
Angles.normalize(415); // 55
```

### `Angles.normalizeHalf(angle)`

Normalizes `angle` to `[-SCALE / 2, SCALE / 2)`. The positive half-turn is
represented by its negative equivalent.

```ts
Angles.normalizeHalf(190); // -170
Angles.normalizeHalf(180); // -180
```

### `Angles.distance(a, b)`

Returns the minimal unsigned angular distance between `a` and `b`.

```ts
Angles.distance(358, 1); // 3
```

### `Angles.diff(a, b)`

Returns the minimal unsigned angular difference. It is equivalent to
`distance(a, b)` and retained as a concise compatibility alias.

```ts
Angles.diff(1, 359); // 2
```

### `Angles.equals(a, b)`

Returns whether two angles differ by less than the internal angular tolerance,
including across the wrap boundary.

```ts
Angles.equals(0, 360);  // true
Angles.equals(90, 270); // false
```

### `Angles.between(angle, start, end)`

Checks whether `angle` lies in the inclusive clockwise interval from `start` to
`end`. Inputs need not be normalized, and wrapped intervals are supported.

```ts
Angles.between(5, 350, 10);   // true
Angles.between(355, 350, 10); // true
Angles.between(180, 350, 10); // false
```

## Direction and interpolation

### `Angles.shortestDirection(from, to)`

Returns the shortest rotation direction:

- `-1` for clockwise
- `1` for counter-clockwise
- `0` when both angles are equal within tolerance

For systems where angles increase counter-clockwise, the visual interpretation
of these signs is naturally reversed.

```ts
Angles.shortestDirection(350, 10); // -1
Angles.shortestDirection(10, 350); // 1
Angles.shortestDirection(10, 10);  // 0
```

Exactly opposite angles use the normalized negative half-turn and therefore
return `1`.

### `Angles.lerp(a, b, amount, direction?)`

Interpolates from `a` to `b`. Without `direction`, the normalized shortest path
is used. Pass `-1` to force clockwise movement or `1` to force
counter-clockwise movement.

```ts
Angles.lerp(350, 10, 0.5);      // 0
Angles.lerp(300, 60, 0.25, -1); // 330
Angles.lerp(300, 60, 0.25, 1);  // 240
```

`amount` is not clamped: values outside `[0, 1]` extrapolate. Equal endpoints
return the normalized start angle.

## Unit conversion

Conversions interpret their input in the current `SCALE`; they do not modify
the input or change `SCALE`.

### `Angles.toRad(angle)`

Converts from the current units to radians.

```ts
Angles.SCALE = 360;
Angles.toRad(90); // Math.PI / 2
```

### `Angles.toDeg(angle)`

Converts from the current units to degrees.

```ts
Angles.SCALE = 2 * Math.PI;
Angles.toDeg(Math.PI); // 180
```

### `Angles.toGon(angle)`

Converts from the current units to gradians, where one full turn is `400`.

```ts
Angles.SCALE = 360;
Angles.toGon(90); // 100
```

## Constructing angles

### `Angles.fromSinCos(sine, cosine)`

Reconstructs an angle from its sine and cosine using `Math.atan2()` and returns
it normalized to `[0, SCALE)`.

```ts
Angles.SCALE = 2 * Math.PI;
Angles.fromSinCos(Math.sin(-0.3), Math.cos(-0.3)); // 2π - 0.3
```

Passing both values as zero follows `Math.atan2(0, 0)` and returns zero.

### `Angles.fromSlope(start, end)`

Returns the direction from `start` to `end`. Points are readonly tuples in
`[x, y]` order. Equal points have no direction and return `NaN`.

```ts
Angles.SCALE = 360;
Angles.fromSlope([0, 0], [0, 1]); // 90
Angles.fromSlope([2, 3], [2, 3]); // NaN
```

## Regions and compass labels

### `Angles.quadrant(x, y, regions = 4, shift = 0)`

Divides the full turn into equal regions and returns a one-based region index.
Points exactly on a region boundary return `0`. Set `regions` to `4` for
quadrants or `8` for octants. `shift` rotates the region boundaries in current
angle units and may be positive or negative.

```ts
Angles.SCALE = 360;
Angles.quadrant(1, 1);          // 1
Angles.quadrant(-1, 1);         // 2
Angles.quadrant(1, 0);          // 0, on a boundary
Angles.quadrant(1, 0, 4, -45); // 4
Angles.quadrant(1, 1, 8);       // 0, on an octant boundary
```

The origin has no geometric direction, but follows `Math.atan2(0, 0)` and is
reported as boundary `0`.

### `Angles.compass(course)`

Returns the nearest eight-point compass label. Compass courses use north at
zero and increase through east, south, and west.

```ts
Angles.SCALE = 360;
Angles.compass(0);   // "N"
Angles.compass(45);  // "NE"
Angles.compass(225); // "SW"
Angles.compass(-45); // "NW"
```

The result is one of `"N"`, `"NE"`, `"E"`, `"SE"`, `"S"`, `"SW"`, `"W"`,
or `"NW"`. Non-finite input returns `undefined`.

## Circular mean

### `Angles.average(angles)`

Returns the circular mean of an array or readonly array of angles. Unlike an
ordinary arithmetic mean, values on either side of the wrap boundary remain
close to each other.

```ts
Angles.average([350, 10]);     // 0
Angles.average([80, 90, 100]); // 90
```

An empty array or a directionally balanced set such as `[0, 180]` returns
`NaN`, because no unique mean direction exists.

## TypeScript types

The package exports the following types:

```ts
type CompassDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
type RotationDirection = -1 | 1;
type ShortestDirection = RotationDirection | 0;
type PointTuple = readonly [x: number, y: number];
```

The declaration files are generated from the TypeScript source for both ESM
and CommonJS consumers.

With CommonJS TypeScript syntax, the same types are available on the merged
class namespace:

```ts
import Angles = require('angles');

const point: Angles.PointTuple = [0, 1];
const direction: Angles.RotationDirection = -1;
```

## Development

Node.js 20 or newer is required.

```bash
npm install
npm test
```

`npm test` performs strict type checking, builds every distribution, validates
ESM and CommonJS type consumers, and runs the runtime and browser-format tests.

Build without running the tests:

```bash
npm run build
```

## Copyright and licensing

Copyright (c) 2026, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
