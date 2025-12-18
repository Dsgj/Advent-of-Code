import { readInput } from '../utils';

const exampleInput = readInput('Day04/exampleInput.txt');
const input = readInput('Day04/input.txt');

function parseGrid(input: string): string[][] {
    return input.trim().split('\n').map(line => line.trim().split(''));
}

function countAccessibleRolls(grid: string[][]): number {
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '@') {
                let neighborRolls = 0;
                // Check 8 neighbors
                for (let Dr = -1; Dr <= 1; Dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (Dr === 0 && dc === 0) continue;
                        const nr = r + Dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            if (grid[nr][nc] === '@') {
                                neighborRolls++;
                            }
                        }
                    }
                }

                if (neighborRolls < 4) {
                    count++;
                }
            }
        }
    }
    return count;
}

function part1(input: string): number {
    const grid = parseGrid(input);
    return countAccessibleRolls(grid);
}


// Helper to get neighbors
function getNeighbors(r: number, c: number, rows: number, cols: number): [number, number][] {
    const neighbors: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                neighbors.push([nr, nc]);
            }
        }
    }
    return neighbors;
}

function part2(input: string): number {
    const grid = parseGrid(input);
    const rows = grid.length;
    const cols = grid[0].length;

    // 1. Calculate degrees (number of neighboring rolls) for all '@'
    const degrees = new Int32Array(rows * cols).fill(0);
    const isRoll = new Int8Array(rows * cols).fill(0);
    const queue: number[] = []; // store flattened indices (r * cols + c)

    // Initialize state
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '@') {
                const idx = r * cols + c;
                isRoll[idx] = 1;

                let rollNeighbors = 0;
                for (const [nr, nc] of getNeighbors(r, c, rows, cols)) {
                    if (grid[nr][nc] === '@') {
                        rollNeighbors++;
                    }
                }
                degrees[idx] = rollNeighbors;

                // Initial check: if < 4 neighbors, it's accessible immediately
                if (rollNeighbors < 4) {
                    queue.push(idx);
                }
            }
        }
    }

    let totalRemoved = 0;

    // 2. Process Queue (Topological Sort / Kahn's Algo)
    while (queue.length > 0) {
        const currentIdx = queue.shift()!;

        // Use a set or check if already processed? 
        // Kahn allows adding to queue only once when condition is met. 
        // However, we need to be careful not to double count if a node is added multiple times?
        // Actually, in this problem, a node is added ONLY when it transitions from >=4 to <4.
        // But here we might have nodes starting <4.
        // We mark as removed to avoid re-processing.

        if (isRoll[currentIdx] === 0) continue; // Already removed

        isRoll[currentIdx] = 0; // Remove roll
        totalRemoved++;

        const r = Math.floor(currentIdx / cols);
        const c = currentIdx % cols;

        // Update neighbors
        for (const [nr, nc] of getNeighbors(r, c, rows, cols)) {
            const nIdx = nr * cols + nc;
            if (isRoll[nIdx] === 1) {
                degrees[nIdx]--;
                // If degree drops below 4, it becomes accessible
                // Crucial: Only add if it wasn't accessible before? 
                // Wait, if it was already accessible (<4), it would already be in the queue (from init).
                // If it was >=4 and now becomes 3, it enters the queue.
                // We need to ensure we don't add duplicates if degree drops from 3 to 2.
                // Simplified check: If it becomes EXACTLY 3 (dropping from 4), add it.
                // BUT: what if it started at 2? It's in queue. Removing a neighbor makes it 1. 
                // Should we add it again? No. It's already pending removal.
                // So, only add if it transitions from >=4 to <4 (i.e., became 3).

                if (degrees[nIdx] === 3) {
                    queue.push(nIdx);
                }
            }
        }
    }

    return totalRemoved;
}

function run(name: string, input: string) {
    console.log(`--- ${name} ---`);
    console.log('Part 1:', part1(input));
    console.log('Part 2:', part2(input));
}

run('Example', exampleInput);
if (input.length > 0) {
    run('Real Input', input);
}
