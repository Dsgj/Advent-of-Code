import { parseBlocks, parseLines, readInput } from '../utils';

const exampleInput = readInput('Day05/exampleInput.txt');
const input = readInput('Day05/input.txt');

interface Range {
    start: number;
    end: number;
}

function parseInput(rawInput: string): { ranges: Range[], ids: number[] } {
    const blocks = parseBlocks(rawInput);
    if (blocks.length < 2) {
        return { ranges: [], ids: [] };
    }

    const rangeLines = parseLines(blocks[0]);
    const idLines = parseLines(blocks[1]);

    const ranges: Range[] = rangeLines
        .filter(line => line.trim().length > 0)
        .map(line => {
            const [start, end] = line.split('-').map(Number);
            return { start, end };
        });

    const ids: number[] = idLines
        .filter(line => line.trim().length > 0)
        .map(Number);

    return { ranges, ids };
}


function part1(rawInput: string): number {
    const { ranges, ids } = parseInput(rawInput);
    if (ranges.length === 0 && ids.length === 0) return 0;

    let freshCount = 0;
    for (const id of ids) {
        let isFresh = false;
        for (const range of ranges) {
            if (id >= range.start && id <= range.end) {
                isFresh = true;
                break;
            }
        }
        if (isFresh) {
            freshCount++;
        }
    }
    return freshCount;
}


function part2(rawInput: string): number {
    const { ranges } = parseInput(rawInput);
    if (ranges.length === 0) return 0;

    // Sort ranges by start
    ranges.sort((a, b) => a.start - b.start);

    const merged: Range[] = [];
    merged.push({ ...ranges[0] });

    for (let i = 1; i < ranges.length; i++) {
        const current = ranges[i];
        const last = merged[merged.length - 1];

        // If current overlaps or touches last (e.g. 5 and 6 are contiguous)
        // Actually, for integer counting, even if they don't touch, we just sum lengths.
        // We only MUST merge if they overlap to avoid double counting.
        // Contiguous (touching) merge is optional but cleaner.
        // Overlap: current.start <= last.end
        // Touching: current.start === last.end + 1
        if (current.start <= last.end + 1) {
            last.end = Math.max(last.end, current.end);
        } else {
            merged.push({ ...current });
        }
    }

    let totalCount = 0;
    for (const range of merged) {
        totalCount += (range.end - range.start + 1);
    }

    return totalCount;
}


function run(label: string, rawInput: string) {
    console.log(`--- ${label} ---`);
    console.log('Part 1 Result:', part1(rawInput));
    console.log('Part 2 Result:', part2(rawInput));
}

console.log('--- Day 5: Cafeteria ---');
run('Example', exampleInput);
if (input) {
    run('Real Input', input);
}

