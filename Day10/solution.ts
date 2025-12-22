import { readInput } from '../utils';

const exampleInput = readInput('Day10/exampleInput.txt');
const input = readInput('Day10/input.txt');

interface Machine {
    targetState: boolean[];
    targetCounts?: number[];
    buttons: number[][]; // Indices of lights/counters toggled/incremented
}

function parseLine(line: string): Machine {
    // Extract target state from [...]
    const targetMatch = line.match(/\[([.#]+)\]/);
    if (!targetMatch) throw new Error(`Invalid line: ${line}`);

    const targetStr = targetMatch[1];
    const targetState = targetStr.split('').map(c => c === '#');

    // Extract buttons from (...)
    const buttonMatches = [...line.matchAll(/\(([0-9,]+)\)/g)];
    const buttons = buttonMatches.map(match => match[1].split(',').map(Number));

    // Extract target counts from {...}
    const countMatch = line.match(/\{([0-9,]+)\}/);
    let targetCounts: number[] | undefined;
    if (countMatch) {
        targetCounts = countMatch[1].split(',').map(Number);
    }

    return { targetState, buttons, targetCounts };
}

function parseInput(input: string): Machine[] {
    return input.trim().split(/\r?\n/).map(parseLine);
}

// --- Part 1 Solver (Brute Force GF2) ---

function findMinPressesPart1(machine: Machine): number {
    const { targetState, buttons } = machine;
    const numLights = targetState.length;
    const numButtons = buttons.length;

    let minPresses = Infinity;

    // Try all 2^numButtons combinations
    for (let mask = 0; mask < (1 << numButtons); mask++) {
        const state = new Array(numLights).fill(false);
        let presses = 0;

        for (let b = 0; b < numButtons; b++) {
            if (mask & (1 << b)) {
                presses++;
                for (const lightIdx of buttons[b]) {
                    if (lightIdx < numLights) {
                        state[lightIdx] = !state[lightIdx];
                    }
                }
            }
        }

        if (state.every((v, i) => v === targetState[i])) {
            minPresses = Math.min(minPresses, presses);
        }
    }

    return minPresses === Infinity ? -1 : minPresses;
}

// --- Part 2 Solver (Gaussian Elimination + Search) ---

// Rational number implementation for precise Gaussian elimination
class Rat {
    n: bigint;
    d: bigint;

    constructor(n: bigint | number, d: bigint | number = 1n) {
        this.n = BigInt(n);
        this.d = BigInt(d);
        this.simplify();
    }

    simplify() {
        if (this.d < 0n) { this.n = -this.n; this.d = -this.d; }
        const g = this.gcd(this.abs(this.n), this.d);
        this.n /= g;
        this.d /= g;
    }

    gcd(a: bigint, b: bigint): bigint { return b === 0n ? a : this.gcd(b, a % b); }
    abs(a: bigint): bigint { return a < 0n ? -a : a; }

    add(other: Rat): Rat { return new Rat(this.n * other.d + other.n * this.d, this.d * other.d); }
    sub(other: Rat): Rat { return new Rat(this.n * other.d - other.n * this.d, this.d * other.d); }
    mul(other: Rat): Rat { return new Rat(this.n * other.n, this.d * other.d); }
    div(other: Rat): Rat { return new Rat(this.n * other.d, this.d * other.n); }
    isZero(): boolean { return this.n === 0n; }
    isInteger(): boolean { return this.d === 1n; }
    toBigInt(): bigint { return this.n / this.d; } // Truncates
}

function solvePart2(machine: Machine): number {
    const { targetCounts, buttons } = machine;
    if (!targetCounts) return 0;

    const numRows = targetCounts.length; // Number of counters (equations)
    const numCols = buttons.length;      // Number of buttons (variables)

    // Build matrix A [numRows x numCols] and vector b [numRows]
    // A[i][j] = 1 if button j increments counter i, else 0
    const A: Rat[][] = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => new Rat(0))
    );
    const b: Rat[] = targetCounts.map(v => new Rat(v));

    buttons.forEach((btn, colIdx) => {
        btn.forEach(rowIdx => {
            if (rowIdx < numRows) {
                A[rowIdx][colIdx] = new Rat(1);
            }
        });
    });

    // Gaussian Elimination
    const pivotRow: number[] = []; // Stores which row is pivot for each column (or -1)
    const pivotCol: number[] = []; // Stores which column is pivot for each row (or -1)
    for (let i = 0; i < numCols; i++) pivotRow[i] = -1;
    for (let i = 0; i < numRows; i++) pivotCol[i] = -1;

    let currentRow = 0;
    const freeCols: number[] = [];
    const basicCols: number[] = [];

    for (let col = 0; col < numCols; col++) {
        // Find pivot in this column
        let pivot = -1;
        for (let row = currentRow; row < numRows; row++) {
            if (!A[row][col].isZero()) {
                pivot = row;
                break;
            }
        }

        if (pivot === -1) {
            freeCols.push(col);
            continue;
        }

        basicCols.push(col);

        // Swap rows
        [A[currentRow], A[pivot]] = [A[pivot], A[currentRow]];
        [b[currentRow], b[pivot]] = [b[pivot], b[currentRow]];
        pivot = currentRow;

        // Normalize pivot row
        const divVal = A[pivot][col];
        for (let j = col; j < numCols; j++) {
            A[pivot][j] = A[pivot][j].div(divVal);
        }
        b[pivot] = b[pivot].div(divVal);

        // Eliminate other rows
        for (let row = 0; row < numRows; row++) {
            if (row !== pivot && !A[row][col].isZero()) {
                const factor = A[row][col];
                for (let j = col; j < numCols; j++) {
                    A[row][j] = A[row][j].sub(factor.mul(A[pivot][j]));
                }
                b[row] = b[row].sub(factor.mul(b[pivot]));
            }
        }

        pivotRow[col] = pivot;
        pivotCol[pivot] = col;
        currentRow++;
    }

    // Check for inconsistency in remaining rows
    for (let row = currentRow; row < numRows; row++) {
        if (!b[row].isZero()) {
            return -1; // Inconsistent system
        }
    }

    // Identify free variables
    // Free variables are those columns that didn't become pivots
    // We iterate through possible values for free variables using a bounded search
    // Since everything is non-negative and A contains only 0/1s, 
    // a very loose upper bound for any x_i corresponds to the max target value
    // But since max free vars is 3, we can likely bound more tightly.
    // However, let's try a reasonable search range.
    // Bounds: 0 to max(targetCounts) is safe since buttons only ADD.

    const maxVal = Math.max(...targetCounts);

    // If we have too many free variables, this might be slow, but analysis said max 3
    if (freeCols.length > 5) {
        console.warn(`Warning: High number of free variables (${freeCols.length}) for machine.`);
    }

    let minTotalPresses = Infinity;

    // Helper to generate combinations of free variable values
    // We can limit the loop. If a free variable is pressed too many times, 
    // it will make some dependent variable negative.

    // To implement search, we can use recursion
    const x = new Array(numCols).fill(0n);

    const search = (freeIdx: number) => {
        if (freeIdx === freeCols.length) {
            // All free vars assigned, calculate dependent vars
            let currentTotal = 0n;
            let valid = true;

            // Compute basic variables
            for (let i = basicCols.length - 1; i >= 0; i--) {
                const col = basicCols[i];
                const row = pivotRow[col];

                // x[col] = b[row] - sum(A[row][free] * x[free])
                let sum = b[row];
                for (const fCol of freeCols) {
                    if (!A[row][fCol].isZero()) {
                        sum = sum.sub(A[row][fCol].mul(new Rat(x[fCol])));
                    }
                }

                if (!sum.isInteger() || sum.n < 0n) {
                    valid = false;
                    return;
                }
                x[col] = sum.toBigInt();
            }

            // Calculate total sum
            if (valid) {
                let sum = 0n;
                for (let i = 0; i < numCols; i++) sum += x[i];
                if (Number(sum) < minTotalPresses) {
                    minTotalPresses = Number(sum);
                }
            }
            return;
        }

        const fCol = freeCols[freeIdx];
        // Upper bound heuristic: If this button increments ANY counter, 
        // it cannot be pressed more times than that counter's target value.
        // We find the tightest bound imposed by any counter affected by this button.
        let limit = maxVal;

        // Refined bound: iterate all original rows. If A_orig[row][fCol] > 0
        // then x[fCol] <= target[row].
        // But we don't have original A easily available here (modified in place).
        // Using maxVal is safe.

        // Optimization: For >3-4 free vars, we might need simplex or better bounds.
        // Given constraint of 3 free vars, we can iterate up to maxVal? 
        // Wait, maxVal can be large? No, inputs are usually smallish numbers? 
        // Let's check input... target values up to ~275.
        // 275^3 is ~20 million. Might be slightly slow but okay for JS.
        // Let's try to optimize: x[fCol] * coeff <= rhs_remainder

        for (let val = 0; val <= maxVal; val++) {
            x[fCol] = BigInt(val);
            search(freeIdx + 1);
            // Optimization: if current partial assignment already exceeds minTotalPresses, prune?
            // But we don't know basic vars yet.
            // Actually, if x[fCol] makes any equation impossible, we can stop.
        }
    };

    search(0);

    return minTotalPresses === Infinity ? -1 : minTotalPresses;
}

function part1(input: string): number {
    const machines = parseInput(input);
    let totalPresses = 0;
    for (const machine of machines) {
        const presses = findMinPressesPart1(machine);
        if (presses !== -1) totalPresses += presses;
    }
    return totalPresses;
}

function part2(input: string): number {
    const machines = parseInput(input);
    let totalPresses = 0;

    for (const machine of machines) {
        const presses = solvePart2(machine);
        if (presses === -1) {
            console.log('No solution for Part 2 machine');
            // Typically AoC puzzles guarantee a solution, but good to know
        } else {
            totalPresses += presses;
        }
    }
    return totalPresses;
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
