import Angles = require('angles');

Angles.SCALE = 360;
const point: Angles.PointTuple = [0, 1];
const scale: number = Angles.SCALE;
const normalized: number = Angles.normalize(-10);
const direction: -1 | 0 | 1 = Angles.shortestDirection(350, 10);
const compass: Angles.CompassDirection | undefined = Angles.compass(Angles.fromSlope([0, 0], point));

void point;
void scale;
void normalized;
void direction;
void compass;
