import { readInput } from '../utils';

const exampleInput = readInput('Day09/exampleInput.txt');
const input = readInput('Day09/input.txt');

interface Point {
    x: number;
    y: number;
}

function parseInput(input: string): Point[] {
    const lines = input.trim().split(/\r?\n/);
    return lines.map(line => {
        const [x, y] = line.split(',').map(Number);
        return { x, y };
    });
}

function part1(input: string): number {
    const points = parseInput(input);
    let maxArea = 0;

    // Check every pair of points as opposite corners of a rectangle
    // The area includes both corner tiles, so add 1 to each dimension
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const width = Math.abs(points[j].x - points[i].x) + 1;
            const height = Math.abs(points[j].y - points[i].y) + 1;
            const area = width * height;
            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
}

// Build the path segments (edges) of the polygon
interface Segment {
    x1: number; y1: number;
    x2: number; y2: number;
    isVertical: boolean;
}

function buildPath(points: Point[]): Segment[] {
    const segments: Segment[] = [];
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        segments.push({
            x1: Math.min(p1.x, p2.x),
            y1: Math.min(p1.y, p2.y),
            x2: Math.max(p1.x, p2.x),
            y2: Math.max(p1.y, p2.y),
            isVertical: p1.x === p2.x
        });
    }
    return segments;
}

// Check if a point is on any segment of the path
function isOnPath(x: number, y: number, segments: Segment[]): boolean {
    for (const seg of segments) {
        if (seg.isVertical) {
            if (x === seg.x1 && y >= seg.y1 && y <= seg.y2) return true;
        } else {
            if (y === seg.y1 && x >= seg.x1 && x <= seg.x2) return true;
        }
    }
    return false;
}

// Check if a point is inside or on the polygon using ray casting
function isInsideOrOnPath(x: number, y: number, segments: Segment[]): boolean {
    // First check if on path
    if (isOnPath(x, y, segments)) return true;

    // Ray casting: count crossings to the right
    let crossings = 0;
    for (const seg of segments) {
        if (!seg.isVertical) continue; // Only check vertical segments
        // Segment must be to the right of point
        if (seg.x1 <= x) continue;
        // Point's y must be within segment's y range (exclusive of top to avoid double count)
        if (y >= seg.y1 && y < seg.y2) {
            crossings++;
        }
    }
    return crossings % 2 === 1;
}

// Check if an entire rectangle is within the colored region
function isRectangleValid(
    rx1: number, ry1: number, rx2: number, ry2: number,
    segments: Segment[]
): boolean {
    // We need to verify that every point on and inside the rectangle is red or green
    // Strategy: check all points along the 4 edges at positions where path segments intersect

    // Collect all x and y coordinates where we need to check
    const xCoords = new Set<number>([rx1, rx2]);
    const yCoords = new Set<number>([ry1, ry2]);

    for (const seg of segments) {
        if (seg.isVertical) {
            // Check if this vertical segment's x is within our x range
            if (seg.x1 >= rx1 && seg.x1 <= rx2) {
                xCoords.add(seg.x1);
            }
            // Add y endpoints if relevant
            if (seg.x1 >= rx1 && seg.x1 <= rx2) {
                if (seg.y1 >= ry1 && seg.y1 <= ry2) yCoords.add(seg.y1);
                if (seg.y2 >= ry1 && seg.y2 <= ry2) yCoords.add(seg.y2);
            }
        } else {
            // Horizontal segment
            if (seg.y1 >= ry1 && seg.y1 <= ry2) {
                yCoords.add(seg.y1);
            }
            if (seg.y1 >= ry1 && seg.y1 <= ry2) {
                if (seg.x1 >= rx1 && seg.x1 <= rx2) xCoords.add(seg.x1);
                if (seg.x2 >= rx1 && seg.x2 <= rx2) xCoords.add(seg.x2);
            }
        }
    }

    const sortedX = Array.from(xCoords).sort((a, b) => a - b);
    const sortedY = Array.from(yCoords).sort((a, b) => a - b);

    // Check all boundary points along edges
    // Top edge (y = ry1)
    for (const x of sortedX) {
        if (!isInsideOrOnPath(x, ry1, segments)) return false;
    }
    // Bottom edge (y = ry2)
    for (const x of sortedX) {
        if (!isInsideOrOnPath(x, ry2, segments)) return false;
    }
    // Left edge (x = rx1)
    for (const y of sortedY) {
        if (!isInsideOrOnPath(rx1, y, segments)) return false;
    }
    // Right edge (x = rx2)
    for (const y of sortedY) {
        if (!isInsideOrOnPath(rx2, y, segments)) return false;
    }

    // Also check midpoints between consecutive coordinates along edges
    for (let i = 0; i < sortedX.length - 1; i++) {
        const midX = Math.floor((sortedX[i] + sortedX[i + 1]) / 2);
        if (!isInsideOrOnPath(midX, ry1, segments)) return false;
        if (!isInsideOrOnPath(midX, ry2, segments)) return false;
    }
    for (let i = 0; i < sortedY.length - 1; i++) {
        const midY = Math.floor((sortedY[i] + sortedY[i + 1]) / 2);
        if (!isInsideOrOnPath(rx1, midY, segments)) return false;
        if (!isInsideOrOnPath(rx2, midY, segments)) return false;
    }

    // Check grid cells formed by intersection points
    for (let i = 0; i < sortedX.length - 1; i++) {
        for (let j = 0; j < sortedY.length - 1; j++) {
            const midX = Math.floor((sortedX[i] + sortedX[i + 1]) / 2);
            const midY = Math.floor((sortedY[j] + sortedY[j + 1]) / 2);
            if (!isInsideOrOnPath(midX, midY, segments)) return false;
        }
    }

    return true;
}

function part2(input: string): number {
    const points = parseInput(input);
    if (points.length < 2) return 0;

    const segments = buildPath(points);
    let maxArea = 0;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const p1 = points[i];
            const p2 = points[j];

            const rx1 = Math.min(p1.x, p2.x);
            const rx2 = Math.max(p1.x, p2.x);
            const ry1 = Math.min(p1.y, p2.y);
            const ry2 = Math.max(p1.y, p2.y);

            if (isRectangleValid(rx1, ry1, rx2, ry2, segments)) {
                const area = (rx2 - rx1 + 1) * (ry2 - ry1 + 1);
                maxArea = Math.max(maxArea, area);
            }
        }
    }

    return maxArea;
}

function run(name: string, input: string) {
    console.log(`--- ${name} ---`);
    console.log('Part 1:', part1(input).toString());
    console.log('Part 2:', part2(input).toString());
}

if (exampleInput) {
    run('Example', exampleInput);
}

if (input.length > 0) {
    run('Real Input', input);
}
