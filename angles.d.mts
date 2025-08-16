
declare class Angles {
    static SCALE: number;

    /**
     * Normalize an arbitrary angle to the interval [-180, 180)
     * 
     * @param n The angle to normalize
     * @returns The normalized angle
     */
    static normalizeHalf(n: number): number;

    /**
     * Normalize an arbitrary angle to the interval [0, 360)
     * 
     * @param n The angle to normalize
     * @returns The normalized angle
     */
    static normalize(n: number): number;

    /**
     * Gets the shortest direction to rotate to another angle
     * 
     * @param from The initial angle
     * @param to The target angle
     * @returns -1 for left, 1 for right, 0 if they are equal
     */
    static shortestDirection(from: number, to: number): number;

    /**
     * Checks if an angle is between two other angles
     * 
     * @param n The angle to check
     * @param a The first boundary angle
     * @param b The second boundary angle
     * @returns True if n is between a and b
     */
    static between(n: number, a: number, b: number): boolean;

    /**
     * Calculates the angular difference between two angles
     * 
     * @param a The first angle
     * @param b The second angle
     * @returns The angular difference
     */
    static diff(a: number, b: number): number;

    /**
     * Calculate the minimal distance between two angles
     * 
     * @param a The first angle
     * @param b The second angle
     * @returns The minimal distance between the two angles
     */
    static distance(a: number, b: number): number;

    /**
     * Calculate radians from current angle
     * 
     * @param n The angle in degrees
     * @returns The angle in radians
     */
    static toRad(n: number): number;

    /**
     * Calculate degrees from current angle
     * 
     * @param n The angle in radians
     * @returns The angle in degrees
     */
    static toDeg(n: number): number;

    /**
     * Calculate gons from current angle
     * 
     * @param n The angle in degrees
     * @returns The angle in gons
     */
    static toGon(n: number): number;

    /**
     * Given the sine and cosine of an angle, what is the original angle?
     * 
     * @param sin The sine of the angle
     * @param cos The cosine of the angle
     * @returns The angle in degrees
     */
    static fromSinCos(sin: number, cos: number): number;

    /**
     * What is the angle of two points making a line
     * 
     * @param p1 The first point [x1, y1]
     * @param p2 The second point [x2, y2]
     * @returns The angle between the points in degrees
     */
    static fromSlope(p1: number[], p2: number[]): number;

    /**
     * Returns the quadrant
     * 
     * @param x The x-coordinate
     * @param y The y-coordinate
     * @param k The number of regions in the coordinate system (default 4)
     * @param shift The optional shift of the coordinate system
     * @returns The quadrant (or region) number
     */
    static quadrant(x: number, y: number, k?: number, shift?: number): number;

    /**
     * Calculates the compass direction of the given angle
     * 
     * @param course The angle in degrees
     * @returns The compass direction as a string
     */
    static compass(course: number): string;

    /**
     * Calculates the linear interpolation of two angles
     * 
     * @param a The first angle
     * @param b The second angle
     * @param p The percentage (between 0 and 1)
     * @param dir The direction (1 = CW, -1 = CCW)
     * @returns The interpolated angle
     */
    static lerp(a: number, b: number, p: number, dir: number): number;

    /**
     * Calculates the average (mean) angle of an array of angles
     * 
     * @param angles An array of angles in degrees
     * @returns The average angle in degrees
     */
    static average(angles: number[]): number;
}

export { Angles as default, Angles };