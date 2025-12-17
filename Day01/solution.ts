import { readInput, parseLines } from '../utils';

// When running via `npx ts-node Day01/solution.ts`, the cwd is mainly project root.
const exampleInput = readInput('Day01/exampleInput.txt');
const input = readInput('Day01/input.txt');
const exampleLines = parseLines(exampleInput);
const lines = parseLines(input);

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
function part1(lines: string[]) {
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
    console.log('Part 1 Result:', zeroCount);
}

/**
 * Part 2: Count how many times the dial points at 0 DURING any click.
 *
 * Logic:
 * - Same as Part 1, but simulate each individual click.
 * - For "R48", move the dial +1 forty-eight times.
 * - Check if dial === 0 after EACH click, not just at the end.
 * - This catches all the times the dial passes through 0.
 *
 * Example: If dial is at 50 and we do R1000, the dial passes through 0 ten times
 * before ending back at 50.
 */
function part2(lines: string[]) {
    let dial = 50;
    let zeroCount = 0;

    for (const line of lines) {
        if (!line) continue;
        const direction = line[0];
        const amount = parseInt(line.substring(1));

        // Simulate each individual click
        for (let i = 0; i < amount; i++) {
            if (direction === 'R') {
                dial = (dial + 1) % 100;
            } else if (direction === 'L') {
                dial = dial - 1;
                if (dial < 0) dial = 99;
            }

            // Count every time we land on 0 during the rotation
            if (dial === 0) {
                zeroCount++;
            }
        }
    }
    console.log('Part 2 Result:', zeroCount);
}

// Run both parts on example input first (for verification), then real input
part1(exampleLines);
part1(lines);
part2(exampleLines);
part2(lines);
