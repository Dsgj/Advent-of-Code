import { readInput } from '../utils';

const exampleInput = readInput('Day08/exampleInput.txt');
const input = readInput('Day08/input.txt');

interface Point3D {
    x: number;
    y: number;
    z: number;
    index: number;
}

interface DistancePair {
    i: number;
    j: number;
    distSq: number;
}

// Union-Find (Disjoint Set Union) data structure
class UnionFind {
    parent: number[];
    rank: number[];
    size: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.size = new Array(n).fill(1);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            return false; // Already in same set
        }

        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        } else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
            this.rank[rootX]++;
        }

        return true;
    }

    getSize(x: number): number {
        return this.size[this.find(x)];
    }

    // Get all unique circuit sizes
    getCircuitSizes(): number[] {
        const roots = new Set<number>();
        for (let i = 0; i < this.parent.length; i++) {
            roots.add(this.find(i));
        }
        return Array.from(roots).map(root => this.size[root]);
    }
}

function parseInput(input: string): Point3D[] {
    const lines = input.trim().split(/\r?\n/);
    return lines.map((line, index) => {
        const [x, y, z] = line.split(',').map(Number);
        return { x, y, z, index };
    });
}

function distanceSquared(a: Point3D, b: Point3D): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}

function getAllPairDistances(points: Point3D[]): DistancePair[] {
    const pairs: DistancePair[] = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            pairs.push({
                i,
                j,
                distSq: distanceSquared(points[i], points[j])
            });
        }
    }
    return pairs;
}

function solve(input: string, connections: number): number {
    const points = parseInput(input);
    const n = points.length;

    // Get all pairs and sort by distance
    const pairs = getAllPairDistances(points);
    pairs.sort((a, b) => a.distSq - b.distSq);

    // Use Union-Find to connect the closest pairs
    const uf = new UnionFind(n);

    // Connect the specified number of pairs (even if already in same circuit)
    for (let i = 0; i < connections && i < pairs.length; i++) {
        const pair = pairs[i];
        uf.union(pair.i, pair.j);
    }

    // Get all circuit sizes and sort descending
    const circuitSizes = uf.getCircuitSizes();
    circuitSizes.sort((a, b) => b - a);

    // Multiply the three largest (pad with 1 if fewer than 3 circuits)
    const a = circuitSizes[0] || 1;
    const b = circuitSizes[1] || 1;
    const c = circuitSizes[2] || 1;
    return a * b * c;
}

function part1(input: string): number {
    const lines = input.trim().split(/\r?\n/);
    const n = lines.length;

    // Example: 20 boxes, 10 connections
    // Real: 1000 boxes, 1000 connections
    // Scale: connections = n / 2 for example, but puzzle says 1000 for real
    // Better: use 1000 for inputs > 20, else n/2
    const connections = n > 20 ? 1000 : Math.floor(n / 2);

    return solve(input, connections);
}

function part2(input: string): number {
    const points = parseInput(input);
    const n = points.length;

    // Get all pairs and sort by distance
    const pairs = getAllPairDistances(points);
    pairs.sort((a, b) => a.distSq - b.distSq);

    // Use Union-Find to connect until all in one circuit
    const uf = new UnionFind(n);
    let numCircuits = n; // Start with n individual circuits

    for (const pair of pairs) {
        // Only count if this actually merges two different circuits
        if (uf.find(pair.i) !== uf.find(pair.j)) {
            uf.union(pair.i, pair.j);
            numCircuits--;

            // If we've reached 1 circuit, this was the last connection needed
            if (numCircuits === 1) {
                // Return product of X coordinates
                return points[pair.i].x * points[pair.j].x;
            }
        }
    }

    return 0; // Should never reach here if input is valid
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
