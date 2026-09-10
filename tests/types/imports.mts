import Angles, {
  Angles as NamedAngles,
  type CompassDirection,
  type PointTuple,
  type RotationDirection,
  type ShortestDirection,
} from 'angles';

Angles.SCALE = 360;
const point: PointTuple = [0, 1];
const direction: ShortestDirection = NamedAngles.shortestDirection(350, 10);
const forced: RotationDirection = -1;
const compass: CompassDirection | undefined = Angles.compass(Angles.fromSlope([0, 0], point));
const interpolated: number = Angles.lerp(350, 10, 0.5, forced);

void direction;
void compass;
void interpolated;
