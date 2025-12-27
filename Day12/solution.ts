import { parseBlocks, readInput } from '../utils';

// A shape is a set of [row, col] coordinates relative to top-left
type Shape = [number, number][];

interface Region {
    width: number;
    height: number;
    counts: number[]; // How many of each shape index needed
}

interface ParsedInput {
    shapes: Shape[];
    regions: Region[];
}

/**
 * Parse a shape from its string representation
 * Returns array of [row, col] coordinates where '#' appears
 */
function parseShape(block: string): Shape {
    const lines = block.trim().split(/\r?\n/).slice(1); // Skip the "0:" line
    const coords: Shape = [];
    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[row].length; col++) {
            if (lines[row][col] === '#') {
                coords.push([row, col]);
            }
        }
    }
    return coords;
}

/**
 * Normalize a shape so its minimum row and col are both 0
 */
function normalize(shape: Shape): Shape {
    if (shape.length === 0) return shape;
    const minRow = Math.min(...shape.map(c => c[0]));
    const minCol = Math.min(...shape.map(c => c[1]));
    return shape.map(([r, c]) => [r - minRow, c - minCol] as [number, number])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

/**
 * Rotate a shape 90 degrees clockwise
 */
function rotate90(shape: Shape): Shape {
    // (r, c) -> (c, -r) then normalize
    return normalize(shape.map(([r, c]) => [c, -r] as [number, number]));
}

/**
 * Flip a shape horizontally
 */
function flipH(shape: Shape): Shape {
    // (r, c) -> (r, -c) then normalize
    return normalize(shape.map(([r, c]) => [r, -c] as [number, number]));
}

/**
 * Generate all unique rotations and reflections of a shape (up to 8)
 */
function generateVariants(shape: Shape): Shape[] {
    const variants: Shape[] = [];
    const seen = new Set<string>();

    let current = normalize(shape);
    for (let flip = 0; flip < 2; flip++) {
        for (let rot = 0; rot < 4; rot++) {
            const key = JSON.stringify(current);
            if (!seen.has(key)) {
                seen.add(key);
                variants.push(current);
            }
            current = rotate90(current);
        }
        current = flipH(current);
    }

    return variants;
}

/**
 * Parse the full input into shapes and regions
 */
function parseInput(input: string): ParsedInput {
    const blocks = parseBlocks(input);
    const shapes: Shape[] = [];
    const regions: Region[] = [];

    for (const block of blocks) {
        const trimmed = block.trim();

        // Check if this block contains region definitions (lines starting with NxM:)
        const lines = trimmed.split(/\r?\n/);
        let hasShape = false;

        for (const line of lines) {
            const lineTrimmed = line.trim();
            if (lineTrimmed.match(/^\d+x\d+:/)) {
                // This is a region definition
                const match = lineTrimmed.match(/^(\d+)x(\d+):\s*(.*)$/);
                if (match) {
                    const width = parseInt(match[1]);
                    const height = parseInt(match[2]);
                    const counts = match[3].split(/\s+/).map(n => parseInt(n));
                    regions.push({ width, height, counts });
                }
            } else if (lineTrimmed.match(/^\d+:$/)) {
                hasShape = true;
            }
        }

        if (hasShape && lines[0].match(/^\d+:$/)) {
            // This is a shape definition block
            shapes.push(parseShape(trimmed));
        }
    }

    return { shapes, regions };
}

/**
 * Check if a shape can be placed at position (startRow, startCol) on the grid
 */
function canPlace(
    shape: Shape,
    startRow: number,
    startCol: number,
    grid: boolean[][],
    width: number,
    height: number
): boolean {
    for (const [dr, dc] of shape) {
        const r = startRow + dr;
        const c = startCol + dc;
        if (r < 0 || r >= height || c < 0 || c >= width) return false;
        if (grid[r][c]) return false; // Already occupied
    }
    return true;
}

/**
 * Place a shape on the grid
 */
function placeShape(shape: Shape, startRow: number, startCol: number, grid: boolean[][]): void {
    for (const [dr, dc] of shape) {
        grid[startRow + dr][startCol + dc] = true;
    }
}

/**
 * Remove a shape from the grid
 */
function removeShape(shape: Shape, startRow: number, startCol: number, grid: boolean[][]): void {
    for (const [dr, dc] of shape) {
        grid[startRow + dr][startCol + dc] = false;
    }
}

/**
 * Find the first (topmost-leftmost) empty cell in the grid
 */
function findFirstEmpty(grid: boolean[][], width: number, height: number): [number, number] | null {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (!grid[row][col]) return [row, col];
        }
    }
    return null;
}

/**
 * Check if placing a shape covers a specific cell
 */
function coversCell(shape: Shape, startRow: number, startCol: number, targetRow: number, targetCol: number): boolean {
    for (const [dr, dc] of shape) {
        if (startRow + dr === targetRow && startCol + dc === targetCol) return true;
    }
    return false;
}

/**
 * Optimized backtracking solver - always fill the first empty cell
 * This dramatically reduces the search space by avoiding equivalent placements
 */
function solve(
    pieces: number[],
    allVariants: Shape[][],
    pieceIndex: number,
    grid: boolean[][],
    width: number,
    height: number
): boolean {
    // All pieces placed?
    if (pieceIndex >= pieces.length) {
        return true;
    }

    const shapeIdx = pieces[pieceIndex];
    const variants = allVariants[shapeIdx];

    // Try each variant at each position
    for (const variant of variants) {
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (canPlace(variant, row, col, grid, width, height)) {
                    placeShape(variant, row, col, grid);
                    if (solve(pieces, allVariants, pieceIndex + 1, grid, width, height)) {
                        return true;
                    }
                    removeShape(variant, row, col, grid);
                }
            }
        }
    }

    return false;
}

/**
 * Check if a region can fit all its required shapes
 */
function canFitRegion(region: Region, shapes: Shape[], allVariants: Shape[][]): boolean {
    // Expand counts into a list of shape indices to place
    const pieces: number[] = [];
    for (let i = 0; i < region.counts.length; i++) {
        for (let j = 0; j < region.counts[i]; j++) {
            pieces.push(i);
        }
    }

    if (pieces.length === 0) return true;

    // Quick check: total cells needed vs available
    const totalCells = pieces.reduce((sum, idx) => sum + shapes[idx].length, 0);
    if (totalCells > region.width * region.height) return false;

    // Create empty grid
    const grid: boolean[][] = Array.from({ length: region.height }, () =>
        Array(region.width).fill(false)
    );

    // Sort pieces by size (largest first) for better pruning
    pieces.sort((a, b) => shapes[b].length - shapes[a].length);

    return solve(pieces, allVariants, 0, grid, region.width, region.height);
}

export function part1(input: string): number {
    const { shapes, regions } = parseInput(input);

    // Pre-compute all variants for each shape
    const allVariants = shapes.map(s => generateVariants(s));

    let count = 0;
    for (const region of regions) {
        if (canFitRegion(region, shapes, allVariants)) {
            count++;
        }
    }

    return count;
}

export function part2(input: string): number {
    // Part 2 will be implemented after Part 1 is verified
    return 0;
}

export function run() {
    const exampleInput = readInput('Day12/exampleInput.txt');
    const input = readInput('Day12/input.txt');

    console.log('--- Example ---');
    console.log('Part 1:', part1(exampleInput).toString());

    if (input && input.trim()) {
        console.log('--- Real Input ---');
        console.log('Part 1:', part1(input).toString());
    }
}

if (require.main === module) {
    run();
}
