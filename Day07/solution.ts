import { readInput } from '../utils';

const exampleInput = readInput('Day07/exampleInput.txt');
const input = readInput('Day07/input.txt');

interface Point {
    x: number;
    y: number;
}

function part2(input: string): number {
    const lines = input.trim().split(/\r?\n/);
    const height = lines.length;
    const width = lines[0].length;

    // Map of "x,y" -> count of timelines ending up here
    let timelineCounts = new Map<string, number>();

    // Find S
    for (let y = 0; y < height; y++) {
        const x = lines[y].indexOf('S');
        if (x !== -1) {
            timelineCounts.set(`${x},${y}`, 1);
            break;
        }
    }

    if (timelineCounts.size === 0) return 0; // No start found

    let totalExitedTimelines = 0;

    // Simulation loop
    // Process row by row effectively, but tracked by active beam positions.
    // We can iterate until no beams are left on the grid.
    while (timelineCounts.size > 0) {
        const nextTimelineCounts = new Map<string, number>();

        for (const [key, count] of timelineCounts.entries()) {
            const [xStr, yStr] = key.split(',');
            const x = parseInt(xStr);
            const y = parseInt(yStr);

            const nextX = x;
            const nextY = y + 1;

            if (nextY >= height) {
                // Beam exits the manifold
                totalExitedTimelines += count;
                continue;
            }

            const cell = lines[nextY][nextX];

            if (cell === '^') {
                // Split: 1 particle -> 2 timelines (Left + Right)
                // Existing count `count` splits into `count` going left and `count` going right.

                // Left
                if (nextX - 1 >= 0) {
                    const lKey = `${nextX - 1},${nextY}`;
                    const currentL = nextTimelineCounts.get(lKey) || 0;
                    nextTimelineCounts.set(lKey, currentL + count);
                }
                // Right
                if (nextX + 1 < width) {
                    const rKey = `${nextX + 1},${nextY}`;
                    const currentR = nextTimelineCounts.get(rKey) || 0;
                    nextTimelineCounts.set(rKey, currentR + count);
                }
            } else {
                // Continue: 1 particle -> 1 timeline (Straight down)
                const nextKey = `${nextX},${nextY}`;
                const currentNext = nextTimelineCounts.get(nextKey) || 0;
                nextTimelineCounts.set(nextKey, currentNext + count);
            }
        }
        timelineCounts = nextTimelineCounts;
    }

    return totalExitedTimelines;
}
function part1(input: string): number {
    const lines = input.trim().split(/\r?\n/);
    const height = lines.length;
    const width = lines[0].length;

    let beams: Point[] = [];

    // Find S
    for (let y = 0; y < height; y++) {
        const x = lines[y].indexOf('S');
        if (x !== -1) {
            beams.push({ x, y });
            break;
        }
    }

    if (beams.length === 0) return 0; // No start found

    let splitCount = 0;

    // Simulation loop
    // Since beams always move downwards, we can assume finite simulation.
    // However, splitters might keep beams at the same Y (no, new beams are immediate left/right at same Y).
    // Let's trace carefully:
    // If at (x, y) we hit ^, new beams are (x-1, y) and (x+1, y).
    // In next step, they move to y+1.
    // So Y essentially increases every step? No.
    // In the step where we hit ^, we DON'T move Y. We just replace beam with two others at SAME Y.
    // THEN in next iteration, process those.
    // Wait, if new beams are at same Y, and we process them in same iteration?
    // Let's use two lists: currentBeams and nextBeams.

    // Actually, looking at the diagram:
    // Row 2: ^
    // Row 3: .
    // The new beams appear to 'continue' from the splitter.
    // If I split at (x,y), new beams are at (x-1, y) and (x+1, y).
    // If I process those immediately, they will move to (x-1, y+1) and (x+1, y+1).
    // This seems right because they "extend downward".
    // 
    // Wait, the diagram shows:
    // .......|.......
    // ......|^|......
    // ......|.|......
    //
    // The | characters are the PATH.
    // At row 2 (index 2), we have |^|. The center ^ is the splitter. The | left and right are the new beams.
    // So at step T, we were at (x, y-1).
    // At step T+1, we move to (x, y). It is a splitter.
    // So we effectively spawn at (x-1, y) and (x+1, y).
    // 
    // The question is: do those new beams move DOWN immediately in the same step?
    // "Instead, a new tachyon beam continues from the immediate left and from the immediate right of the splitter."
    // 
    // If we look at the vertical spacing:
    // S is row 0.
    // ^ is row 2.
    // Distance is 2.
    // Beam travels 0->1->2.
    // At 2, it splits.
    // New beams are at row 2.
    // Next step they are at row 3.
    // So yes, split happens, beams remain at row Y for that step, and move to Y+1 next step.

    // But wait, can a new beam land on ANOTHER splitter immediately?
    // "...|^|^|..."
    // If we have ^.^ (splitter, space, splitter).
    // Beam 1 hits left splitter. Spawns Left, Right.
    // Right spawn might land on the Right splitter?
    // "Tachyon beams pass freely through empty space".
    // "if a tachyon beam encounters a splitter (^)..."
    // 
    // If the layout is `^^`.
    // Beam hits left `^`. Spawns at right `^`.
    // Does that immediately trigger another split?
    // The text says "a new tachyon beam continues from...".
    // If the "immediate right" is ALSO a splitter, likely it splits again?
    // But we are in a discretised grid.
    // Let's assume standard cellular automaton rules: update all based on previous state.
    // 
    // State T: Beam at (x, y-1).
    // State T+1: Move to (x, y). Check (x, y).
    // If (x,y) is ^:
    //   Exclude (x,y) from next steps.
    //   add (x-1, y) and (x+1, y) to 'Pending Beams' for THIS step?
    //   Or just NextBeams for NEXT step?
    //   If I add to NextBeams (positions for T+1), I should effectively add (x-1, y) and (x+1, y) as STARTING points for next move?
    //   Wait, if I add (x-1, y) to active beams, in next loop it will try to move to (x-1, y+1).
    //   This implies we consumed the 'stay at y' phase.
    //   
    //   Let's ensure we account for chained splitters `^^`.
    //   If I spawn at (x+1, y) and that is `^`.
    //   If I just treat it as a beam at (x+1, y), next loop moves to (x+1, y+1).
    //   It effectively passes THROUGH the splitter? No!
    //   It should interact with the splitter.
    //   
    //   So if I spawn a beam at `pos`, I must check `grid[pos]`.
    //   If `grid[pos]` is `^`, it splits *immediately*?
    //   Or does it count as "entering"?
    //   "encounters a splitter".
    //   
    //   Hypothesis: Multi-pass resolution for a single time step?
    //   Or maybe splitters are sparse enough this edge case is rare?
    //   "Manifold".
    //   Let's check the example.
    //   The splitters form a triangle.
    //   Row 4: `^.^`.
    //   Beam 1 from (6,3) hits (6,4) `^`.
    //   Beam 2 from (8,3) hits (8,4) `^`.
    //   
    //   Left spawn of (6,4) -> (5,4).
    //   Right spawn of (6,4) -> (7,4). (Space).
    //   Left spawn of (8,4) -> (7,4). (Space).
    //   Right spawn of (8,4) -> (9,4).
    //   
    //   If we process strictly step-by-step:
    //   Active Beams: [(6,3), (8,3)].
    //   Move Down -> Candidates: [(6,4), (8,4)].
    //   Check Candidates:
    //     (6,4) is ^ -> Split! Count++. New Candidates for NOW: (5,4), (7,4).
    //     (8,4) is ^ -> Split! Count++. New Candidates for NOW: (7,4), (9,4).
    //   
    //   Recursively check new candidates?
    //   If (5,4) was `^`?
    //   It seems logical it should split. 
    //   But the beam "continues from".
    //   The "beam" consists of moving particles.
    //   If it spawns AT a splitter, it hits it.
    //   
    //   So, algorithm:
    //   Queue of *new positions* to process.
    //   Start with S.
    //   In each step:
    //     Move all current beams down by 1.
    //     Queue = [moved_beams].
    //     NextBeams = [].
    //     While Queue is not empty:
    //       curr = Queue.pop().
    //       If `^`:
    //         SplitCount++
    //         Add (curr.x - 1, curr.y) to Queue (to be checked immediately!)
    //         Add (curr.x + 1, curr.y) to Queue
    //       Else (`.`):
    //         Add curr to NextBeams (safely resides here, moves down next step)
    //   
    //   Wait, infinite loop risk? `^` spawns left/right. `^^` -> left spawns right, right spawns left...
    //   If `^^`
    //   Hit left. Spawn left (ok), spawn right (hit right ^).
    //   Hit right ^. Spawn left (hit left ^), spawn right (ok).
    //   Infinite ping pong?
    //   "Tachyon beams always move downward".
    //   Maybe the spawn is implicitly "and move down"?
    //   "continue from the immediate left and from the immediate right...".
    //   
    //   Let's look at the "dumping into same place" part again.
    //   "At this point, the two splitters create a total of only three tachyon beams".
    //   Beams at (6,4) and (8,4) split.
    //   Resulting beams: (5,4), (7,4), (9,4).
    //   They are all on Row 4.
    //   They will move to Row 5 next.
    //   
    //   So the split consumes the "stay" on Row 4.
    //   So if I spawn at (x-1, y), that beam is DONE with Row 4 interactions and will move to Row 5 next.
    //   It does NOT check for splitter at (x-1, y).
    //   If it did, and (x-1, y) was a splitter, it would split again on the SAME row.
    //   The example text says "process continues".
    //   
    //   Let's check if the example has adjacent splitters.
    //   The example has `^.^` (gap).
    //   Later: `.....|^|^|.....` -> beams at 5, 6, 7?
    //   Wait, line 5 in visual: `.....|^|^|.....`
    //   This corresponds to Row 4 split results?
    //   Row 4 was `......^.^......`.
    //   The visual shows `|` at 5, 7, 9.
    //   Wait, the visual has `|^|^|`. That is `|` at 5, `^` at 6, `|` at 7, `^` at 8, `|` at 9?
    //   Visual: `..... | ^ | ^ | .....`
    //   This means beams are at 5, 7, 9. The splitters at 6 and 8 are visible.
    //   
    //   Okay, so the split results DO NOT interact with anything else on the same row.
    //   They just exist there and proceed to next row in next step.
    //   
    //   Revised Algorithm:
    //   Beams: Set of unique Xs. (Since all beams are at same Y front? No, they might be desynchronized if paths differ?
    //   Actually, "Tachyon beams always move downward".
    //   This implies they are all synchronized by Row.
    //   Step 1: Row 0.
    //   Step 2: Row 1.
    //   ...
    //   So allow duplication handling via Set of X coords.
    //   
    //   For each row Y from 0 to Height-1:
    //     For each active beam X:
    //        Cell = grid[Y][X]
    //        If Cell == ^:
    //           SplitCount++
    //           NextRowBeams.add(X-1)
    //           NextRowBeams.add(X+1)
    //        Else:
    //           NextRowBeams.add(X)
    //     
    //     Wait, we simply move active beams to Y+1.
    //     Process grid[Y+1].
    //
    //   Let's trace Example again.
    //   Start: [{x:7, y:0}].
    //   
    //   Loop Beams:
    //     Pop (7, 0).
    //     Next is (7, 1). Grid is `.`.
    //     Add (7, 1) to NextBeams.
    //   
    //   Loop Beams (NextBeams):
    //     Pop (7, 1).
    //     Next is (7, 2). Grid is `^`.
    //     Split! Count=1.
    //     Add (6, 2) to NextBeams.
    //     Add (8, 2) to NextBeams.
    //     (Do NOT check grid at (6,2) or (8,2) yet. Just place them there).
    //     
    //   Loop Beams:
    //     Pop (6, 2). Next (6, 3). Grid `.`. Add (6, 3).
    //     Pop (8, 2). Next (8, 3). Grid `.`. Add (8, 3).
    //     
    //   Loop Beams:
    //     Pop (6, 3). Next (6, 4). Grid `^`.
    //       Split! Count=2. Add (5, 4), (7, 4).
    //     Pop (8, 3). Next (8, 4). Grid `^`.
    //       Split! Count=3. Add (7, 4), (9, 4).
    //     
    //     Deduped NextBeams: (5,4), (7,4), (9,4).
    //     
    //   This logic holds perfectly.
    //   Wait, what if a beam spawns out of bounds?
    //   "exit the manifold".
    //   So filter X coords.

    //   Is it BFS?
    //   Yes, BFS is fine.

    while (beams.length > 0) {
        const nextBeams = new Map<string, Point>(); // "x,y" -> Point

        for (const beam of beams) {
            // Attempt move down
            // But wait, the "split" places beams at same Y.
            // My trace above:
            // "Add (6, 2) to NextBeams." -> processed in next loop.
            // Next loop: Pop (6, 2). Next is (6, 3).
            // This means from T=2 to T=3, beam moved from (6,2) to (6,3).
            // But it just arrived at (6,2)!
            // 
            // Correct flow:
            // 1. Beam at (x, y).
            // 2. Identify target (x, y+1).
            // 3. Process target:
            //    If `^` at target:
            //       Split. Record 2 new beams at (x-1, y+1) and (x+1, y+1).
            //    If `.` at target:
            //       Move. Record 1 new beam at (x, y+1).
            //    If out of bounds: 
            //       Die.

            const nextX = beam.x;
            const nextY = beam.y + 1;

            if (nextY >= height) continue; // Exit bottom

            const cell = lines[nextY][nextX];

            if (cell === '^') {
                splitCount++;
                // Left
                if (nextX - 1 >= 0) {
                    const key = `${nextX - 1},${nextY}`;
                    nextBeams.set(key, { x: nextX - 1, y: nextY });
                }
                // Right
                if (nextX + 1 < width) {
                    const key = `${nextX + 1},${nextY}`;
                    nextBeams.set(key, { x: nextX + 1, y: nextY });
                }
            } else {
                const key = `${nextX},${nextY}`;
                nextBeams.set(key, { x: nextX, y: nextY });
            }
        }
        beams = Array.from(nextBeams.values());
    }

    return splitCount;
}

function run(label: string, rawInput: string) {
    console.log(`--- ${label} ---`);
    console.log('Part 1 Result:', part1(rawInput));
    console.log('Part 2 Result:', part2(rawInput));
}

console.log('--- Day 7: Laboratories ---');
if (exampleInput) {
    run('Example', exampleInput);
}
if (input) {
    run('Real Input', input);
}
