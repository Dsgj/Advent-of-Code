import { readInput } from '../utils';

const exampleInput = readInput('Day03/exampleInput.txt');
const input = readInput('Day03/input.txt');

/**
 * Find the maximum joltage (two-digit number) that can be produced by
 * selecting exactly 2 batteries from a bank.
 * 
 * Strategy: For each possible first digit position, find the maximum
 * digit that comes after it. Track the overall maximum.
 */
/**
 * Find the maximum joltage (two-digit number) that can be produced by
 * selecting exactly 2 batteries from a bank (indices i < j).
 * 
 * Optimization: Uses a single pass O(N) approach.
 * We iterate through the second digit (j) and pair it with the 
 * maximum digit found so far to its left (i < j).
 */
function maxJoltage(bank: string): number {
    const digits = bank.split('').map(Number);
    let maxValue = 0;

    if (digits.length < 2) return 0;

    let maxFirstDigit = digits[0];

    // Iterate through potential second digits (starting from index 1)
    for (let j = 1; j < digits.length; j++) {
        const currentDigit = digits[j];

        // Calculate potential value with best previous first digit
        const joltage = maxFirstDigit * 10 + currentDigit;
        if (joltage > maxValue) {
            maxValue = joltage;
        }

        // Update max first digit for future iterations
        if (currentDigit > maxFirstDigit) {
            maxFirstDigit = currentDigit;
        }
    }

    return maxValue;
}

/**
 * Part 1: Find the total output joltage by summing the maximum
 * joltage from each bank.
 */
function part1(input: string): number {
    const banks = input.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let totalJoltage = 0;

    for (const bank of banks) {
        const joltage = maxJoltage(bank);
        totalJoltage += joltage;
    }

    return totalJoltage;
}

/**
 * Find the maximum joltage by selecting exactly `count` batteries.
 * Uses a greedy algorithm: at each step, pick the highest digit
 * while ensuring enough digits remain to complete the selection.
 */
function maxJoltageN(bank: string, count: number): bigint {
    const digits = bank.split('');
    const n = digits.length;

    if (count > n) {
        throw new Error(`Cannot select ${count} digits from bank of length ${n}`);
    }

    let result = '';
    let startPos = 0;

    for (let i = 0; i < count; i++) {
        const digitsRemaining = count - i;
        // We can pick from startPos to (n - digitsRemaining) inclusive
        const endPos = n - digitsRemaining;

        // Find the maximum digit in range [startPos, endPos]
        let maxDigit = '0';
        let maxPos = startPos;

        for (let pos = startPos; pos <= endPos; pos++) {
            if (digits[pos] > maxDigit) {
                maxDigit = digits[pos];
                maxPos = pos;
            }
        }

        result += maxDigit;
        startPos = maxPos + 1;
    }

    return BigInt(result);
}

/**
 * Part 2: Find the total output joltage by selecting exactly 12 batteries
 * from each bank.
 */
function part2(input: string): bigint {
    const banks = input.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let totalJoltage = 0n;

    for (const bank of banks) {
        const joltage = maxJoltageN(bank, 12);
        totalJoltage += joltage;
    }

    return totalJoltage;
}

function run(name: string, input: string) {
    console.log(`--- ${name} ---`);
    console.log('Part 1:', part1(input));
    console.log('Part 2:', part2(input).toString());
}

run('Example', exampleInput);
if (input.length > 0) {
    run('Real Input', input);
}
