import { readInput } from '../utils';

const exampleInput = readInput('Day06/exampleInput.txt');
const input = readInput('Day06/input.txt');

function getPaddedLines(rawInput: string): string[] {
    const lines = rawInput.split(/\r?\n/);
    if (lines.length === 0) return [];
    const width = Math.max(...lines.map(line => line.length));
    // Pad lines to ensure square access
    return lines.map(line => line.padEnd(width, ' '));
}

function identifyBlockRanges(paddedLines: string[]): { start: number, end: number }[] {
    if (paddedLines.length === 0) return [];
    const height = paddedLines.length;
    const width = paddedLines[0].length;

    // Identify columns that are NOT separators (contain at least one non-space char)
    const isContentCol: boolean[] = [];
    for (let x = 0; x < width; x++) {
        let hasContent = false;
        for (let y = 0; y < height; y++) {
            if (paddedLines[y][x] !== ' ') {
                hasContent = true;
                break;
            }
        }
        isContentCol.push(hasContent);
    }

    // Group contiguous content columns into blocks
    const blockRanges: { start: number, end: number }[] = [];
    let start = -1;
    for (let x = 0; x < width; x++) {
        if (isContentCol[x]) {
            if (start === -1) start = x;
        } else {
            if (start !== -1) {
                blockRanges.push({ start, end: x - 1 });
                start = -1;
            }
        }
    }
    if (start !== -1) {
        blockRanges.push({ start, end: width - 1 });
    }
    return blockRanges;
}

function solveBlockPart1(block: { start: number, end: number }, paddedLines: string[]): number {
    const height = paddedLines.length;

    // Extract tokens from the block's columns
    const allTokens: string[] = [];

    for (let y = 0; y < height; y++) {
        const rowSlice = paddedLines[y].slice(block.start, block.end + 1);
        if (!rowSlice.trim()) continue;

        const rowTokens = rowSlice.trim().split(/\s+/);
        allTokens.push(...rowTokens);
    }

    // Find operator
    const operators = allTokens.filter(t => t === '+' || t === '*');
    const numberTokens = allTokens.filter(t => t !== '+' && t !== '*');

    if (operators.length === 0) return 0;

    // Part 1 logic: Operator is at the bottom, but we just need one.
    // The problem statement implies one operator per problem.
    const operator = operators[operators.length - 1];
    const numbers = numberTokens.map(Number);

    if (numbers.length === 0) return 0;

    if (operator === '+') {
        return numbers.reduce((a, b) => a + b, 0);
    } else if (operator === '*') {
        return numbers.reduce((a, b) => a * b, 1);
    }
    return 0;
}

function solveBlockPart2(block: { start: number, end: number }, paddedLines: string[]): number {
    const height = paddedLines.length;

    // Find operator first. It should be the only non-digit non-space character in the block.
    // It is usually at the bottom.
    // Let's scan the block area.
    let operator = '';
    for (let y = 0; y < height; y++) {
        for (let x = block.start; x <= block.end; x++) {
            const char = paddedLines[y][x];
            if (char === '+' || char === '*') {
                operator = char;
            }
        }
    }

    if (!operator) return 0;

    const numbers: number[] = [];

    // Iterate columns from RIGHT to LEFT
    for (let x = block.end; x >= block.start; x--) {
        let digitStr = '';
        for (let y = 0; y < height; y++) {
            const char = paddedLines[y][x];
            // Ignore spaces and the operator itself
            if (char !== ' ' && char !== '+' && char !== '*') {
                digitStr += char;
            }
        }

        if (digitStr.length > 0) {
            numbers.push(parseInt(digitStr, 10));
        }
    }

    if (numbers.length === 0) return 0;

    if (operator === '+') {
        return numbers.reduce((a, b) => a + b, 0);
    } else if (operator === '*') {
        return numbers.reduce((a, b) => a * b, 1);
    }
    return 0;
}

function part1(rawInput: string): number {
    const paddedLines = getPaddedLines(rawInput);
    const blocks = identifyBlockRanges(paddedLines);
    let grandTotal = 0;
    for (const block of blocks) {
        grandTotal += solveBlockPart1(block, paddedLines);
    }
    return grandTotal;
}

function part2(rawInput: string): number {
    const paddedLines = getPaddedLines(rawInput);
    const blocks = identifyBlockRanges(paddedLines);
    let grandTotal = 0;
    for (const block of blocks) {
        grandTotal += solveBlockPart2(block, paddedLines);
    }
    return grandTotal;
}

function run(label: string, rawInput: string) {
    console.log(`--- ${label} ---`);
    console.log('Part 1 Result:', part1(rawInput));
    console.log('Part 2 Result:', part2(rawInput));
}

console.log('--- Day 6: Trash Compactor ---');
if (exampleInput) {
    run('Example', exampleInput);
}
if (input) {
    run('Real Input', input);
}
