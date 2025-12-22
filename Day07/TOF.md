# Day 07: Laboratories - Train of Thought

## Problem Understanding

2D grid navigation through laboratories with various rules and pathways.

- Part 1: Path finding through connected areas
- Part 2: Complex multi-region traversal

## Part 1: Grid Traversal

### Thinking Process

1. Parse the grid to identify walkable cells and obstacles
2. Find connected regions or paths between points
3. May need to track visited cells to avoid infinite loops

### Algorithms to Consider

#### Option A: **Breadth-First Search (BFS)**

- Best for: Shortest path, level-by-level exploration
- Use when: Unweighted edges, need minimum steps

#### Option B: **Depth-First Search (DFS)**

- Best for: Exploring all paths, connectivity check
- Use when: Need to find any path, not necessarily shortest

#### Option C: **Flood Fill**

- Best for: Counting regions, marking connected areas
- Variant of BFS/DFS focused on area coverage

### Key Implementation Pattern

```
queue = [start]
visited = Set()
while queue not empty:
    cell = dequeue()
    if cell == target: return success
    for neighbor in getNeighbors(cell):
        if valid(neighbor) and neighbor not in visited:
            visited.add(neighbor)
            queue.add(neighbor)
```

**Complexity:** O(rows × cols)

---

## Part 2: Complex Path Finding

May require:

- **Dijkstra's Algorithm** for weighted edges
- **A\* Search** for heuristic-guided pathfinding
- **State-space search** if carrying items or tracking additional state
