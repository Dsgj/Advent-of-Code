import { parseLines, readInput } from '../utils';

// When running via `npx ts-node Day01/solution.ts`, the cwd is mainly project root.
const exampleInput = readInput('Day01/exampleInput.txt');
const input = readInput('Day01/input.txt');

/**
 * Day 01: Secret Entrance - Safe Dial Puzzle
 *
 * The safe has a circular dial with numbers 0-99.
 * Instructions are rotations: L (left, toward lower) or R (right, toward higher).
 * The dial wraps around: L from 0 goes to 99, R from 99 goes to 0.
 */

/**
 * Part 1: Count how many times the dial points at 0 AFTER a rotation completes.
 *
 * Logic:
 * - Start at dial position 50.
 * - For each instruction (e.g., "R48"), jump directly to the final position.
 * - Use modulo 100 to handle wrapping.
 * - If the final position is 0, increment the counter.
 */
function part1(input: string): number {
    const lines = parseLines(input);
    let dial = 50;
    let zeroCount = 0;

    for (const line of lines) {
        if (!line) continue;
        const direction = line[0];       // 'L' or 'R'
        const amount = parseInt(line.substring(1)); // Number of clicks

        if (direction === 'R') {
            // Right = toward higher numbers, wraps 99 -> 0
            dial = (dial + amount) % 100;
        } else if (direction === 'L') {
            // Left = toward lower numbers, wraps 0 -> 99
            dial = (dial - amount) % 100;
            if (dial < 0) dial += 100;
        }

        // Only count if dial lands on 0 at the END of the rotation
        if (dial === 0) {
            zeroCount++;
        }
    }
    return zeroCount;
}

/**
 * Part 2: Count how many times the dial points at 0 DURING any click.
 *
 * Optimization:
 * Instead of simulating each click, we use modular arithmetic to calculate
 * how many times the dial wraps around or crosses 0 in the given range.
 * Complexity: O(1) per instruction.
 */
function part2(input: string): number {
    const lines = parseLines(input);
    let dial = 50;
    let zeroCount = 0;

    for (const line of lines) {
        if (!line) continue;
        const direction = line[0];
        const amount = parseInt(line.substring(1));

        if (direction === 'R') {
            // Moving Right (increasing): dial values are [start+1, start+amount]
            // We count multiples of 100 in the range (dial, dial + amount]
            // Number of multiples = floor((dial + amount)/100) - floor(dial/100)
            // Since dial is in [0, 99], floor(dial/100) is always 0.
            const crossings = Math.floor((dial + amount) / 100);
            zeroCount += crossings;
            dial = (dial + amount) % 100;
        } else if (direction === 'L') {
            // Moving Left (decreasing): dial values are [start-1, start-amount]
            // We count multiples of 100 in the range [dial - amount, dial - 1]
            // Formula: floor(max/100) - floor((min-1)/100)
            // Range is [dial - amount, dial - 1]
            // Count = floor((dial - 1)/100) - floor((dial - amount - 1)/100)
            const upper = dial - 1;
            const lower = dial - amount;
            const crossings = Math.floor(upper / 100) - Math.floor((lower - 1) / 100);
            zeroCount += crossings;

            // Correct JS negative modulo behavior
            dial = ((dial - amount) % 100 + 100) % 100;
        }
    }
    return zeroCount;
}

function run(name: string, input: string) {
    console.log(`--- ${name} ---`);
    console.log('Part 1:', part1(input).toString());
    console.log('Part 2:', part2(input).toString());
}

if (exampleInput) run('Example', exampleInput);

if (input.length > 0) {
    run('Real Input', input);
}

