import { readInput } from '../utils';

const exampleInput = readInput('Day02/exampleInput.txt');
const input = readInput('Day02/input.txt');

/**
 * Check if a number is "invalid" - meaning it's formed by repeating a digit sequence twice
 * Examples: 55 (5+5), 6464 (64+64), 123123 (123+123)
 */
function isInvalidId(num: bigint): boolean {
    const str = num.toString();
    const len = str.length;

    // Must have even length to be a repeated pattern
    if (len % 2 !== 0) return false;

    const half = len / 2;
    const firstHalf = str.substring(0, half);
    const secondHalf = str.substring(half);

    // Check if both halves are equal and no leading zeros (first char can't be '0')
    return firstHalf === secondHalf && firstHalf[0] !== '0';
}

/**
 * Parse the input to get all ranges
 */
function parseRanges(input: string): Array<{ start: bigint, end: bigint }> {
    const ranges: Array<{ start: bigint, end: bigint }> = [];

    // Split by comma and filter empty entries
    const parts = input.split(',').filter(p => p.trim().length > 0);

    for (const part of parts) {
        const [startStr, endStr] = part.trim().split('-');
        ranges.push({
            start: BigInt(startStr),
            end: BigInt(endStr)
        });
    }

    return ranges;
}

/**
 * Generate all "invalid" numbers of a specific digit length
 * These are numbers formed by repeating a sequence twice
 */
function generateInvalidNumbersOfLength(totalDigits: number): bigint[] {
    if (totalDigits % 2 !== 0) return [];

    const halfLen = totalDigits / 2;
    const result: bigint[] = [];

    // The first half ranges from 10^(halfLen-1) to 10^halfLen - 1
    // For halfLen=1: 1-9
    // For halfLen=2: 10-99
    // etc.
    const minHalf = halfLen === 1 ? 1n : 10n ** BigInt(halfLen - 1);
    const maxHalf = 10n ** BigInt(halfLen) - 1n;

    for (let h = minHalf; h <= maxHalf; h++) {
        const str = h.toString();
        const repeated = str + str;
        result.push(BigInt(repeated));
    }

    return result;
}

/**
 * Find all invalid IDs in the given ranges and return their sum
 */
function part1(input: string): bigint {
    const ranges = parseRanges(input);
    let sum = 0n;

    for (const range of ranges) {
        // Determine the digit lengths we need to check
        const startLen = range.start.toString().length;
        const endLen = range.end.toString().length;

        // Check all even digit lengths in this range
        for (let len = startLen; len <= endLen; len++) {
            if (len % 2 !== 0) continue;

            // Generate all invalid numbers of this length
            const invalidNumbers = generateInvalidNumbersOfLength(len);

            // Check which ones fall within our range
            for (const num of invalidNumbers) {
                if (num >= range.start && num <= range.end) {
                    sum += num;
                }
            }
        }
    }

    return sum;
}

/**
 * Check if a number is invalid under Part 2 rules - 
 * pattern repeated at least twice (2, 3, 4, ... times)
 */
function isInvalidIdPart2(num: bigint): boolean {
    const str = num.toString();
    const len = str.length;

    // Try all possible pattern lengths from 1 to len/2
    for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
        if (len % patternLen !== 0) continue;

        const pattern = str.substring(0, patternLen);

        // Pattern can't have leading zero
        if (pattern[0] === '0') continue;

        // Check if entire string is this pattern repeated
        let matches = true;
        for (let i = patternLen; i < len; i += patternLen) {
            if (str.substring(i, i + patternLen) !== pattern) {
                matches = false;
                break;
            }
        }

        if (matches) return true;
    }

    return false;
}

/**
 * Generate all invalid numbers (Part 2) of a specific total digit length
 * These are numbers where a pattern is repeated 2+ times
 */
function generateInvalidNumbersPart2(totalDigits: number): bigint[] {
    const result: bigint[] = [];
    const seen = new Set<string>();

    // Try all possible pattern lengths that divide totalDigits
    for (let patternLen = 1; patternLen <= totalDigits / 2; patternLen++) {
        if (totalDigits % patternLen !== 0) continue;

        const repetitions = totalDigits / patternLen;

        // Generate all patterns of this length (no leading zeros)
        const minPattern = patternLen === 1 ? 1n : 10n ** BigInt(patternLen - 1);
        const maxPattern = 10n ** BigInt(patternLen) - 1n;

        for (let p = minPattern; p <= maxPattern; p++) {
            const patternStr = p.toString();
            const repeated = patternStr.repeat(repetitions);

            if (!seen.has(repeated)) {
                seen.add(repeated);
                result.push(BigInt(repeated));
            }
        }
    }

    return result;
}

function part2(input: string): bigint {
    const ranges = parseRanges(input);
    let sum = 0n;
    const counted = new Set<string>();

    for (const range of ranges) {
        const startLen = range.start.toString().length;
        const endLen = range.end.toString().length;

        // Check all digit lengths in this range
        for (let len = startLen; len <= endLen; len++) {
            const invalidNumbers = generateInvalidNumbersPart2(len);

            for (const num of invalidNumbers) {
                if (num >= range.start && num <= range.end) {
                    const key = num.toString();
                    if (!counted.has(key)) {
                        counted.add(key);
                        sum += num;
                    }
                }
            }
        }
    }

    return sum;
}

function run(name: string, input: string) {
    console.log(`--- ${name} ---`);
    console.log('Part 1:', part1(input).toString());
    console.log('Part 2:', part2(input).toString());
}

run('Example', exampleInput);
if (input.length > 0) {
    run('Real Input', input);
}
