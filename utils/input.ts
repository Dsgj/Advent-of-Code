import fs from 'fs';
import path from 'path';

/**
 * Reads the input file for a given day.
 * By default invalidates 'input.txt' in the directory of the calling script,
 * or assumes a standard structure if run from root.
 *
 * @param relativePath Relative path to the input file (default: './input.txt')
 * @returns The content of the file as a string.
 */
export function readInput(relativePath: string = './input.txt'): string {
    // If we are running with ts-node, we want to resolve relative to the cwd where the script is run
    // But often in AoC we run `ts-node Day01/solution.ts` from root.
    // This helper tries to find the file relative to the process.cwd() first.

    const fullPath = path.resolve(process.cwd(), relativePath);

    try {
        return fs.readFileSync(fullPath, 'utf-8').trim();
    } catch (error) {
        // If running inside the Day folder directly
        // try just reading it directly?
        // process.cwd() should handle that.
        console.error(`Error reading input file at ${fullPath}:`, error);
        throw error;
    }
}

export function parseLines(input: string): string[] {
    return input.split(/\r?\n/);
}

export function parseBlocks(input: string): string[] {
    return input.split(/\r?\n\r?\n/);
}
