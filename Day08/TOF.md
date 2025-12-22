# Day 08: Tachyon Beam - Train of Thought

## Problem Understanding

3D points representing nodes. Connect closest pairs to form circuits.

- Part 1: Connect N closest pairs, multiply sizes of 3 largest circuits
- Part 2: Find the last connection that unifies all into one circuit

## Part 1: Closest Pair Connections

### Thinking Process

1. Calculate distances between all pairs of points
2. Sort pairs by distance
3. Connect the N closest pairs
4. Find resulting circuit sizes

### Key Insight

Connecting points forms a graph. We need to track connected components (circuits).

### Algorithm: **Union-Find (Disjoint Set Union) + Kruskal's Approach**

```
1. Generate all pairs with distances: O(n²)
2. Sort by distance: O(n² log n)
3. Use Union-Find to track connected components
4. Process N closest pairs, merging components
5. Get sizes of all components, multiply top 3
```

### Union-Find Operations

- `find(x)`: Find root of x's component (with path compression)
- `union(x, y)`: Merge components (with union by rank)
- `getSize(x)`: Get size of x's component

**Complexity:** O(n² log n) for sorting, O(n × α(n)) for unions

---

## Part 2: Minimum Spanning Tree

### Thinking Process

1. Need to connect ALL nodes into one circuit
2. Find the last edge needed to connect everything
3. This is the "worst" edge in the MST!

### Key Insight

The last connection in a MST is the longest edge in the tree. We're essentially building a MST and finding when we achieve full connectivity.

### Algorithm: **Kruskal's MST until Connected**

```
numComponents = n
for pair in sortedPairs:
    if find(pair.i) != find(pair.j):
        union(pair.i, pair.j)
        numComponents--
        if numComponents == 1:
            return pair.i.x * pair.j.x  // Answer formula
```

**Complexity:** O(n² log n)
