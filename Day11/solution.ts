import { readInput } from '../utils';

function parseInput(input: string): Map<string, string[]> {
    const adj = new Map<string, string[]>();
    const lines = input.trim().split(/\r?\n/);
    for (const line of lines) {
        const [src, dsts] = line.split(': ');
        if (dsts) {
            adj.set(src, dsts.split(' '));
        } else {
            adj.set(src, []);
        }
    }
    return adj;
}

function countPaths(current: string, target: string, adj: Map<string, string[]>, memo: Map<string, number>): number {
    if (current === target) {
        return 1;
    }
    if (memo.has(current)) {
        return memo.get(current)!;
    }

    let paths = 0;
    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
        paths += countPaths(neighbor, target, adj, memo);
    }

    memo.set(current, paths);
    return paths;
}

export function part1(input: string): number {
    const adj = parseInput(input);
    const memo = new Map<string, number>();
    return countPaths('you', 'out', adj, memo);
}

export function part2(input: string): number {
    const adj = parseInput(input);

    // Path 1: svr -> dac -> fft -> out
    const dacBeforeFft =
        countPaths('svr', 'dac', adj, new Map()) *
        countPaths('dac', 'fft', adj, new Map()) *
        countPaths('fft', 'out', adj, new Map());

    // Path 2: svr -> fft -> dac -> out
    const fftBeforeDac =
        countPaths('svr', 'fft', adj, new Map()) *
        countPaths('fft', 'dac', adj, new Map()) *
        countPaths('dac', 'out', adj, new Map());

    return dacBeforeFft + fftBeforeDac;
}

export function run() {
    const exampleInput = readInput('Day11/exampleInput.txt');
    const exampleInput2 = readInput('Day11/exampleInput2.txt');
    const input = readInput('Day11/input.txt');

    console.log('--- Example ---');
    console.log('Part 1:', part1(exampleInput).toString());
    console.log('Part 2:', part2(exampleInput2).toString());

    if (input) {
        console.log('--- Real Input ---');
        console.log('Part 1:', part1(input).toString());
        console.log('Part 2:', part2(input).toString());
    }
}

if (require.main === module) {
    run();
}
