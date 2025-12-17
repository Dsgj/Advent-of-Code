import { readInput, parseLines } from '../utils';

const exampleInput = readInput('DayXX/exampleInput.txt');
const input = readInput('DayXX/input.txt');
const exampleLines = parseLines(exampleInput);
const lines = parseLines(input);

function part1(lines: string[]) {
    // TODO: Implement Part 1
    return 'TODO';
}

function part2(lines: string[]) {
    // TODO: Implement Part 2
    return 'TODO';
}

function run(name: string, lines: string[]) {
    console.log(`--- ${name} ---`);
    console.log('Part 1:', part1(lines));
    console.log('Part 2:', part2(lines));
}

run('Example', exampleLines);
run('Real Input', lines);
