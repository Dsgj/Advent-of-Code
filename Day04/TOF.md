# Day 04: Storage Room - Train of Thought

## Problem Understanding

A grid of rolls (@) and empty spaces. A roll is "accessible" if it has fewer than 4 neighboring rolls.

- Part 1: Count currently accessible rolls
- Part 2: Count total rolls if we keep removing accessible ones

## Part 1: Count Accessible Rolls

### Thinking Process

1. For each roll, count 8-directional neighbors that are also rolls
2. If count < 4, roll is accessible

### Algorithm: **Grid Neighbor Count**

Simple iteration with boundary checks.

**Complexity:** O(rows × cols)

---

## Part 2: Cascade Removal

### Thinking Process

1. Removing one roll may make neighbors accessible
2. Continue until no more accessible rolls
3. Naive simulation could be O(n²) per removal

### Key Insight

This is exactly like **Topological Sort** / **Kahn's Algorithm**!

- "Degree" = neighbor count
- "Accessible" = degree < 4 (like having 0 incoming edges)

### Algorithm: **BFS with Degree Tracking (Peeling Algorithm)**

```
1. Calculate initial degrees for all rolls
2. Add all rolls with degree < 4 to queue
3. While queue not empty:
   - Remove roll, increment count
   - Decrement neighbors' degrees
   - If neighbor becomes < 4, add to queue
```

### Also Known As

- **Layer Peeling**
- **k-core decomposition** (finding vertices with degree < k)

**Complexity:** O(rows × cols) - each cell processed at most once
