# Day 12: Christmas Tree Farm - Train of Thought

## Problem Understanding

This is a classic **polyomino packing problem** (also known as exact cover with polyominoes). We need to determine if a set of polyomino shapes can be placed into a rectangular grid without overlapping.

**Key observations:**

- Each shape can be rotated (0°, 90°, 180°, 270°) and flipped
- Shapes cannot overlap but can interlock
- We need to count how many regions can fit ALL their required shapes

## Thinking Process

1. **Parse the input** into normalized shapes (coordinate sets) and regions
2. **Generate all variants** for each shape (rotations + reflections = up to 8 unique orientations)
3. **For each region**, use backtracking to try placing all required pieces
4. **Count** regions where a valid placement exists

## Key Insight

The naive approach would be O((W×H×8)^P) where P is the number of pieces - exponential but manageable for small inputs. The key optimization is:

- **Sort pieces by size** (largest first) for better early pruning
- **Pre-compute variants** to avoid recalculating rotations
- **Quick area check** - reject if total piece area > grid area

⚠️ **Important:** A common optimization (always fill the first empty cell) **doesn't work here** because shapes can interlock in creative ways where no single shape covers the top-left empty cell in the optimal solution.

## Algorithm

**Backtracking with Constraint Satisfaction:**

```
solve(pieces, pieceIndex, grid):
    if pieceIndex >= pieces.length:
        return true  // All pieces placed!

    shape = pieces[pieceIndex]
    for each variant of shape:
        for each position (row, col) in grid:
            if canPlace(variant, row, col):
                place(variant, row, col)
                if solve(pieces, pieceIndex + 1, grid):
                    return true
                remove(variant, row, col)

    return false  // No valid placement found
```

## Complexity

- **Time:** O(V×W×H)^P where V=variants per shape (~4-8), W,H=grid dimensions, P=pieces
- **Space:** O(W×H) for the grid + O(P) recursion stack

For typical AoC inputs (small grids, few pieces), this runs in seconds.

## What I Learned

- Pre-generating shape variants using rotation/reflection matrices
- Why certain "obvious" optimizations can break correctness
- The importance of testing with expected outputs before optimizing
